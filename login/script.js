window.onload = function () {
    document.querySelector("#form").addEventListener("submit", login_pressed);
}

function login_pressed(e) {
    e.preventDefault();
    login = document.querySelector("#login_input").value;
    password = document.querySelector("#password_input").value;
    localStorage.setItem('login', login);
    localStorage.setItem('password', password);
    window.location = "/";
}