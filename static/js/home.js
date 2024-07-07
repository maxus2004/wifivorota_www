import { api, startStream } from '/static/js/camera_api.js'
import { updateUserData } from '/static/js/data_sync.js'

var daymode_xclk = 20
var nightmode_xclk = 2
var nightMode = false

async function statusUpdate(){
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    let rssi = document.getElementById("wifi_rssi")
    rssi.innerText = Math.floor((parseInt((await api(camera.id, camera.key, "info")).get("rssi"))+90)*1.6666);
}

function changeResolution() {
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    let resolution = document.getElementById('resolution_select').value
    api(camera.id, camera.key, 'camera_config', { framesize: resolution })
}

function toggleNightMode() {
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    nightMode = !nightMode
    if (nightMode) {
        api(camera.id, camera.key, 'camera_config', { xclk: nightmode_xclk })
        document.getElementById('nightmode_on_btn').style = ''
        document.getElementById('nightmode_off_btn').style = 'display: none'
    } else {
        api(camera.id, camera.key, 'camera_config', { xclk: daymode_xclk })
        document.getElementById('nightmode_on_btn').style = 'display: none'
        document.getElementById('nightmode_off_btn').style = ''
    }
}

document.onvisibilitychange = function () {
    if (document.visibilityState === "visible") {
        let camera_id = sessionStorage.getItem("selected_camera")
        if (camera_id == undefined) camera_id = 0
        let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]
        startStream(document.getElementById('video'), camera.id, camera.key)
    }
}

function selectCamera() {
    sessionStorage.setItem("selected_camera", document.getElementById('cameras').value)
    
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]
    startStream(document.getElementById('video'), camera.id, camera.key)
    updateCameraInfo();
}

function selectNextCamera() {
    let cameraCount = JSON.parse(localStorage.getItem('user_data')).cameras.length
    let selected_camera = parseInt(sessionStorage.getItem("selected_camera"))
    if (isNaN(selected_camera)) selected_camera = 0
    sessionStorage.setItem("selected_camera", (selected_camera + 1) % cameraCount)
    document.getElementById('cameras').value = (selected_camera + 1) % cameraCount
    
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]
    startStream(document.getElementById('video'), camera.id, camera.key)
    updateCameraInfo();
}

function selectPrevCamera() {
    let cameraCount = JSON.parse(localStorage.getItem('user_data')).cameras.length
    let selected_camera = parseInt(sessionStorage.getItem("selected_camera"))
    if (isNaN(selected_camera)) selected_camera = 0
    sessionStorage.setItem("selected_camera", (cameraCount - 1 + selected_camera) % cameraCount)
    document.getElementById('cameras').value = (cameraCount - 1 + selected_camera) % cameraCount

    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]
    startStream(document.getElementById('video'), camera.id, camera.key)
    updateCameraInfo();
}

async function updateCameraInfo() {
    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0
    let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

    let config = await api(camera.id, camera.key, 'config')
    document.getElementById('buttons').innerHTML = ''
    for (var i = 0; i < 4; i++) {
        var btn_name = config.get('btn' + i + '_name')
        if (btn_name == null || btn_name == '') continue
        let button = document.createElement('button')
        button.className = 'btn door_button'
        button.id = 'doorbtn' + i
        button.innerText = btn_name;
        (function (i) {
            button.onclick = function () { api(camera.id, camera.key, 'press_btn', { id: i }) }
        })(i)
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        td.appendChild(button)
        tr.appendChild(td)
        document.getElementById('buttons').appendChild(tr)
    }

    let camera_config = await api(camera.id, camera.key, 'camera_config')
    document.getElementById('resolution_select').value = camera_config.get('framesize')
    if (camera_config.get('xclk') == nightmode_xclk) {
        nightMode = true
        document.getElementById('nightmode_on_btn').style = ''
        document.getElementById('nightmode_off_btn').style = 'display: none'
    } else {
        nightMode = false
        document.getElementById('nightmode_on_btn').style = 'display: none'
        document.getElementById('nightmode_off_btn').style = ''
    }
}

window.onload = async function () {
    document.getElementById('nightmode_on_btn').onclick = toggleNightMode
    document.getElementById('nightmode_off_btn').onclick = toggleNightMode
    document.getElementById('resolution_select').onchange = changeResolution
    document.getElementById('prev_camera_btn').onclick = selectPrevCamera
    document.getElementById('next_camera_btn').onclick = selectNextCamera
    document.getElementById('cameras').onchange = selectCamera;

    document.getElementById('video').onclick = () => {
        if (document.location.toString().includes("/ru/")) {
            window.location = '/ru/zoom/'
        } else {
            window.location = '/en/zoom/'
        }
    }

    setInterval(statusUpdate, 1000)

    await updateUserData()

    let cameras = JSON.parse(localStorage.getItem('user_data')).cameras

    if(cameras != undefined)
        for (let i = 0; i < cameras.length; i++) {
            let camera = cameras[i]
            var opt = document.createElement('option');
            opt.value = i
            opt.innerHTML = camera.id;
            document.getElementById('cameras').appendChild(opt);
        }

    let camera_id = sessionStorage.getItem("selected_camera")
    if (camera_id == undefined) camera_id = 0

    if(cameras != undefined){

        let camera = JSON.parse(localStorage.getItem('user_data')).cameras[camera_id]

        document.getElementById('cameras').value = camera_id

        api(camera.id, camera.key, 'camera_config', { framesize: 8 })

        startStream(document.getElementById('video'), camera.id, camera.key)

        updateCameraInfo()
    }else{
        document.getElementById('video').src = '/static/no-camera.png'
    }
}
