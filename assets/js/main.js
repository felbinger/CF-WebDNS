function escapeHtml(text) {
    if (!text) {
        return text;
    }

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}


storage = window.sessionStorage;
const token = storage.getItem('token');

let updateDnsRecordModal = new bootstrap.Modal(document.getElementById('updateDnsRecordModal'), {});
let createDnsRecordModal = new bootstrap.Modal(document.getElementById('createDnsRecordModal'), {});

if (!token) {
    window.location = "login.html";
}

async function updateDnsRecordTable() {
    document.getElementById('records').innerHTML = "";
    (await getDnsRecords(
        token,
        document.getElementById("zones").value,
    )).forEach((record, i) => {
        document.getElementById('records').innerHTML += `
            <tr>
                <td style="width: 5%">${escapeHtml(record['type'])}</td>
                <td style="width: 15%">${escapeHtml(record['name'])}</td>
                <td>${escapeHtml(record['content'])}</td>
                <td${Boolean(record['proxied'])}</td>
                <td style="width: 5%">
                    <a onclick="openDnsRecordUpdateModal(\'${escapeHtml(record['id'])}\')"><i class="fas fa-pen"></i></a>
                </td>
            </tr>`;
    });
}

async function openDnsRecordUpdateModal(recordId) {
    let zoneId = document.getElementById("zones").value;
    let responseData = await getDnsRecord(token, zoneId, recordId);
    document.getElementById("updateRecordId").value = recordId;
    document.getElementById("updateRecordType").value = responseData.type;
    document.getElementById("updateRecordName").value = responseData.name;
    document.getElementById("updateRecordContent").value = responseData.content;
    document.getElementById("updateRecordProxied").checked = responseData.proxied;
    updateDnsRecordModal.show();
}
async function openDnsRecordCreateModal(recordId) {
    createDnsRecordModal.show();
}

// add dns records to html table
(async () => {
    (await getZones(token)).forEach((zone, i) => {
        document.getElementById('zones').appendChild(
            new Option(`${zone['name']} (${zone['account']['name']})`, zone['id'])
        );
    });

    await updateDnsRecordTable();

    document.getElementById('zones').addEventListener('change', async e => {
        e.preventDefault();
        await updateDnsRecordTable();
    });
})();

document.getElementById('createDnsRecord').addEventListener('click', async e => {
    e.preventDefault();

    let zoneId = document.getElementById("zones").value;
    let type = document.getElementById("createRecordType").value;
    let name = document.getElementById("createRecordName").value;
    let content = document.getElementById("createRecordContent").value;
    let proxied = document.getElementById("createRecordProxied").checked;

    if (!zoneId || !type || !name || !content) {
        console.log("[Create DNS Record] Error, invalid data!")
        return
    }

    await createDnsRecords(
        token, zoneId,
        { type, name, content, proxied }
    );
    await updateDnsRecordTable();
});

document.getElementById('updateDnsRecord').addEventListener('click', async e => {
    e.preventDefault();
    let zoneId = document.getElementById("zones").value;
    let recordId = document.getElementById("updateRecordId").value;
    let type = document.getElementById("updateRecordType").value;
    let name = document.getElementById("updateRecordName").value;
    let content = document.getElementById("updateRecordContent").value;
    let proxied = document.getElementById("updateRecordProxied").checked;

    if (!zoneId || !recordId || !type || !name || !content) {
        console.log("[Update DNS Record] Error, invalid data!")
        return
    }

    await updateDnsRecords(
        token,
        zoneId,
        recordId,
        { type, name, content, proxied, }
    );

    updateDnsRecordModal.hide();
    await updateDnsRecordTable();
});

document.getElementById('deleteDnsRecord').addEventListener('click', async e => {
    e.preventDefault();

    let zoneId = document.getElementById("zones").value;
    let recordId = document.getElementById("updateRecordId").value;

    if (await deleteDnsRecords(token, zoneId, recordId)) {
        console.log("[Delete DNS Record] Done!");
    }

    updateDnsRecordModal.hide();
    await updateDnsRecordTable();
});