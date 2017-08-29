'use strict';

var ajax = require('./ajax'),
	util = require('./util');

var geolocation = {
	init: function() {
		$('#search').on('click', function(e) {
			var address = $('#search-data').val();
			if (!address || address.trim().length < 1) {
				$('#task-data span').show();
				$('#search-data').addClass('error');
			} else {
				$('#task-data span').hide();
				$('#search-data').removeClass('error');
				
				ajax.load({
					url: util.appendParamToURL(Urls.lookupAddress, 'address', address.replace(/\s+/g, ' ').toLowerCase()),
					callback: function(response) {
						$('#results-container').html(response);
					}
				});
				
			}
		});
	}
}

module.exports = geolocation; 