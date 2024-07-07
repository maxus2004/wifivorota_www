import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
 
mail_address = "wifi-vorota@mail.ru"
mail_password = "vNpRTuE74sRvur7TNns4"
  
def send(address, title, text):
    server = smtplib.SMTP('smtp.mail.ru', 587)
    server.starttls()
    server.login(mail_address, mail_password)
    msg = MIMEMultipart()
    msg['From'] = mail_address
    msg['To'] = address
    msg['Subject'] = title
    msg.attach(MIMEText(text, 'plain'))
    server.sendmail(mail_address, address, msg.as_string())
    server.close();
