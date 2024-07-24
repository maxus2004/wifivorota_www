import { api } from '/static/js/camera_api.js'

window.onload = async function () {
    document.getElementById('copy_btn').onclick = startCopying
}

async function startCopying(){
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    let btn_id = prompt("введите номер кнопки")
    let result = await api(camera.id,camera.key,'prog_btn', { id: btn_id }, 30000)
    alert(result)
}