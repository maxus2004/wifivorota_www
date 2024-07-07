import { api, startStream } from '/static/js/camera_api.js'

window.onload = async function () {
    var scroll = document.getElementById('scroll')
    var video = document.getElementById('video')
    scroll.scrollLeft = video.scrollWidth / 2 - window.innerWidth / 2
    video.onclick = goBack
    //let response = await api('camera_config')
    //originalFramesize = response.get('framesize')
    let camera_id = sessionStorage.getItem("selected_camera")
    if(camera_id == undefined)camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]
    api(camera.id,camera.key,'camera_config', { framesize: 13 })
    startStream(document.getElementById('video'),camera.id,camera.key)
}

document.onvisibilitychange = function () {
    if (document.visibilityState === "visible") {
        startStream(document.getElementById('video'))
    }
}

async function goBack() {
    document.getElementById('video').onclick = ()=>{
        if(document.location.toString().includes("/ru/")){
            window.location = '/ru/home/'
        }else{
            window.location = '/en/home/'
        }
    }
}