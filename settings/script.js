import {api} from '/camera_api.js'

window.onload = async function () {
    document.getElementById('reboot_btn').onclick = reboot
    document.getElementById('update_btn').onclick = firmware_update
    document.getElementById('logout_btn').onclick = logout
    document.getElementById('form').addEventListener('submit', save_pressed)

    let parameters = await api('config')

    for (let elem of document.getElementsByClassName('setting_input')) {
        elem.value = parameters.get(elem.id)
    }
}

async function save_pressed(e) {
    e.preventDefault()
    let parameters = {}
    for (let elem of document.getElementById('form').getElementsByClassName('setting_input')) {
        parameters[elem.id] = elem.value
    }
    let result = await api('config', parameters)
    console.log(result)
    if (result.get('result') != 'OK') {
        alert('ошибка: ' + result.get('result'))
        return
    }
    result = await api('config_save')
    if (result.get('result') != 'OK') {
        alert('ошибка: ' + result.get('result'))
        return
    }
    alert('настройки сохранены')
}

function firmware_update() {
    window.location = '/firmware_update/'
}

function logout() {
    localStorage.clear()
    window.location = '/login/'
}

function reboot() {
    api('reboot')
}