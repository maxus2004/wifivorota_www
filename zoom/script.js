originalFramesize = 6

window.onload = async function () {
    document.getElementById("video").src = "/stream?login=" + login + "&password=" + password
    response = await api("camera_config")
    originalFramesize = response.get("framesize")
    api("camera_config", { framesize: 13 })
}

async function goBack(){
    await api("camera_config", { framesize: originalFramesize })
    document.location='/'
}