var bodyParser = require('body-parser');

//main sendMail function
function sendMail(mailBody, sgApiKey, mgApiKey, mgDomain, callback) {
	var status = undefined;
	//check if sendgrid service is available
	SGgetStats(sgApiKey, function(ok){
		if(ok) {
			//send mail by sendgird
			sendMailSG(mailBody, sgApiKey, function(err, response) {
				if(err) {
					status = 'error sending with sendgrid';
					callback(err, status);
				} else {
					status = 'sent by sendgrid';
					callback(null, status);
				}
			});
		} else {
			//if sendgrid is not available, check availability of mailgun 
			MGgetStats(mgApiKey, mgDomain, function(ok){
				if(ok) {
					//send mail by mailgun
					sendMailMG(mailBody, mgApiKey, mgDomain, function(err, response) {
						if(err){
							status = 'error sending with mailgun'
							callback(err, status)
						} else {
							status = 'sent by mailgun';
							callback(null, status);
						}
					});
				} else {
					//if both sendgrid and mailgun is unavailable, return error
					status = 'Mail services are not available.';
					var err = 'Failed to send mail';
					callback(err, status);
				}
			});
		}
	});
}

//sendmail function using sendgrid
function sendMailSG(mailBody, sgApiKey, callback) {
	var helper = require('sendgrid').mail;
	var from_email = new helper.Email(mailBody.fromMailAddress);
	var to_email = new helper.Email(mailBody.toMailAddress);
	var subject = mailBody.subject;
	var content = new helper.Content('text/plain', mailBody.emailContent);
	var mail = new helper.Mail(from_email, subject, to_email, content);
	var sg = require('sendgrid')(sgApiKey);
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

	sg.API(request, function(error, response) {
		if(error) {
			callback(response.statusCode,response.body)
		} else {
			callback(null,response.body)
		}
	})
}

//sendmail function using mailgun
function sendMailMG(mailBody, mgApiKey, mgDomain, callback) {
	var mg_api_key = mgApiKey;
	var mg_domain = mgDomain;
	var mailgun = require('mailgun-js')({apiKey: mg_api_key, domain: mg_domain});
	var data = {
		from: mailBody.fromMailAddress,
		to: mailBody.toMailAddress,
		subject: mailBody.subject,
		text: mailBody.emailContent
	};

	mailgun.messages().send(data, function (error, body) {
		if (error) {
            console.log("got an error: ", error);
            callback(error, body)
        } else {
            console.log(body);
            callback(null, body)
        }
	});
}

//check mailgun apikey and domain status
function MGgetStats(mgApiKey, mgDomain, callback) {
	var ok = undefined;
	var mg_api_key = mgApiKey;
	var mg_domain = mgDomain;
	var mailgun = require('mailgun-js')({apiKey: mg_api_key, domain: mg_domain});
	//send requst and check if has error
	mailgun.get('/' + mg_domain + '/stats', { event: ['sent', 'delivered'] }, function (error, body) {
		//if mailgun apikey or domain is not valid, error won't be returned, instead the body will not be assigned with any value hence remain undefined
		if(error || body === undefined){
			console.log('Connection error/mailgun');
			ok = false;
			callback(ok);
		} else {
			//conection is fine
			console.log(body);
			ok = true;
			callback(ok);
		}
	});
}

//check sendgird apikey and status
function SGgetStats(sgApiKey, callback) {
	var ok = undefined;
	var sg = require('sendgrid')(sgApiKey);
	var request = sg.emptyRequest();
	var today = new Date().toISOString().substring(0, 10);
	request.queryParams["aggregated_by"] = 'day';
	request.queryParams["limit"] = '1';
	request.queryParams["start_date"] = today;
	request.queryParams["end_date"] = today;
	request.queryParams["offset"] = '1';

	request.method = 'GET';
	request.path = '/v3/stats';
	//send the request and check if connection is working and any error code is returned
	sg.API(request, function (error, response) {
		//if has error or status code is an error code
		if(error || (response.statusCode > 299 || response.statusCode < 200)) {
			console.log('Connection error/sendgrid');
			ok = false;
			callback(ok);
		}else {
			//conection is fine
			ok = true;
			callback(ok);
		}
	});
}

//export
module.exports = {
	MGgetStats: MGgetStats,
	SGgetStats: SGgetStats,
	sendMail: sendMail,
	sendMailSG: sendMailSG,
	sendMailMG: sendMailMG
}



