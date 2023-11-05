window.onload = async function () {
    document.querySelector("#form").addEventListener("submit", save_pressed);

    parameters = await api("config")

    for(elem of document.getElementsByClassName("setting_input")){
        elem.value = parameters.get(elem.id)
    }
}

async function save_pressed(e) {
    e.preventDefault();
    parameters = {}
    for(elem of document.getElementsByClassName("setting_input")){
        parameters[elem.id] = elem.value
    }
    result = await api("config",parameters)
    console.log(result)
    if(result.get("result")!="OK"){
        alert("ошибка: "+result.get("result"))
        return
    }
    result = await api("config_save")
    if(result.get("result")!="OK"){
        alert("ошибка: "+result.get("result"))
        return
    }
    alert("настройки сохранены")
}

function firmware_update(){
    window.location='/firmware_update/'
}

function logout(){
    localStorage.clear()
    window.location='/login/'
}