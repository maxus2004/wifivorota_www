export { startStream, api }

var api_server = 'https://vorota.servermaksa.ru'

async function api(id, password, cmd, params, timeout = 5000) {
    try{
        let request = `${api_server}/api/?cmd=${cmd}&login=${id}&password=${password}`
        for (let param in params) {
            request += `&${param}=${params[param]}`
        }
        let result = new URLSearchParams(await (await fetch(request, { cache: 'no-store' , signal: AbortSignal.timeout(timeout)})).text())
        // console.log(cmd, result)
        if (result.get('result') == 'UNAUTHORIZED') {
            alert('Не верный пароль камеры')
        }
        return result
    }catch(error){
        return new URLSearchParams("result="+error)
    }
}

function startStream(img, id, password) {
    img.onload = null
    img.src = '/static/video-loading.gif'
    img.className = 'loading'

    if(JSON.parse(localStorage.getItem('user_data')).cameras == undefined){
        img.src = '/static/no-camera.png'
        return
    }
    var stream_url = `${api_server}/stream/?login=${id}&password=${password}&rand=${Math.floor(Math.random() * 1000000)}`
    
    img.onload = () => {
        img.src = stream_url
        img.onload = () => {
            img.onload = null
            img.className = ''
        }
    }

    setTimeout(() => {
        if (img.className == 'loading') {
            startStream(img, id, password)
        }
    }, 3000)
}