import { api } from '/static/js/camera_api.js'

window.onload = async function () {
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    let current_version = (await api(camera.id, camera.key, 'info')).get('version')
    let latest_version = await (await fetch('https://vorota.servermaksa.ru/firmware_version.txt', { cache: 'no-store' })).text()
    document.getElementById('current_version').value = current_version
    document.getElementById('latest_version').value = latest_version
    document.getElementById('update_btn').onclick = firmwareUpdate
}

function log(line) {
    document.getElementById('update_log').innerText += line + '\n'
}

async function firmwareUpdate() {
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]


    document.getElementById('update_log').innerText = ''
    let firmware_url = document.getElementById('firmware_url').value

    log('загрузка прошивки...')
    let result = (await api(camera.id, camera.key, 'update', { url: firmware_url }, 300000)).get('result')
    if (result != 'OK') {
        log('произошла ошибка. Код ошибки: ' + result)
    }
    log('загрузка завершена')


    log('перезагрузка...')
    result = (await api(camera.id, camera.key, 'reboot')).get('result')
    if (result != 'OK') {
        log('произошла ошибка. Код ошибки: ' + result)
    }
    await new Promise(r => setTimeout(r, 5000))
    result = (await api(camera.id, camera.key, 'info')).get('result')
    while (result != 'OK') {
        result = (await api(camera.id, camera.key, 'info')).get('result')
        console.log(result)
        if (result == 'OK') break
        await new Promise(r => setTimeout(r, 1000))
    }
    log('перезагрузка завершена')


    log('подтверждение обновления...')
    result = (await api(camera.id, camera.key, 'update_validate')).get('result')
    console.log(result)
    if (result != 'OK') {
        log('произошла ошибка. Код ошибки: ' + result)
    }
    log('прошивка обновлена!')

    let current_version = (await api(camera.id, camera.key, 'info')).get('version')
    document.getElementById('current_version').value = current_version
}