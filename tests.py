import unittest
import database
import sessions
import main
import multiprocessing
import time

from selenium import webdriver
from selenium.webdriver.common.by import By

class TestStringMethods(unittest.TestCase):
    def test_database(self):
        database.newUser("testuser", "testpassword", "testname", "testmail@example.com")

        self.assertEqual(database.checkUser("testuser","testpassword"), database.CheckUserResult.OK)
        self.assertEqual(database.getUserName("testuser"), "testname")
        self.assertEqual(database.getUserEmail("testuser"), "testmail@example.com")

        database.setUserData("testuser","testdata")

        self.assertEqual(database.getUserData("testuser"), "testdata")

        database.deleteUser("testuser")

        self.assertEqual(database.checkUser("testuser","testpassword"), database.CheckUserResult.WRONG_LOGIN)

    def test_sessions(self):
        token = sessions.newSession("testuser")
        self.assertEqual(sessions.checkSession(token),"testuser")
        sessions.deleteSession(token)
        self.assertEqual(sessions.checkSession(token),None)

    def test_restore_sessions(self):
        token = sessions.newRestoreSession("testuser")
        self.assertEqual(sessions.checkRestoreSession(token),"testuser")
        sessions.deleteRestoreSession(token)
        self.assertEqual(sessions.checkRestoreSession(token),None)

    def test_selenium_login(self):
        database.newUser("testuser", "testpassword", "testname", "testmail@example.com")

        driver.get(url="http://127.0.0.1:4321/")

        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/login/")

        driver.find_element(By.NAME, "login").send_keys("testuser")
        driver.find_element(By.NAME, "password").send_keys("testpassword")
        driver.find_element(By.ID, "submit").submit()
        time.sleep(1)
        
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/home/")

        database.deleteUser("testuser")

    def test_selenium_register(self):
        driver.get(url="http://127.0.0.1:4321/ru/register/")

        driver.find_element(By.NAME, "login").send_keys("testuser")
        driver.find_element(By.NAME, "password").send_keys("testpassword")
        driver.find_element(By.NAME, "password2").send_keys("testpassword")
        driver.find_element(By.NAME, "email").send_keys("testemail")
        driver.find_element(By.NAME, "name").send_keys("testname")
        driver.find_element(By.ID, "submit").submit()
        time.sleep(1)
        
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/home/")

        self.assertEqual(database.checkUser("testuser", "testpassword"), database.CheckUserResult.OK)

        database.deleteUser("testuser")

    def test_selenium_sidebar(self):
        database.newUser("testuser", "testpassword", "testname", "testmail@example.com")

        driver.get(url="http://127.0.0.1:4321/ru/login")
        driver.find_element(By.NAME, "login").send_keys("testuser")
        driver.find_element(By.NAME, "password").send_keys("testpassword")
        driver.find_element(By.ID, "submit").submit()
        time.sleep(1)

        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/home/")

        driver.find_element(By.ID, "panel-button").click()
        driver.find_elements(By.CLASS_NAME, "sidebar-btn")[1].click()
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/account_settings/")

        driver.find_element(By.ID, "panel-button").click()
        driver.find_elements(By.CLASS_NAME, "sidebar-btn")[2].click()
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/camera_settings/")

        driver.find_element(By.ID, "panel-button").click()
        driver.find_elements(By.CLASS_NAME, "sidebar-btn")[0].click()
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/home/")

        database.deleteUser("testuser")

    def test_selenium_languages(self):
        driver.get(url="http://127.0.0.1:4321/ru/login")
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/login/")

        driver.find_element(By.ID, "language-button").click()
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/en/login/")

        driver.find_element(By.ID, "language-button").click()
        self.assertEqual(driver.current_url,"http://127.0.0.1:4321/ru/login/")


def testserver():
    main.app.run(port=4321)


proc = multiprocessing.Process(target=testserver)
proc.start()
driver = webdriver.Firefox()

unittest.main()

driver.close()
proc.terminate()