import { api } from '/static/js/camera_api.js'

window.onload = async function () {
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    for(var ii = 1; ii<5;ii++){
        (function () {
            let i = ii
            let btn = document.getElementById("remote_btn"+i)
            btn.addEventListener("mousedown", ()=>hold_button(camera, i))
            btn.addEventListener("mouseup", ()=>release_button(camera, i))
            btn.addEventListener("touchstart", ()=>hold_button(camera, i));
            btn.addEventListener("touchend", ()=>release_button(camera, i));
            btn.addEventListener("touchcancel", ()=>release_button(camera, i));
        })()
    }

    let led_indicator = document.getElementById("remote_led")

    setInterval(async ()=>{
        let led = (await api(camera.id, camera.key, 'led_status')).get('led')
        if(led==1){
            led_indicator.className = "on"
        }else{
            led_indicator.className = ""
        }
    },100);
}

function hold_button(camera, i){
    let btn = document.getElementById("remote_btn"+i)
    btn.classList.add("on")
    api(camera.id, camera.key, 'hold_btn', { id: i-1 }) 
}

function release_button(camera, i){
    let btn = document.getElementById("remote_btn"+i)
    btn.classList.remove("on")
    api(camera.id, camera.key, 'release_btn', { id: i-1 }) 
}