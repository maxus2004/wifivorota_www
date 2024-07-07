function show_hide_password(target) {
    var input = document.getElementById('password-input');
    if (input.getAttribute('type') == 'password') {
        target.classList.add('view');
        input.setAttribute('type', 'text');
    } else {
        target.classList.remove('view');
        input.setAttribute('type', 'password');
    }
    return false;
}

window.addEventListener("load",function(){
    let lang_btn = document.getElementById("language-button")
    lang_btn.onclick = ()=>{
        if(document.location.toString().includes("/ru/")){
            document.location = document.location.toString().replace("/ru/","/en/")
        }else{
            document.location = document.location.toString().replace("/en/","/ru/")
        }
    }
})