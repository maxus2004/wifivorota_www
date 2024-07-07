import {api} from '/static/js/camera_api.js'

async function sendSettings(){
    await fetch(`/set_user_data/?user_data=${localStorage.getItem('user_data')}`)
}

window.addEventListener('load', () => {
    document.getElementById('reboot_btn').onclick = reboot
    document.getElementById('update_btn').onclick = firmware_update
    document.getElementById('direct_control_btn').onclick = direct_control
    document.getElementById('submit').onclick = save_pressed
    document.getElementById("camera_add").onclick = addCamera
    document.getElementById("camera_delete").onclick = deleteCamera
    let camera_select = document.getElementById("camera_select");
    camera_select.addEventListener('change', selectCamera)

    let cameras = JSON.parse(localStorage.getItem('user_data')).cameras

    if(cameras != undefined){
        for(let i = 0;i<cameras.length;i++){
            let camera = cameras[i]
            var opt = document.createElement('option');
            opt.value = i
            opt.innerHTML = camera.id;
            camera_select.appendChild(opt);
        }

        selectCamera();
    }
})

function addCamera(){
    let id = prompt("ID камеры")
    let key = prompt("Пароль камеры")

    let camera_select = document.getElementById("camera_select")
    var opt = document.createElement('option')
    opt.value = camera_select.children.length
    opt.innerHTML = id
    camera_select.appendChild(opt)

    camera_select.value = opt.value

    let user_data = JSON.parse(localStorage.getItem('user_data'))
    if(user_data.cameras == undefined){
        user_data.cameras = []
    }
    user_data.cameras.push({"id":id,"key":key})
    localStorage.setItem('user_data',JSON.stringify(user_data))

    selectCamera();

    sendSettings();
}

function deleteCamera(){
    let camera_select = document.getElementById("camera_select")

    let user_data = JSON.parse(localStorage.getItem('user_data'))
    user_data.cameras.splice(camera_select.value, 1);
    localStorage.setItem('user_data',JSON.stringify(user_data))

    camera_select.children[camera_select.value].remove()

    selectCamera()

    sendSettings();
}

async function selectCamera(){
    let camera_select = document.getElementById("camera_select");

    let id = JSON.parse(localStorage.getItem('user_data')).cameras[camera_select.value].id
    let key = JSON.parse(localStorage.getItem('user_data')).cameras[camera_select.value].key

    let parameters = await api(id,key,'config')

    for(let elem of document.getElementsByClassName('camera-param')){
        elem.value = ''
    }

    for (let elem of parameters) {
        let parameterName = elem[0]
        let parameterValue = elem[1]
        if(document.getElementsByName(parameterName).length != 0){
            document.getElementsByName(parameterName)[0].value = parameterValue
        }
    }

    document.getElementsByName('user_login')[0].value = id
    document.getElementsByName('user_password')[0].value = key
}

async function save_pressed(e) {
    e.preventDefault()

    let camera_select = document.getElementById("camera_select");

    let user_data = JSON.parse(localStorage.getItem('user_data'))

    let id = user_data.cameras[camera_select.value].id
    let key = user_data.cameras[camera_select.value].key

    let parameters = {}
    for (let elem of document.getElementsByClassName('camera-param')) {
        parameters[elem.name] = elem.value
    }
    console.log(parameters)
    let result = await api(id, key, 'config', parameters)
    console.log(result)
    if (result.get('result') != 'OK') {
        alert('ошибка: ' + result.get('result'))
        return
    }
    result = await api(id, document.getElementsByName('user_password')[0].value, 'config_save')
    if (result.get('result') != 'OK') {
        alert('ошибка: ' + result.get('result'))
        return
    }

    user_data.cameras[camera_select.value].id = document.getElementsByName('user_login')[0].value
    user_data.cameras[camera_select.value].key = document.getElementsByName('user_password')[0].value

    localStorage.setItem('user_data',JSON.stringify(user_data))

    await sendSettings()

    alert('настройки сохранены')
}

function firmware_update() {
    if(document.location.toString().includes("/ru/")){
        window.location = '/ru/firmware_update/'
    }else{
        window.location = '/en/firmware_update/'
    }
}

function direct_control() {
    if(document.location.toString().includes("/ru/")){
        window.location = '/ru/direct_control/'
    }else{
        window.location = '/en/direct_control/'
    }
}

function reboot() {
    let camera_select = document.getElementById("camera_select");

    let id = JSON.parse(localStorage.getItem('user_data')).cameras[camera_select.value].id
    let key = JSON.parse(localStorage.getItem('user_data')).cameras[camera_select.value].key

    api(id, key, 'reboot')
}