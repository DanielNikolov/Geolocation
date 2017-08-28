'use strict';

var app = require('/sitegenesis_storefront_controllers/cartridge/scripts/app');
var guard = require('/sitegenesis_storefront_controllers/cartridge/scripts/guard');
var GoogleService = require('~/cartridge/scripts/service/GeolocationService');
var StringUtils = require('dw/util/StringUtils');

function show() {
	app.getView().render('home/geolocation');
}

function lookupAddress() {
	var address = 'Dimitar Hadzhikotsev 55, Sofia, Bulgaria'.replace(' ', '+', 'g');
	var result = GoogleService.LookupAddress(address);
	
	app.getView({
		GeoLocation : result,
		showCountrySelector : false
	}).render('geolocationresults');
}

exports.LookupAddress = guard.ensure(['get'], lookupAddress);
exports.Show = guard.ensure(['get'], show);