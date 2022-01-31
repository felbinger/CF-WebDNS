const base = 'https://webdns.an2ic3.workers.dev/client/v4';

async function doCfRequest(method, url, token, body) {
    return fetch(`${base}/${url}`, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body
    });
}

async function isTokenValid(token) {
    let response = await doCfRequest('GET', '/zones', token);
    return response.status === 200;
}

async function getZones(token) {
    let response = await doCfRequest('GET', 'zones?status=active', token);
    let data = [];
    let responseData = await response.json();
    responseData.result.forEach((zone, i) => {
        data.push({
            id: zone['id'],
            name: zone['name'],
            // the token might have access to domains from shared cloudflare accounts
            account: zone['account'],
        });
    });
    return data;
}

async function getDnsRecords(token, zone_id) {
    let response = await doCfRequest('GET', `zones/${zone_id}/dns_records`, token);
    let data = [];
    let responseData = await response.json();
    responseData.result.forEach((zone, i) => {
        data.push({
            id: zone['id'],
            type: zone['type'],
            name: zone['name'],
            content: zone['content'],
            proxied: zone['proxied'],
        });
    });
    return data;
}

async function getDnsRecord(token, zone_id, record_id) {
    let response = await doCfRequest('GET', `zones/${zone_id}/dns_records/${record_id}`, token);
    let responseData = await response.json();
    return {
        id: responseData.result.id,
        type: responseData.result.type,
        name: responseData.result.name,
        content: responseData.result.content,
        proxied: responseData.result.proxied,
    };
}

async function createDnsRecords(token, zone_id, { type, name, content, proxied }) {
    await doCfRequest('POST', `zones/${zone_id}/dns_records`, token,
        JSON.stringify({
            "type": type,
            "name": name,
            "content": content,
            "proxied": proxied,
        })
    );
    return getDnsRecords(token, zone_id);
}

async function updateDnsRecords(token, zone_id, record_id, { type, name, content, proxied }) {
    await doCfRequest('PUT', `/zones/${zone_id}/dns_records/${record_id}`, token,
        JSON.stringify({
            "type": type,
            "name": name,
            "content": content,
            "proxied": proxied,
        })
    );
    return getDnsRecords(token, zone_id);
}

async function deleteDnsRecords(token, zone_id, record_id) {
    let response = await doCfRequest('DELETE', `zones/${zone_id}/dns_records/${record_id}`, token);
    return (await response.json()).success;
}

