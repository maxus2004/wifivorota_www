import {api, getStreamURL} from '/camera_api.js'

let originalFramesize = 6

window.onload = async function () {
    document.getElementById('video').onclick = goBack
    document.getElementById('video').src = getStreamURL()
    let response = await api('camera_config')
    originalFramesize = response.get('framesize')
    api('camera_config', { framesize: 13 })
    
}

async function goBack() {
    await api('camera_config', { framesize: originalFramesize })
    document.location = '/'
}