(async () => {
    const token = "90Cq0t6GYtTB5rAsOx0vgukjteWyx-e5WYJcrzMl";

    if (!token)
        return

    let printable;
    
    /* get all zones */
    printable = [];
    (await getZones(token)).forEach((zone, i) => {
        printable.push({
            'Name': zone['name'],
            'Account ID': zone['account']['id'],
            'Zone ID': zone['id'],
        });
    });
    console.table(printable);

    /* list dns records by one specific zone id */
    printable = [];
    (await getDnsRecords(token, "fc313db59a2b3f4e3af361d3e5a1d51a")).forEach((record, i) => {
        printable.push({
            'Id': record['id'],
            'Type': record['type'],
            'Name': record['name'],
            'Content': record['content'],
            'Proxied': record['proxied'],
        });
    });
    console.table(printable);

    /* create dns record with zone_id */
    printable = [];
    (await createDnsRecords(
        token,
        "fc313db59a2b3f4e3af361d3e5a1d51a", {
            "type": "A",
            "name": "test",
            "content": "1.1.1.1",
            "proxied": false,
        })).forEach((record, i) => {
        printable.push({
            'Id': record['id'],
            'Type': record['type'],
            'Name': record['name'],
            'Content': record['content'],
            'Proxied': record['proxied'],
        });
    });
    console.table(printable);

    /* update dns record with zone_id */
    record_id = printable[0].Id;
    printable = [];
    (await updateDnsRecords(
        token, 
        "fc313db59a2b3f4e3af361d3e5a1d51a",
        record_id, {        
            "type": "AAAA",
            "name": "test",
            "content": "::100",
            "proxied": true,
        })).forEach((record, i) => {
        printable.push({
            'Id': record['id'],
            'Type': record['type'],
            'Name': record['name'],
            'Content': record['content'],
            'Proxied': record['proxied'],
        });
    });
    console.table(printable);

    /* delete created dns record by zone_id and record_id */
    if (await deleteDnsRecords(token, "fc313db59a2b3f4e3af361d3e5a1d51a", record_id)) {
        console.log("Created record has been deleted!");    
    }

    /* create srv dns record, cause the structure differs from the a/aaaa/cname, ...*/
    // https://community.cloudflare.com/t/srv-record-using-api-v4/29905/3
    //'{"type": "SRV", "data": {"service": "_minecraft", "proto": "_tcp", "name": "example.net", "priority": 1, "weight": 5, "port": 25565, "target": "example.net"}}'
})();

