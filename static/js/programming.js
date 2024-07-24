import { api } from '/static/js/camera_api.js'

window.onload = async function () {
    document.getElementById('copy_btn').onclick = startCopying
}

async function startCopying(){
    let btn_id = prompt("введите номер кнопки")
    let result = await api(id,key,'prog_btn', { id: btn_id }, 30000)
    alert(result)
}