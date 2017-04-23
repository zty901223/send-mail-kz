var mocha = require('mocha');
var sinon = require('sinon');
var sendMailKZ = require('../lib/send-mail-kz');
var sgApiKey = 'Your sendgrid api key';
var mgApiKey = 'Your mailgun api key';
var mgDomain = 'example.mailgun.org';
var sendgrid = require('sendgrid')(sgApiKey);
var mailgun = require('mailgun-js')({apiKey: mgApiKey, domain: mgDomain});

describe('function SGgetStats: sendgrid get status', function(){
	it('should call sendgrid.API once with an empty request', function(){
		var request = sendgrid.emptyRequest();
		var sg = sinon.mock(sendgrid);
		sg.expects('API').once();
		sendMailKZ.SGgetStats(sgApiKey, function() {});
		process.nextTick(function() {
			sg.verify();			
			sg.restore();
		})
	})
})

describe('function MGgetStats: mailgun get status', function(){
	it('should call mailgun.get once with mailgun domain', function(){
		var mg = sinon.mock(mailgun);
		mg.expects('get').once();
		sendMailKZ.MGgetStats(mgApiKey, mgDomain, function() {});
		process.nextTick(function() {
			mg.verify();			
			mg.restore();
		})
	})
})

describe('function sendMailSG: send mail using sendgrid', function(){
	it('should call sendgrid.api once with request', function(){
		var mailBody = {
			fromMailAddress: 'fromMailAddress',
			toMailAddress: 'toMailAddress',
			subject: 'subject',
			content: 'cntent'
		}
		var helper = require('sendgrid').mail;
		var from_email = new helper.Email(mailBody.fromMailAddress);
		var to_email = new helper.Email(mailBody.toMailAddress);
		var subject = mailBody.subject;
		var content = new helper.Content('text/plain', mailBody.emailContent);
		var mail = new helper.Mail(from_email, subject, to_email, content);
		var request = sendgrid.emptyRequest();
		var sg = sinon.mock(sendgrid);
		sg.expects('API').once();
		sendMailKZ.sendMailSG(mailBody, sgApiKey);
		process.nextTick(function() {
			sg.verify();			
			sg.restore();
		})
	})
})

describe('function sendMailMG: send mail using mailgun', function(){
	it('should call mailgun.message once with mail body, mailgun api key and mailgun domain', function(){
		var mailBody = {
			fromMailAddress: 'fromMailAddress',
			toMailAddress: 'toMailAddress',
			subject: 'subject',
			content: 'cntent'
		}
		var mg = sinon.mock(mailgun);
		mg.expects('send').once().withArgs(mailBody);
		sendMailKZ.sendMailMG(mailBody, mgApiKey, mgDomain, function() {});
		process.nextTick(function() {
			sg.verify();			
			sg.restore();
		})
	})
})