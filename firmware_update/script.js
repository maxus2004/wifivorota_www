import api from '/common.js'

window.onload = async function () {
    let current_version = (await api('info')).get('version')
    let latest_version = await (await fetch('/firmware_version.txt', { cache: 'no-store' })).text()
    document.getElementById('current_version').value = current_version
    document.getElementById('latest_version').value = latest_version
    document.getElementById('update_btn').onclick = firmwareUpdate
}

function log(line) {
    document.getElementById('update_log').innerText += line + '\n'
}

async function firmwareUpdate() {
    document.getElementById('update_log').innerText = ''
    let firmware_url = document.getElementById('firmware_url').value

    log('загрузка прошивки...')
    let result = (await api('update', { url: firmware_url })).get('result')
    if (result != 'OK') {
        log('произошла ошибка. Код ошибки: ' + result)
    }
    log('загрузка завершена')


    log('перезагрузка...')
    result = (await api('reboot')).get('result')
    if (result != 'OK') {
        log('произошла ошибка. Код ошибки: ' + result)
    }
    await new Promise(r => setTimeout(r, 5000))
    while (result != 'OK') {
        result = (await api('info')).get('result')
        if (result == 'OK') break
        await new Promise(r => setTimeout(r, 1000))
    }
    log('перезагрузка завершена')


    log('подтверждение обновления...')
    result = (await api('update_validate')).get('result')
    if (result != 'OK') {
        log('произошла ошибка. Код ошибки: ' + result)
    }
    log('прошивка обновлена!')

    let current_version = (await api('info')).get('version')
    document.getElementById('current_version').value = current_version
}