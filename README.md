# Cloudflare WebDNS
This project provides a web application to manage your cloudflare dns records using an api token.

## Motivation
Cloudflare itself only allows another person to access the entire account, but not a single domain.  
This is possible with API tokens, to manage the DNS settings in a simple web interface this project was developed.

## How to use it
This project is based on two parts. The first part is the "Backend" which is a simple cloudflare worker to bypass
[Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) Headers.
You can host this "proxy" in cloudflare workers. Feel free to use my worker using [webdns.an2ic3.workers.dev](https://webdns.an2ic3.workers.dev).
```node
addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  url.hostname = 'api.cloudflare.com';
  request.headers.Host = 'api.cloudflare.com';

  // handle cors options
  if (request.method == 'OPTIONS') {
    return new Response("", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    });
  }

  let response = await fetch(url.toString(), request);
  response = new Response(response.body, response)
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

The other part is the frontend itself, which is provided in this repository. It's also hosted in cloudflare pages, checkout: [webdns.pages.dev](https://webdns.pages.dev).

You need an API Token to log in to the panel. This token can be acquired [here (dash.cloudflare.com/profile/api-tokens)](https://dash.cloudflare.com/profile/api-tokens).
