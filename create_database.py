import sqlite3

db = sqlite3.connect("database.db")

db.execute(
    'CREATE TABLE users('+
    'user_id INTEGER PRIMARY KEY NOT NULL,'+
    'login TEXT NOT NULL,'+
    'password_hash BLOB NOT NULL,'+
    'name TEXT NOT NULL,'+
    'email TEXT'+
    ')'
)

db.execute(
    'CREATE TABLE user_data('+
    'user_id INTEGER PRIMARY KEY NOT NULL REFERENCES users(user_id),'+
    'data BLOB NOT NULL'+
    ')'
)

db.commit()