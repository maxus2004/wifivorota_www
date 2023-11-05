window.onload = async function () {
    current_version = (await api("info")).get("version")
    latest_version = await (await fetch('/firmware_version.txt', {cache: "no-store"})).text()
    document.getElementById('current_version').value = current_version
    document.getElementById('latest_version').value = latest_version
}

function log(line) {
    document.getElementById('update_log').innerText += line + '\n'
}

async function firmware_update() {
    document.getElementById('update_log').innerText = ""    
    firmware_url = document.getElementById('firmware_url').value

    log('загрузка прошивки...');
    result = (await api("update", { url: firmware_url })).get('result')
    if (result != "OK") {
        log('произошла ошибка. Код ошибки: ' + result);
    }
    log('загрузка завершена');


    log('перезагрузка...');
    result = (await api("reboot")).get('result')
    if (result != "OK") {
        log('произошла ошибка. Код ошибки: ' + result);
    }
    await new Promise(r => setTimeout(r, 5000));
    while (true) {
        result = (await api("info")).get("result")
        if(result == "OK")break;
        await new Promise(r => setTimeout(r, 1000));
    }
    log('перезагрузка завершена');


    log('подтверждение обновления...');
    result = (await api("update_validate")).get('result')
    if (result != "OK") {
        log('произошла ошибка. Код ошибки: ' + result);
    }
    log('прошивка обновлена!');

    current_version = (await api("info")).get("version")
    document.getElementById('current_version').value = current_version
}