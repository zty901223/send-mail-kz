const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;
const sendMailKZ = require('../lib/send-mail-kz');
const sgApiKey = 'sendgrid api key';
const mgApiKey = 'mailgun api key';
const mgDomain = 'mailgun.domain.org';
const sendgrid = require('sendgrid')(sgApiKey);
const mailgun = require('mailgun-js')({apiKey: mgApiKey, domain: mgDomain});
const mailBody = {
	fromMailAddress: 'test@example.com',
	toMailAddress: 'test@example.com',
	subject: 'subject',
	emailContent: 'cntent'
};

describe('test get_stats_sg', function() {
	it('should return true with a valid SendGrid api key provided', function() {
		var test = true;
		var testResult = sendMailKZ.get_stats_sg(sgApiKey);
  
		return testResult.then(ok => {
			expect(ok).to.equal(test);
		});
	});
});

describe('test get_stats_mg', function() {
	it('should return true with valid Mailgun api key and domain provided', function() {
		var test = true;
		var testResult = sendMailKZ.get_stats_mg(mgApiKey, mgDomain);

		return testResult.then(ok => {
			expect(ok).to.equal(test);
		});
	});
});

describe('test send_mail_sg', function() {
	it('should return code 202 with valid mailbody and SendGrid api key provided', function() {
		var testResult = sendMailKZ.send_mail_sg(mailBody, sgApiKey);

		return testResult.then(result => {
			expect(result).to.equal(202);
		});
	});
});

describe('test send_mail_mg', function() {
	it('should resolve promise with valid mailbody, Mailgun api key and Mailgun domain provided', function() {
		var testResult = sendMailKZ.send_mail_mg(mailBody, mgApiKey, mgDomain);

		return testResult.then(result => {});
	});
});

describe('test send_mail', function() {
	it('should resolve promise with correct args provided', function() {
		var testResult = sendMailKZ.send_mail(mailBody, sgApiKey, mgApiKey, mgDomain);

		return testResult.then(status => {});
	});

	it('should call get_stats_sg once with sendgrid api key', function() {
		var sendMail = sinon.mock(sendMailKZ);
		sendMail.expects('get_stats_sg').once().withArgs(sgApiKey);
		var testResult = sendMailKZ.send_mail(mailBody, sgApiKey, mgApiKey, mgDomain);

		return testResult.then(status => {
			sendMail.verify();
			sendMail.restore();
		});
	});
});