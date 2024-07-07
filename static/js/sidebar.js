function openPanel(){
    let panel = document.getElementById("side-panel")
    let outside = document.getElementById("outside-panel")
    panel.className = "side-panel open"
    outside.className = "outside-panel open"
}

function closePanel(){
    let panel = document.getElementById("side-panel")
    let outside = document.getElementById("outside-panel")
    panel.className = "side-panel"
    outside.className = "outside-panel"
}

window.addEventListener("load",function(){
    let open_btn = document.getElementById("panel-button")
    let close_btn = document.getElementById("close-panel-button")
    let panel = document.getElementById("side-panel")
    let outside = document.getElementById("outside-panel")
    let lang_btn = document.getElementById("language-button")
    let logout_btn = this.document.getElementById("logout-button")

    lang_btn.onclick = ()=>{
        if(document.location.toString().includes("/ru/")){
            document.location = document.location.toString().replace("/ru/","/en/")
        }else{
            document.location = document.location.toString().replace("/en/","/ru/")
        }
    }

    open_btn.onclick = ()=>{
        openPanel();
    }
    close_btn.onclick = ()=>{
        closePanel()
    }
    outside.onclick = ()=>{
        closePanel()
    }
    logout_btn.onclick = ()=>{
        logout()
    }
})

function logout() {
    document.cookie = 'session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    sessionStorage.clear()
    localStorage.clear()
    if(document.location.toString().includes("/ru/")){
        window.location = '/ru/login/'
    }else{
        window.location = '/en/login/'
    }
    
}