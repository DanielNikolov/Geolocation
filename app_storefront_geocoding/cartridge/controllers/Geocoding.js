'use strict';

/**
 * Controller that processes geolocation data
 *
 * @module controllers/Geocoding
 */

var app = require('/sitegenesis_storefront_controllers/cartridge/scripts/app');
var guard = require('/sitegenesis_storefront_controllers/cartridge/scripts/guard');
var GoogleService = require('~/cartridge/scripts/service/GeolocationService');
var StringUtils = require('dw/util/StringUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

var params = request.httpParameterMap;

function convertAddressToGeolocationFormat(_address : String) {
	var arr_address : Array = _address.split(',');
	var tmp_array : Array = [];
	for each(var token : String in arr_address) {
		tmp_array.push(dw.util.StringUtils.trim(token));
	}
	
	return tmp_array.join(',').replace(' ', '+', 'g');
}

function show() {
	var pageMeta = require('/sitegenesis_storefront_controllers/cartridge/scripts/meta');
    pageMeta.update({
    	pageTitle: 'Geolocation'
    });
	app.getView().render('home/geolocation');
	
}

function lookupAddress() {
	var address = convertAddressToGeolocationFormat(params.address.stringValue);
	var result = JSON.parse(GoogleService.LookupAddress(address));
	var geolocationCO = CustomObjectMgr.queryCustomObject('GeolocationRequest', 'custom.requestData={0}', address);
	var geolocationResult = null;
	if (!empty(geolocationCO)) {
		geolocationResult = empty(geolocationCO.custom.responseData) ? null : geolocationCO.custom.responseData;
	} else {
		var result = JSON.parse(GoogleService.LookupAddress(address));
		if (result.status == "OK") {
			geolocationResult = StringUtils.format('Latitude: {0} ; Longitude: {1}', result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
			geolocationResult.latitude = result.results[0].geometry.location.lat;
			geolocationResult.longitude = result.results[0].geometry.location.lng;
		}
		Transaction.wrap(function() {
			var date = new Date();
			geolocationCO = CustomObjectMgr.createCustomObject('GeolocationRequest', date.getTime().toString());
			geolocationCO.custom.requestData = address;
			geolocationCO.custom.responseData = geolocationResult;
		})		
	}
	
	app.getView({
		GeoLocation : geolocationResult
	}).render('home/geolocationresults');
}

exports.LookupAddress = guard.ensure(['get'], lookupAddress);
exports.Show = guard.ensure(['get'], show);