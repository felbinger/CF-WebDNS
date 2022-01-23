storage = window.sessionStorage;
const token = storage.getItem('token');

async function updateDnsRecordTable() {
    (await getDnsRecords(
        token,
        document.getElementById("zones").value,
    )).forEach((record, i) => {
        document.getElementById('records').innerHTML += `
            <tr>
                <td style="width: 5%">${record['type']}</td>
                <td style="width: 15%">${record['name']}</td>
                <td>${record['content']}</td>
                <td>${record['proxied']}</td>
                <td style="width: 5%">
                    <a href="#"><i class="fas fa-pen"></i></a>
                </td>
            </tr>`;
    });
}

(async () => {
    (await getZones(token)).forEach((zone, i) => {
        document.getElementById('zones').appendChild(
            new Option(`${zone['name']} (${zone['account']['name']})`, zone['id'])
        );
    });

    await updateDnsRecordTable();

    document.getElementById('zones').addEventListener('change', async e => {
        e.preventDefault();
        document.getElementById('records').innerHTML = "";
        await updateDnsRecordTable();
    });
})();