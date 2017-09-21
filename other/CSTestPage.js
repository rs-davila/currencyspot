$(function() {
	$('#start .start').on('click', function(evt) {
		evt.preventDefault();
		initTest();
	});

	$('#start .reset').on('click', function(evt) {
		evt.preventDefault();
		resetForm();
	});
});

function initTest() {
	$('body')
		.append($('<div>')
			.addClass('container-m1')
			.append($('<p>')
				.text('Owner address: "' + $('#ownerAddr').val() + '"')
			))
		// Left-justified div to hold fields for adding a hedge
		.append($('<div>')
			.attr('style', 'width: 50%')
			.attr('style', 'border: 1px solid')
			.text('Required fields for adding a new hedge')
			.append($('<form>')
				.attr('id', 'addHedge')
				.addClass('form-inline')
				.append($('<div>')
					.append($('<label>')
						.html('Client address: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'beneficiary')
						.attr('placeholder', '0x...')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Hedge start date: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'hedgeStart')
						.attr('placeholder', 'yyyy-mm-dd')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Hedge end date: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'hedgeEnd')
						.attr('placeholder', 'yyyy-mm-dd')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Home currency: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'homeCurr')
						.attr('placeholder', 'e.g. "USD", "EUR", "JPY" (quotes included)')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Currency to hedge against: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'hedgeCurr')
						.attr('placeholder', 'e.g. "MXN", "AED", "THB" (quotes included)')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Reference rate: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'refRate')
						.attr('placeholder', 'e.g. "0.05615" for 1 USD : 17.81 MEX')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Client banking institution: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'instID')
						.attr('placeholder', 'e.g. "Visa", "J.P. Morgan", "Travelex"')
						.addClass('form-control')
					)
				)
				.append($('<div>')
					.append($('<label>')
						.html('Client account number: &nbsp')
					)
					.append($('<input>')
						.attr('id', 'acctID')
						.attr('placeholder', '2027621401')
						.addClass('form-control')
					)
				)
				.append($('<button>')
					.addClass('btn btn-default')
					.text('Get Remix string')
					.on('click', function(evt) {
						evt.preventDefault();
						getAddHedgeString();
					})
				)
			)
			.append($('<div>')
			//	.html()
			)
		);

	$('start :input').prop('disabled', true);
}

function resetForm() {
	$('.dataFields').remove();
}

function getAddHedgeString() {
	var beneficiary = $('#addHedge #beneficiary').val();
	if (beneficiary.length != 42 || beneficiary.substring(0, 2) != '0x') {
		throw 'Please provide an Ethereum account address to "Client address"';
	}

	var hedgeStart = $('#addHedge #hedgeStart').val();
	var hedgeEnd = $('#addHedge #hedgeEnd').val();
	if (!Date.parse(hedgeStart) || !Date.parse(hedgeEnd)) {
		throw 'Please use YYYY-MM-DD format for start and end dates';
	}

	hedgeStart = Date.parse(hedgeStart) / 1000;
	hedgeEnd = Date.parse(hedgeEnd) / 1000;

	var homeCurr = $('#addHedge #homeCurr').val();
	var hedgeCurr = $('#addHedge #hedgeCurr').val();
	if (homeCurr. length != 3 || hedgeCurr.length != 3) {
		throw 'Please provide 3-letter codes for currencies';
	}

	var refRateScaled = Math.trunc($('#addHedge #refRate').val() * 10^5);
	if (!Number.isInteger(refRateScaled)) {
		throw 'Please provide a valid number (up to 5 decimal places) for the exchange rate';
	}

	var instID = $('#addHedge #instID').val();
	var acctID = $('#addHedge #acctID').val();

	var addHedgeString = '"' + beneficiary + '", ' + hedgeStart + ", " + hedgeEnd
		+ ', "' + homeCurr + '", "' + hedgeCurr + '", ' + refRateScaled + ', "'
		+ bankID + '", ' + acctID;

	prompt('Please enter this string into the addHedge function in Remix:', addHedgeString);
}
