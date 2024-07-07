export {updateUserData}

async function updateUserData(){
    let request = await fetch("/get_user_data/")
    let user_data = await request.json()
    await localStorage.setItem('user_data', JSON.stringify(user_data))
}