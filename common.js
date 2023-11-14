export { login, password, api}

var login = localStorage.getItem('login')
var password = localStorage.getItem('password')

var api_server = 'vorota.servermaksa.tk/api'

async function api(cmd, params) {
    if (login == null || password == null || login == '') {
        window.location = '/login/'
    }
    let request = `${api_server}/?cmd=${cmd}&login=${login}&password=${password}`
    for (let param in params) {
        request += `&${param}=${params[param]}`
    }
    console.log(request)
    let result = new URLSearchParams(await (await fetch(request, { cache: 'no-store' })).text())
    if (result.get('result') == 'UNAUTHORIZED') {
        alert('Не верный пароль')
        window.location = '/login/'
    }
    return result
}