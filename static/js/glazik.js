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

window.onload = function(){
    document.getElementById('password_eye').onclick = ()=>show_hide_password(document.getElementById("password-input"))
}