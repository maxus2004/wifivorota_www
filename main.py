from flask import Flask, render_template, request, redirect, make_response, send_from_directory
from datetime import timedelta
import database
import sessions
import languages
import mail
import os
import json


app = Flask(__name__)


@app.route("/")
def index_page():
    return redirect("/ru/home/", code=301)


@app.route("/<lang_code>/")
@app.route("/<lang_code>/home/")
def home_page(lang_code):
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
       return redirect(f"/{lang_code}/login/", code=303)
    return render_template("home.html", user_name=database.getUserName(login), lang_code=lang_code, **languages.getStrings(lang_code))


@app.route("/<lang_code>/login/", methods = ['POST', 'GET'])
def login_page(lang_code):
    if request.method == 'POST':
        login = request.form.get('login')
        password = request.form.get('password')
        remember = request.form.get('remember')
        check_result = database.checkUser(login, password)
        if check_result == database.CheckUserResult.WRONG_LOGIN:
            return render_template("login.html", error_message=languages.getStrings(lang_code)["errors"]["wrong_login"],lang_code=lang_code, **languages.getStrings(lang_code))
        if check_result == database.CheckUserResult.WRONG_PASSWORD:
            return render_template("login.html", error_message=languages.getStrings(lang_code)["errors"]["wrong_password"],lang_code=lang_code, **languages.getStrings(lang_code))
        session_token = sessions.newSession(login)
        resp = make_response(redirect(f"/{lang_code}/home/", code=303))
        if(remember):
            resp.set_cookie('session_token', session_token, timedelta(days=90), samesite='Lax')
        else:
            resp.set_cookie('session_token', session_token, samesite='Lax')
        return resp
    else:
        return render_template("login.html", lang_code=lang_code, **languages.getStrings(lang_code))
    

@app.route("/<lang_code>/register/", methods = ['POST', 'GET'])
def register_page(lang_code):
    if request.method == 'POST':
        login = request.form.get('login')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        name = request.form.get('name')
        email = request.form.get('email')
        remember = request.form.get('remember')
        if password != password2:
            return render_template("register.html", error_message=languages.getStrings(lang_code)["errors"]["different_passwords"], lang_code=lang_code, **languages.getStrings(lang_code))
        create_result = database.newUser(login, password,name,email)
        if create_result == database.NewCheckResult.USER_EXISTS:
            return render_template("register.html", error_message=languages.getStrings(lang_code)["errors"]["user_exists"], lang_code=lang_code, **languages.getStrings(lang_code))
        if create_result == database.NewCheckResult.LOGIN_SHORT:
            return render_template("register.html", error_message=languages.getStrings(lang_code)["errors"]["login_short"], lang_code=lang_code, **languages.getStrings(lang_code))
        if create_result == database.NewCheckResult.PASSWORD_SHORT:
            return render_template("register.html", error_message=languages.getStrings(lang_code)["errors"]["password_short"], lang_code=lang_code, **languages.getStrings(lang_code))
        session_token = sessions.newSession(login)
        resp = make_response(redirect(f"/{lang_code}/home/", code=303))
        if(remember):
            resp.set_cookie('session_token', session_token, timedelta(days=90), samesite='Lax')
        else:
            resp.set_cookie('session_token', session_token, samesite='Lax')
        return resp
    else:
        return render_template("register.html", lang_code=lang_code, **languages.getStrings(lang_code))


@app.route("/<lang_code>/recover/", methods = ['POST', 'GET'])
def recover_page(lang_code):
    if request.method == 'POST':
        login = request.form.get('login')
        email = database.getUserEmail(login)
        if login != None:
            restore_link = "https://wifi-vorota.ru/ru/new_password/?token="+sessions.newRestoreSession(login)
            mail.send(email,"Восстановление пароля wifi-vorota.ru",f"ваш логин: {login}\nдля восстановления пароля откройте ссылку: {restore_link}")
        return render_template("recover.html", lang_code=lang_code, **languages.getStrings(lang_code))
    else:
        return render_template("recover.html", lang_code=lang_code, **languages.getStrings(lang_code))
    

@app.route("/<lang_code>/new_password/", methods = ['POST', 'GET'])
def rnew_password_page(lang_code):
    login = sessions.checkRestoreSession(request.args.get("token"))
    if(login == None):
        return redirect(f"/{lang_code}/recover/", code=303)
    if request.method == 'POST':
        password = request.form.get('password')
        password2 = request.form.get('password2')
        if password != password2:
            return render_template("new_password.html", error_message=languages.getStrings(lang_code)["errors"]["different_passwords"], lang_code=lang_code, **languages.getStrings(lang_code))
        reset_result = database.resetPassword(login,password)
        if reset_result == database.UpdateUserResult.PASSWORD_SHORT:
            return render_template("new_password.html", error_message=languages.getStrings(lang_code)["errors"]["password_short"], lang_code=lang_code, **languages.getStrings(lang_code))
        return redirect(f"/{lang_code}/login/", code=303)
    else:
        return render_template("new_password.html", lang_code=lang_code, **languages.getStrings(lang_code))


@app.route("/<lang_code>/zoom/")
def zoom_page(lang_code):
   if sessions.checkSession(request.cookies.get('session_token')) == None:
       return redirect(f"/{lang_code}/login/", code=303)
   return render_template("zoom.html", lang_code=lang_code, **languages.getStrings(lang_code))
    

@app.route("/<lang_code>/camera_settings/")
def settings_page(lang_code):
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
       return redirect(f"/{lang_code}/login/", code=303)
    return render_template("camera_settings.html", user_name=database.getUserName(login), lang_code=lang_code, **languages.getStrings(lang_code))


@app.route("/<lang_code>/direct_control/")
def direct_control_page(lang_code):
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
       return redirect(f"/{lang_code}/login/", code=303)
    return render_template("direct_control.html", user_name=database.getUserName(login), lang_code=lang_code, **languages.getStrings(lang_code))


@app.route("/<lang_code>/account_settings/", methods = ['POST', 'GET'])
def account_settings_page(lang_code):
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
        return redirect(f"/{lang_code}/login/", code=303)
    if request.method == 'POST':
        password = request.form.get('password')
        password2 = request.form.get('password2')
        if password != password2:
            name = database.getUserName(login)
            mail = database.getUserEmail(login)
            return render_template("account_settings.html", user_name=database.getUserName(login), error_message=languages.getStrings(lang_code)["errors"]["different_passwords"], acc_login=login, acc_name=name, acc_mail=mail, lang_code=lang_code, **languages.getStrings(lang_code), user_data=database.getUserData(login))
        name = request.form.get('name')
        email = request.form.get('email')
        update_result = database.updateUser(login,password,name,email)
        if update_result==database.UpdateUserResult.PASSWORD_SHORT:
            name = database.getUserName(login)
            mail = database.getUserEmail(login)
            return render_template("account_settings.html", user_name=database.getUserName(login), error_message=languages.getStrings(lang_code)["errors"]["password_short"], acc_login=login, acc_name=name, acc_mail=mail, lang_code=lang_code, **languages.getStrings(lang_code), user_data=database.getUserData(login))
        return redirect("?result=OK", code=303)
    else:
        name = database.getUserName(login)
        mail = database.getUserEmail(login)
        return render_template("account_settings.html", user_name=database.getUserName(login), acc_login=login, acc_name=name, acc_mail=mail, lang_code=lang_code, **languages.getStrings(lang_code), user_data=database.getUserData(login))


@app.route("/<lang_code>/firmware_update/")
def firmware_update_page(lang_code):
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
       return redirect(f"/{lang_code}/login/", code=303)
    return render_template("firmware_update.html", user_name=database.getUserName(login),lang_code=lang_code, **languages.getStrings(lang_code))


@app.route("/get_user_data/")
def get_user_data():
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
       return ""
    return database.getUserData(login)


@app.route("/set_user_data/")
def set_user_data():
    login = sessions.checkSession(request.cookies.get('session_token'))
    if login == None:
       return ""
    return database.setUserData(login, request.args.get("user_data"))


@app.route("/firmware_versions/")
def firmware_version():
    files = [f for f in os.listdir("firmware") if os.path.isfile(os.path.join("firmware", f))]
    versions = []
    for file in files:
        versions.append(file[file.index('-')+1:-4])
    return json.dumps(versions)


@app.route("/firmware/<name>")
def firmware_version(name):
    return send_from_directory("firmware",name)


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000, threaded=True)