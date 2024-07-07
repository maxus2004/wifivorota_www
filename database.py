import sqlite3
import hashlib

db = sqlite3.connect("database.db", check_same_thread=False)

class NewCheckResult:
    OK = 0
    USER_EXISTS = 1
    LOGIN_SHORT = 2
    PASSWORD_SHORT = 3

class UserDeleteResult:
    OK = 0
    WRONG_LOGIN = 1

class UpdateUserResult:
    OK = 0
    PASSWORD_SHORT = 1

class CheckUserResult:
    OK = 0
    WRONG_LOGIN = 1
    WRONG_PASSWORD = 2

class changeUserResult:
    OK = 0
    WRONG_LOGIN = 1
    WRONG_PASSWORD = 2

def hash(value):
    return hashlib.sha256((value+"wifivorotasalt").encode('utf-8')).hexdigest()

def checkUser(login, password):
    stored_hash = db.execute("SELECT password_hash FROM users WHERE login=?",(login,)).fetchone()
    if(stored_hash == None):
        return CheckUserResult.WRONG_LOGIN
    if(stored_hash[0] != hash(password)):
        return CheckUserResult.WRONG_PASSWORD
    return CheckUserResult.OK

def newUser(login, password, name, email):
    if len(login) < 3:
        return NewCheckResult.LOGIN_SHORT
    if len(password) < 8:
        return NewCheckResult.PASSWORD_SHORT
    if db.execute("SELECT COUNT(user_id) FROM users WHERE login=?",(login,)).fetchone()[0] != 0:
        return NewCheckResult.USER_EXISTS
    password_hash = hash(password)
    db.execute("INSERT INTO users VALUES(NULL, ?, ?, ?, ?)",(login,password_hash,name,email))
    db.execute("INSERT INTO user_data VALUES((SELECT user_id FROM users WHERE login=?), '{}')",(login,))
    db.commit()
    return NewCheckResult.OK

def deleteUser(login):
    if db.execute("SELECT password_hash FROM users WHERE login=?",(login,)).fetchone()==None:
        return UserDeleteResult.WRONG_LOGIN
    db.execute("DELETE FROM user_data WHERE user_id = (SELECT user_id FROM users WHERE login=?)",(login,))
    db.execute("DELETE FROM users WHERE login=?",(login,))
    db.commit()
    return UserDeleteResult.OK
    

def updateUser(login,password, name, email):
    if len(password) == 0 :
        db.execute("UPDATE users SET name=?, email=? WHERE login=?",(name,email,login))
    else:
        if len(password) < 8:
            return UpdateUserResult.PASSWORD_SHORT
        db.execute("UPDATE users SET password_hash=?, name=?, email=? WHERE login=?",(hash(password),name,email,login))
    db.commit()
    return UpdateUserResult.OK

def resetPassword(login, password):
    if len(password) < 8:
        return UpdateUserResult.PASSWORD_SHORT
    db.execute("UPDATE users SET password_hash=? WHERE login=?",(hash(password), login))
    db.commit()
    
def getUserName(login):
    return db.execute("SELECT name FROM users WHERE login=?",(login,)).fetchone()[0]

def getUserEmail(login):
    return db.execute("SELECT email FROM users WHERE login=?",(login,)).fetchone()[0]

def getUserData(login):
    return db.execute("SELECT data FROM user_data WHERE user_id=(SELECT user_id FROM users WHERE login=?)",(login,)).fetchone()[0]

def setUserData(login, data):
    db.execute("UPDATE user_data SET data=? WHERE user_id=(SELECT user_id FROM users WHERE login=?)",(data,login))
    db.commit()

def getUserByMail(email):
    arr = db.execute("SELECT login FROM users WHERE email=?",(email,)).fetchone()
    if arr == None:
        return None
    else:
        return arr[0]