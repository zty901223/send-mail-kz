//main function
function send_mail(mailBody, sgApiKey, mgApiKey, mgDomain) {
	return new Promise(function(resolve, reject) {
		let status = undefined;
		//Check if SendGrid service is up
		get_stats_sg(sgApiKey)
			.then(ok => {
				//Send mail using SendGrid
				send_mail_sg(mailBody, sgApiKey)
					.then(result => {
						status = 'sent by sendgrid';
						resolve(status);
					})
					.catch(result => {
						status = result;
						reject(status);
					});
			})
			.catch(ok => {
				//Check if Mailgun service is up
				get_stats_mg(mgApiKey, mgDomain)
					.then(ok => {
						//Send mail using Mailgun
						send_mail_mg(mailBody, mgApiKey, mgDomain)
							.then(body => {
								status = 'sent by mailgun';
								resolve(status);
							})
							.catch(body => {
								status = body;
								reject(status);
							});
					})
					//If both service is down
					.catch(ok => {
						status = 'Mail services are not available.';
						reject(status);
					});
			});
	});
}

//sendmail function using sendgrid
let send_mail_sg = function(mailBody, sgApiKey) {
	return new Promise(function(resolve, reject) {
		let helper = require('sendgrid').mail;
		let from_email = new helper.Email(mailBody.fromMailAddress);
		let to_email = new helper.Email(mailBody.toMailAddress);
		let subject = mailBody.subject;
		let content = new helper.Content('text/plain', mailBody.emailContent);
		let mail = new helper.Mail(from_email, subject, to_email, content);
		let sg = require('sendgrid')(sgApiKey);
		let request = sg.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: mail.toJSON()
		});

		sg.API(request, function(error, response) {
			if(error || (response.statusCode > 299 || response.statusCode < 200)) {
				let result = response.body;
				reject(result);
			} else {
				let result = response.statusCode;
				resolve(result);
			}
		});
	});
}

//sendmail function using mailgun
let send_mail_mg = function(mailBody, mgApiKey, mgDomain) {
	return new Promise(function(resolve, reject) {
		let mg_api_key = mgApiKey;
		let mg_domain = mgDomain;
		let mailgun = require('mailgun-js')({apiKey: mg_api_key, domain: mg_domain});
		let data = {
			from: mailBody.fromMailAddress,
			to: mailBody.toMailAddress,
			subject: mailBody.subject,
			text: mailBody.emailContent
		};

		mailgun.messages().send(data, function (error, body) {
			if (error) {
				reject(body);
			} else {
				resolve(body);
			}
		});
	});
}

//check mailgun apikey and domain status
let get_stats_mg = function(mgApiKey, mgDomain) {
	return new Promise(function(resolve, reject) {
		let ok = undefined;
		let mg_api_key = mgApiKey;
		let mg_domain = mgDomain;
		let mailgun = require('mailgun-js')({apiKey: mg_api_key, domain: mg_domain});
		//send requst and check if has error
		mailgun.get('/' + mg_domain + '/stats', { event: ['sent', 'delivered'] }, function (error, body) {
			//if mailgun apikey or domain is not valid, error won't be returned, instead the body will not be assigned with any value hence remain undefined
			if(error || body === undefined){
				console.log('Connection error/mailgun');
				ok = false;
				reject(ok);
			} else {
				//conection is fine
				ok = true;
				resolve(ok);
			}
		});
	});
}

//check sendgird apikey and status
let get_stats_sg = function(sgApiKey) {
	return new Promise(function(resolve, reject) {
		let ok = undefined;
		let sg = require('sendgrid')(sgApiKey);
		let request = sg.emptyRequest();
		let today = new Date().toISOString().substring(0, 10);
		request.queryParams['aggregated_by'] = 'day';
		request.queryParams['limit'] = '1';
		request.queryParams['start_date'] = today;
		request.queryParams['end_date'] = today;
		request.queryParams['offset'] = '1';
		request.method = 'GET';
		request.path = '/v3/stats';
		//send the request and check if connection is working and any error code is returned
		sg.API(request, function (error, response) {
			//if has error or status code is an error code
			if(error || (response.statusCode > 299 || response.statusCode < 200)) {
				console.log('Connection error/sendgrid');
				ok = false;
				reject(ok);
			}else {
				//conection is fine
				ok = true;
				resolve(ok);
			}
		});
	});
}

//export
module.exports = {
	send_mail: send_mail,
	send_mail_sg: send_mail_sg,
	send_mail_mg: send_mail_mg,
	get_stats_mg: get_stats_mg,
	get_stats_sg: get_stats_sg
};



