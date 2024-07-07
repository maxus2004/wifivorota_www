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

window.onload = ()=>{
    document.getElementById('logout_btn').onclick = logout
}