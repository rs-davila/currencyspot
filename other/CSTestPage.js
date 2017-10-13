// Note: This page and JavaScript is meant to make contract functions in Remix a bit easier to
// visually understand and comprehend.  This is not meant to be the most efficient way to do
// this function in JS, but to somewhat mimic Solidity's behavior

var allHedges = [];				// Global list of hedges
var hedgeIndices = {};			// Object: keys are addresses, and values are indices of allHedges
var hedgeBeneficiaries = [];	// Array of addresses, indices correlate with those of allHedges
var allTx = [];					// Array of transaction arrays, indices correlate with those of allHedges

// Transaction and Hedge constructors match that of CurrencyHedge contract
function Transaction(timeStamp, txValue, rateDiff) {
	this.timeStamp = timeStamp;
	this.txValue = txValue;
	this.rateDiff = rateDiff;
}

function Hedge(beneficiary, hedgeStart, hedgeEnd, homeCurr, hedgeCurr, refRate,
	instID, acctID, active) {
	this.beneficiary = beneficiary;
	this.hedgeStart = hedgeStart;
	this.hedgeEnd = hedgeEnd;
	this.homeCurr = homeCurr;
	this.hedgeCurr = hedgeCurr;
	this.refRate = refRate;
	this.instID = instID;
	this.acctID = acctID;
	this.active = active;
}

$(function() {
	$('#start .start').on('click', function(evt) {
		evt.preventDefault();
		initTest();
	});

	$('#start .reset').on('click', function(evt) {
		evt.preventDefault();
		resetTest();
	});

	// Fill out the hedge info area
	$('#hedgeArea')
		// Create row in grid
		.append($('<div>')
			.addClass('row')
			// Define left-hand div in row
			.append($('<div>')
				.addClass('col-xs-6 col-sm-6 col-md-6')
				.attr('style', 'border: 1px solid')
				// Create addHedge form
				.append($('<form>')
					.addClass('form-horizontal')
					.attr('id', 'addHedge')
					// Create container for input fields
					.append($('<div>')
						.addClass('form-group')
						// Add autogen button
						.append($('<div>')
							.addClass('col-sm-12 text-center')
							.append($('<div>')
								.addClass('col-sm-6 text-center')
								.append($('<button>')
									.addClass('btn btn-default')
									.text('Autogenerate hedge info')
									.css('color', '#0066FF')
									.on('click', function(evt) {
										evt.preventDefault();
										autogenHedge();
									})
								)
							)
						)
						// Add input fields for addhedge
						.append($('<label>')
							.attr('for', 'beneficiary')
							.addClass('col-sm-4 control-label')
							.html('Client address: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'beneficiary')
								.attr('placeholder', '0x...')
							)
						)
						.append($('<label>')
							.attr('for', 'hedgeStart')
							.addClass('col-sm-4 control-label')
							.html('Hedge start date: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'hedgeStart')
								.attr('placeholder', 'yyyy-mm-dd')
							)
						)
						.append($('<label>')
							.attr('for', 'hedgeEnd')
							.addClass('col-sm-4 control-label')
							.html('Hedge end date: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'hedgeEnd')
								.attr('placeholder', 'yyyy-mm-dd')
							)
						)
						.append($('<label>')
							.attr('for', 'homeCurr')
							.addClass('col-sm-4 control-label')
							.html('Home currency: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'homeCurr')
								.attr('placeholder', 'e.g. "USD", "EUR", "JPY" (quotes included)')
							)
						)
						.append($('<label>')
							.attr('for', 'homeCurr')
							.addClass('col-sm-4 control-label')
							.html('Hedge currency: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'hedgeCurr')
								.attr('placeholder', 'e.g. "MXN", "AED", "THB" (quotes included)')
							)
						)
						.append($('<label>')
							.attr('for', 'refRate')
							.addClass('col-sm-4 control-label')
							.html('Reference rate: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'refRate')
								.attr('placeholder', 'e.g. 0.05615 for 1 USD : 17.81 MEX')
							)
						)
						.append($('<label>')
							.attr('for', 'instID')
							.addClass('col-sm-4 control-label')
							.html('Client bank: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'instID')
								.attr('placeholder', 'e.g. "Visa", "J.P. Morgan", "Travelex"')
							)
						)
						.append($('<label>')
							.attr('for', 'acctID')
							.addClass('col-sm-4 control-label')
							.html('Client account #: &nbsp\;')
						)
						.append($('<div>')
							.addClass('col-sm-8')
							.append($('<input>')
								.addClass('form-control')
								.attr('id', 'acctID')
								.attr('placeholder', 'e.g. 2027621401')
							)
						)
						// Append buttons and attach listeners
						.append($('<div>')
							.addClass('col-sm-6 text-center')
							.append($('<button>')
								.addClass('btn btn-default')
								.text('Get input string for addHedge')
								.css('background-color', '#0066FF')
								.css('color', 'white')
								.on('click', function(evt) {
									evt.preventDefault();
									getAddHedgeString();
								})
							)
						)
						.append($('<div>')
							.addClass('col-sm-6 text-center')
							.append($('<button>')
								.addClass('btn btn-default')
								.text('Add hedge to list')
								.css('color', '#0066FF')
								.on('click', function(evt) {
									evt.preventDefault();
									addHedgeToList();
								})
							)
						)
					)
				)
			)
			// Define right-hand div in row
			.append($('<div>')
				.addClass('col-xs-6 col-sm-6 col-md-6')
				.html('List of hedges in allHedges array:')
				.attr('id', 'hedgeList')
			)
		);

	// Prepare the transaction area
	$('#txArea')
		.addClass('row')
		// Define left-hand div in row
		.append($('<div>')
			.addClass('col-xs-6 col-sm-6 col-md-6')
			.attr('style', 'border: 1px solid')
			// Create addTx form
			.append($('<form>')
				.addClass('form-horizontal')
				.attr('id', 'addTx')
				// Create container for input fields
				.append($('<div>')
					.addClass('form-group')
					// Add autogen button
					.append($('<div>')
						.addClass('col-sm-12 text-center')
						.append($('<div>')
							.addClass('col-sm-6 text-center')
							.append($('<button>')
								.addClass('btn btn-default')
								.text('Autogenerate transaction')
								.css('color', '#0066FF')
								.on('click', function(evt) {
									evt.preventDefault();
									autogenTx();
								})
							)
						)
						.append($('<div>')
							.addClass('col-sm-6 text-center')
							.append($('<button>')
								.addClass('btn btn-default')
								.text('Show transactions at hedge')
								.css('color', '#0066FF')
								.on('click', function(evt) {
									evt.preventDefault();
									showTxList();
								})
							)
						)
					)
					// Add input fields for addTx
					.append($('<label>')
						.attr('for', 'hedgeIndex')
						.addClass('col-sm-4 control-label')
						.html('Select hedge index: &nbsp\;')
					)
					.append($('<div>')
						.addClass('col-sm-8')
						.append($('<input>')
							.addClass('form-control')
							.attr('id', 'hedgeIndex')
							.attr('type', 'number')
							.attr('min', 0)
							.attr('max', 0)
						)
					)
					.append($('<label>')
						.attr('for', 'txDate')
						.addClass('col-sm-4 control-label')
						.html('Tx date: &nbsp\;')
					)
					.append($('<div>')
						.addClass('col-sm-8')
						.append($('<input>')
							.addClass('form-control')
							.attr('id', 'txDate')
							.attr('placeholder', 'yyyy-mm-dd')
						)
					)
					.append($('<label>')
						.attr('for', 'txValue')
						.addClass('col-sm-4 control-label')
						.html('Tx value (hedge curr): &nbsp\;')
					)
					.append($('<div>')
						.addClass('col-sm-8')
						.append($('<input>')
							.addClass('form-control')
							.attr('id', 'txValue')
						)
					)
					.append($('<label>')
						.attr('for', 'spotRate')
						.addClass('col-sm-4 control-label')
						.html('Spot FX rate: &nbsp\;')
					)
					.append($('<div>')
						.addClass('col-sm-8')
						.append($('<input>')
							.addClass('form-control')
							.attr('id', 'spotRate')
						)
					)
				)
			)
			// Append buttons and attach listeners
			.append($('<div>')
				.addClass('col-sm-6 text-center')
				.append($('<button>')
					.addClass('btn btn-default')
					.text('Get input string for addTx')
					.css('background-color', '#0066FF')
					.css('color', 'white')
					.on('click', function(evt) {
						evt.preventDefault();
						getAddTxString();
					})
				)
			)
			.append($('<div>')
				.addClass('col-sm-6 text-center')
				.append($('<button>')
					.addClass('btn btn-default')
					.text('Add transaction to hedge')
					.css('color', '#0066FF')
					.on('click', function(evt) {
						evt.preventDefault();
						addTxToHedge();
					})
				)
			)
		)
		// Define right-hand div in row
		.append($('<div>')
			.addClass('col-xs-6 col-sm-6 col-md-6')
			.attr('id', 'txList')
			.html('Transaction list for hedge at index: <b id="hedgeNum"></b>')
		);
});

function initTest() {
	$('#ownerIs').html($('#ownerAddr').val());
	$('#start input').prop('disabled', true);
}

function resetTest() {
	$('#ownerIs').html('');
	$('#hedgeList').empty();
	$('#hedgeList').html('List of hedges in allHedges array:');
	$('#txList').empty();
	$('#txList').html('Transaction list for hedge at index: <b id="hedgeNum"></b>');
	$('form').trigger('reset');
	$('#start input').prop('disabled', false);
}

function autogenHedge() {
	var address = '0x';
	var possible = '0123456789abcdef';

	for (var i = 0; i < 40; i++) {
		address += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	$('#beneficiary').val(address);

	var month = Math.floor(4 + Math.random() * 4.99);
	var day = Math.floor(1 + Math.random() * 27.99);
	if (day < 10) {day = '0' + day;}

	$('#hedgeStart').val('2018-0' + month + '-' + day);
	$('#hedgeEnd').val('2018-0' + (month + 1) + '-' + day);

	possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var homeCurr = '';
	var hedgeCurr = '';

	for (i = 0; i < 3; i++) {
		homeCurr += possible.charAt(Math.floor(Math.random() * possible.length));
		hedgeCurr += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	$('#homeCurr').val(homeCurr);
	$('#hedgeCurr').val(hedgeCurr);
	$('#refRate').val(parseFloat(Math.random().toFixed(5)));

	var instID = '';
	var acctID = '';

	for (i = 0; i < 4; i++) {
		instID += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	possible = '0213456789';
	for (i = 0; i < 4; i++) {
		acctID += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	$('#instID').val(instID);
	$('#acctID').val(acctID);
}

function getAddHedgeString() {
	var beneficiary = $('#beneficiary').val();
	if (beneficiary.length != 42 || beneficiary.substring(0, 2) != '0x') {
		throw 'Please provide an Ethereum account address to "Client address"';
	}

	var hedgeStart = $('#hedgeStart').val();
	var hedgeEnd = $('#hedgeEnd').val();
	if (!Date.parse(hedgeStart) || !Date.parse(hedgeEnd)) {
		throw 'Please use YYYY-MM-DD format for start and end dates';
	}

	hedgeStart = Date.parse(hedgeStart) / 1000;
	hedgeEnd = Date.parse(hedgeEnd) / 1000;

	var homeCurr = $('#homeCurr').val();
	var hedgeCurr = $('#hedgeCurr').val();
	if (homeCurr. length != 3 || hedgeCurr.length != 3) {
		throw 'Please provide 3-letter codes for currencies';
	}

	var refRateScaled = Math.trunc($('#refRate').val() * 10**5);
	if (!Number.isInteger(refRateScaled)) {
		throw 'Please provide a valid number (up to 5 decimal places) for the exchange rate';
	}

	var instID = $('#instID').val();
	var acctID = $('#acctID').val();

	var addHedgeString = '"' + beneficiary + '", ' + hedgeStart + ", " + hedgeEnd
		+ ', "' + homeCurr + '", "' + hedgeCurr + '", ' + refRateScaled + ', "'
		+ instID + '", ' + acctID;

	prompt('Please enter this string into the addHedge function in Remix:', addHedgeString);
}

function addHedgeToList() {
	var beneficiary = $('#beneficiary').val();

	allHedges.push(new Hedge(beneficiary,
		Date.parse($('#hedgeStart').val()) / 1000,
		Date.parse($('#hedgeEnd').val()) / 1000,
		homeCurr = $('#homeCurr').val(),
		hedgeCurr = $('#hedgeCurr').val(),
		Math.trunc($('#refRate').val() * 10**5),
		$('#instID').val(),
		$('#acctID').val(),
		false));

	if(hedgeIndices[beneficiary] == null) {
		hedgeIndices[beneficiary] = [allHedges.length - 1];
	} else {
		hedgeIndices[beneficiary].push(allHedges.length - 1);
	}

	hedgeBeneficiaries.push(beneficiary);
	allTx[allHedges.length - 1] = [];

	$('#hedgeList')
		.append($('<div>')
			.addClass('row')
			.append($('<div>')
				.addClass('col-xs-1 col-sm-1 col-md-1')
				.attr('id', 'hedgeID')
				.html(allHedges.length - 1)
			)
			.append($('<div>')
				.addClass('col-xs-7 col-sm-7 col-md-7')
				.html(beneficiary)
			)
			.append($('<div>')
				.addClass('col-xs-2 col-sm-2 col-md-2')
				.css('color', '#0066FF')
				.html('Details')
				.on('click', function() {
					var index = parseInt($('#hedgeID').html());

					alert('Hedge at index ' + index + ':\n' +
						'Beneficiary: ' + allHedges[index].beneficiary + '\n' +
						'Start date: ' + allHedges[index].hedgeStart + '\n' +
						'End date: ' + allHedges[index].hedgeEnd + '\n' +
						'Home currency: ' + allHedges[index].homeCurr + '\n' +
						'Hedge currency: ' + allHedges[index].hedgeCurr + '\n' +
						'Reference rate: ' + (allHedges[index].refRate / (10**5)) + '\n' +
						'Institution: ' + allHedges[index].instID + '\n' +
						'Account: ' + allHedges[index].acctID + '\n' +
						'Current status: ' + (allHedges[index].active ? 'active' : 'inactive'));
				})
			)
			.append($('<div>')
				.addClass('col-xs-2 col-sm-2 col-md-2')
				.css('color', '#0066FF')
				.html('Transactions')
				.on('click', showTxList)
			)
		);

	$('#hedgeIndex').attr('max', allHedges.length - 1);
}

function autogenTx() {
	if (allHedges.length == 0) {
		alert('Please create a hedge first');
	} else {
		var index = Math.floor(Math.random() * (allHedges.length - 0.01));
		$('#hedgeIndex').val(index);

		var txDate = new Date((allHedges[index].hedgeStart + Math.floor(Math.random() * (allHedges[index].hedgeEnd - allHedges[index].hedgeStart))) * 1000);
		var txDateString = txDate.getFullYear() + '-' + ((txDate.getMonth() < 10) ? ('0' + txDate.getMonth()) : txDate.getMonth())
			+ '-' + ((txDate.getDate() < 10) ? ('0' + txDate.getDate()) : txDate.getDate());
		$('#txDate').val(txDateString);

		$('#txValue').val(50 + Math.floor(Math.random() * 100.99));
		$('#spotRate').val(Math.trunc(allHedges[index].refRate * (0.95 + Math.random() * 0.1)) / (10**5));
	}
}

function getAddTxString() {
	var index = parseInt($('#hedgeIndex').val());
	var beneficiary = hedgeBeneficiaries[index];
	if (!Date.parse($('#txDate').val())) {
		throw 'Please use YYYY-MM-DD format for start and end dates';
	}

	var timeStamp = Date.parse($('#txDate').val()) / 1000;
	var txValue = Number($('#txValue').val());
	var rateDiff = (Number($('#spotRate').val()) * (10**5)) - allHedges[index].refRate;

	var addTxString = '"' + beneficiary + '", ' + index + ", " + timeStamp
		+ ', ' + txValue + ', ' + rateDiff;

	prompt('Please enter this string into the addTx function in Remix:', addTxString);
}

function addTxToHedge() {
	// Will be needed for error checking
	//var index = parseInt($('#hedgeIndex').val());
	//var beneficiary = hedgeBeneficiaries[index];

	var index = parseInt($('#hedgeIndex').val());
	allTx[index].push(new Transaction(Date.parse($('#txDate').val()) / 1000,
		Number($('#txValue').val()),
		(Number($('#spotRate').val()) * (10**5)) - allHedges[index].refRate));
}

function autogenTxGroup() {
	var numTx = Math.floor(5 + Math.random() * 5.99);
	var index = parseInt($('#hedgeIndex').val());
	var hedgePeriod = allHedges[index].hedgeEnd - allHedges[index].hedgeStart;
	var timeStamp, txValue, rateDiff;

	for (var i = 0; i < numTx; i++) {
		timeStamp = allHedges[index].hedgeStart + Math.floor(Match.random() * hedgePeriod);
		txValue = 50 + Math.floor(Math.random() * 100.99);
		rateDiff = Math.trunc(allHedges[index].refRate * (-0.05 + Math.random() * 0.1));
		allTx[index].push(new Transaction(timeStamp, txValue, rateDiff));
	}
}

function showTxList() {
	// 1. What hedge index are we referring to?
	// 2. Are there transactions to show?
	// 3. Clear current tx list (if not already empty)
	// 4. Add in the txs from allHedges[index] to div rows

	var index = parseInt($('#hedgeIndex').val());

	if (isNaN(index) || index > allTx.length) {
		alert('Invalid hedge index');
		throw 'Invalid hedge index';
	}
	$('#hedgeNum').html(index);
	$('#txList div').empty();

	if (allTx[index].length == 0) {
		$('#txList')
			.append($('<div>')
				.html('No transactions associated with this hedge')
			);
	} else {
		for (var i = 0; i < allTx[index].length; i++) {
			$('#txList')
				.append($('<div>')
					.addClass('row')
					.append($('<div>')
						.addClass('col-xs-1 col-sm-1 col-md-1')
						.attr('id', 'txID')
						.html(i)
					)
					.append($('<div>')
						.addClass('col-xs-7 col-sm-7 col-md-7')
						.html(allTx[index][i].timeStamp)
					)
					.append($('<div>')
						.addClass('col-xs-4 col-sm-4 col-md-4')
						.css('color', '#0066FF')
						.html('Details')
						.on('click', function() {
							var txIndex = parseInt($('#txID').html());

							alert('Transaction ' + txIndex + ' for hedge ' + index + ':\n' +
								'Timestamp: ' + allTx[index][txIndex].timeStamp + '\n' +
								'Value: ' + allTx[index][txIndex].txValue + '\n' +
								'Rate difference: ' + allTx[index][txIndex].rateDiff);
						})
					)
				);
		}
	}
}
