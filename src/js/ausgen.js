var agencies = [
	{
		  title: "Bundesamt für Verfassungsschutz (BVerf)"
		, street: "Strasse"
		, city: "Stadt"
		, zipcode: "PLZ"
		, country: "Germany"
	}
	, {
		  title: "Landesamt für Verfassungsschutz BaWü"
		, street: "Strasse"
		, city: "Stadt"
		, zipcode: "PLZ"
		, country: "Germany"
	}
]

var doc = new jsPDF();

function generateLetter() {
	doc.text(20, 20, 'Hello world!');
	doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
	doc.addPage();
	doc.text(20, 20, 'Do you like that?');
}

function updatePane() {
	if (typeof doc !== 'undefined') {
		generateLetter();
		var string = doc.output('datauristring');
		$('.preview-pane').attr('src', string);
	}
}

function savePDF() {
	generateLetter();
	doc.save('anschreiben.pdf');
}

$(function() {
	for (var a in agencies) {
		var agency = agencies[a];
		var html = '\
			<div class="checkbox">\
			<label>\
				<input type="checkbox"> ' + agency.title + '</label>\
			</div>\
		';
		$("#agencies").append(html);
	}

});
