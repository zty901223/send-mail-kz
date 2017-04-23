#### send-mail-kz.js

#### Description 
This is a simple npm module which integrated two online email services (SendGrid and Mailgun).
It allows user using a simple function to send email either using SendGrid or Mailgun.
SendGrid is the default mail service. If SendGrid mail service went down, it will auto-switch to mailgun as the second option.

#### Installation
$ npm install --save send-mail-kz

#### Prerequisites and dependencies
- Node.js version 6
- sendgrid version 5.0.0
- mailgun-js version 0.10.1

#### Usage
This module contains the following functions:

- function sendMail(mailBody, sgApiKey, mgApiKey, mgDomain, callback)
This is the main function.
It allows user to send a text email using SendGrid mail service as default option. If SendGrid mail service went down, it will send email using mailgun service.

mailBody is a Json format variable.
```javascript
mailBody = {
	fromMailAddress: 'Sender Email address',
	toMailAddress: 'Receiver Email address',
	subject: 'subject',
	content: 'mail cntent'
}
```
sgApiKey is SendGrid api Key. User will need to apply for themslves on [SendGrid official website](https://sendgrid.com/).
mgApiKey is Mailgun api Key.
mgDomain is users' Mailgun Domain.
User will need to apply for both mailgun api Key and mailgun domain on [Mailgun official website](https://www.mailgun.com/).

- function sendMailSG(mailBody, sgApiKey, callback)
This is the function for sending mail by SendGrid.
User can use this function to send email only using SendGrid mail service.

- function sendMailMG(mailBody, mgApiKey, mgDomain, callback)
This is the function for sending mail by Mailgun.
User can use this function to send email only using Mailgun mail service.

- function MGgetStats(mgApiKey, mgDomain, callback)
This is the function for checking Mailgun service status.

- function SGgetStats(sgApiKey, callback)
This is for checking SendGrid service status.

#### Example
Bellow are the minimum needed code to use the module
```javascript
var sendMailKZ = require('send-mail-kz');
var sg_api_key = 'Your SendGrid api key';
var mg_api_key = 'Your Mailgun api key';
var mg_domain ='Your Mailgun domain';
var mail_body = {
	fromMailAddress: 'sender@example.com',
	toMailAddress: 'receiver@example.com',
	subject: 'Example mail',
	content: 'Hello!'
}

sendMailKZ.sendMail(mail_body, sg_api_key, mg_api_key, mg_domain, function(err, status){});
```

#### Author
Kevin ZHONG <zty09506578@outlook.com>