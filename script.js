import { api, login, password } from '/common.js'

var daymode_xclk = 20
var nightmode_xclk = 2
var nightMode = false

function changeResolution() {
    let resolution = document.getElementById('resolution_select').value
    api('camera_config', { framesize: resolution })
}

function toggleNightMode() {
    nightMode = !nightMode
    if (nightMode) {
        api('camera_config', { xclk: nightmode_xclk })
        document.getElementById('nightmode_btn').innerText = 'Ночной режим включен'
    } else {
        api('camera_config', { xclk: daymode_xclk })
        document.getElementById('nightmode_btn').innerText = 'Ночной режим выключен'
    }
}

function openSettings() {
    window.location = '/settings/'
}

async function start() {
    document.getElementById('nightmode_btn').onclick = toggleNightMode
    document.getElementById('settings_btn').onclick = openSettings
    document.getElementById('resolution_select').onchange = changeResolution

    document.getElementById('video').src = '/stream?login=' + login + '&password=' + password

    let config = await api('config')
    document.getElementById('buttons').innerHTML = ''
    for (var i = 0; i < 4; i++) {
        var btn_name = config.get('btn' + i + '_name')
        console.log()
        if (btn_name == '') continue
        document.getElementById('buttons').innerHTML += '<button class="door_button" onclick="api(\'press_btn\',{id:\' + i + \'})">' + btn_name + '</button>'
    }

    let camera_config = await api('camera_config')
    document.getElementById('resolution_select').value = camera_config.get('framesize')
    if (camera_config.get('xclk') == nightmode_xclk) {
        nightMode = true
        document.getElementById('nightmode_btn').innerText = 'Ночной режим включен'
    } else {
        nightMode = false
        document.getElementById('nightmode_btn').innerText = 'Ночной режим выключен'
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState == 'visible') {
        start()
    }
})
window.onload = start