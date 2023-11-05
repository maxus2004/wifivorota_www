var daymode_xclk = 20
var nightmode_xclk = 2
var nightMode = false

function changeResolution() {
    video = document.getElementById("video")
    resolution = document.getElementById("resolution_select").value
    api("camera_config", { framesize: resolution })
}

function toggleNightMode() {
    nightMode = !nightMode
    if (nightMode) {
        api("camera_config", { xclk: nightmode_xclk })
        document.getElementById("nightmode_btn").innerText = "Ночной режим включен"
    } else {
        api("camera_config", { xclk: daymode_xclk })
        document.getElementById("nightmode_btn").innerText = "Ночной режим выключен"
    }
}

function streamLoop() {

}

window.onload = async function () {
    document.getElementById("video").src = "/stream?login=" + login + "&password=" + password

    response = await api("config")
    for (var i = 0; i < 4; i++) {
        var btn_name = response.get("btn"+i+"_name")
        console.log()
        if(btn_name=="")continue;
        document.getElementById("buttons").innerHTML+='<button class="door_button" onclick="api(\'press_btn\',{id:'+i+'})">'+btn_name+'</button>'
    }

    response = await api("camera_config")
    document.getElementById("resolution_select").value = response.get("framesize")
    if (response.get("xclk") == nightmode_xclk) {
        nightMode = true
        document.getElementById("nightmode_btn").innerText = "Ночной режим включен"
    }
}