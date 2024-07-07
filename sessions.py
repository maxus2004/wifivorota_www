import string
import random

sessions = {}

restoreSessions = {}

def generateSessionToken():
    return ''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=32))

def newSession(login):
    session_token = generateSessionToken()
    sessions[session_token] = login
    return session_token

def deleteSession(session_token):
    sessions[session_token] = None

def checkSession(session_token):
    if session_token==None:
        return None
    if(session_token not in sessions):
        return None
    return sessions[session_token]

def newRestoreSession(login):
    session_token = generateSessionToken()
    restoreSessions[session_token] = login
    return session_token

def checkRestoreSession(session_token):
    if session_token==None:
        return None
    if(session_token not in restoreSessions):
        return None
    return restoreSessions[session_token]

def deleteRestoreSession(session_token):
    restoreSessions[session_token] = None