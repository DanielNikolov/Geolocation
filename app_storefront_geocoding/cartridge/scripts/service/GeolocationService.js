'use strict';

var ServiceRegistry = require('dw/svc/ServiceRegistry');
var Site = require('dw/system/Site');

function lookupAddress(address) {
	var apiKey = Site.current.getCustomPreferenceValue('geolocationAPIKey');	
	var result = ServiceRegistry.get('int_google.rest.GeolocationService').call(address, apiKey);
	
	return JSON.stringify(result.object);
}

exports.LookupAddress = lookupAddress;