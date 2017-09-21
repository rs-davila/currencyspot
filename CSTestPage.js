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
			)
			.append($('<div>', {
				'text': 'Rabl<br>grabl'
			}))
		);
	
	$('start :input').prop('disabled', true);	
}

function resetForm() {
	$('.dataFields').remove();
}