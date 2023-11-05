var login = localStorage.getItem("login")
var password = localStorage.getItem("password")

async function api(cmd, params) {
    if (login == null || password == null || login == "") {
        window.location = "/login/";
    }
    request = `/api/?cmd=${cmd}&login=${login}&password=${password}`
    for (param in params) {
        request += `&${param}=${params[param]}`
    }
    console.log(request)
    result = new URLSearchParams(await (await fetch(request, { cache: "no-store" })).text())
    if (result.get("result") == "UNAUTHORIZED") {
        alert("Не верный пароль")
        window.location = "/login/";
    }
    return result
}