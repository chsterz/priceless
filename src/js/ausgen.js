var crlf = "\r\n";
var agencies = {
	"bverf": {
		  title: "Bundesamt für Verfassungsschutz (BVerf)"
		, street: "Strasse"
		, city: "Stadt"
		, zipcode: "PLZ"
		, country: "Germany"
	}
	, "bawue": {
		  title: "Landesamt für Verfassungsschutz BaWü"
		, street: "Strasse"
		, city: "Stadt"
		, zipcode: "PLZ"
		, country: "Germany"
	}
}
var photo;
var doc = new jsPDF('p', 'mm', 'a4');
var addr = {
	  name: ''
	, street: ''
	, city: ''
	, zipcode: ''
}

function generateLetters() {
	var receivers = [];
	$("input[name='agencies[]']:checked").each(function() {
		//checked_agencies.push($(this).val());
		//console.log($(this).val());

		receivers.push( agencies[$(this).val()] );
	});

	console.log(receivers);
	for (var r in receivers)
		generateLetter(receivers[r]);
}

function generateLetter(receiver) {
	// letter layout according to http://upload.wikimedia.org/wikipedia/commons/6/64/DIN_5008%2C_Form_A.svg

	// faltmarken 
	doc.setLineWidth(0.5);
	doc.line(0, 87, 10, 87);

	doc.setLineWidth(0.5);
	doc.line(0, 148.5, 10, 148.5);

	//doc.setFont(['Times', 'Roman']).setFontSize(12);
	//doc.text(20, 20, 'Hello world!');
	//doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');

	addr.name = $("#addr_name").val();
	addr.street = $("#addr_street").val();
	addr.zipcode = $("#addr_zipcode").val();
	addr.city = $("#addr_city").val();
	var send_back_to = [addr.name, addr.street, addr.zipcode, addr.city].join(', ');

	doc.setFontSize(10);
	doc.text(20, 27, send_back_to);
	console.log(send_back_to);

	doc.setFontSize(12);
	var rcvr = 
		  receiver.title + crlf 
		+ receiver.street + crlf 
		+ receiver.zipcode + receiver.city
		+ crlf + receiver.country;
	doc.text(20, 44.7, rcvr);

	doc.text(25, 95.46, 'text');

	doc.addPage();
	doc.text(20, 20, 'Do you like that?');
	if (photo)
		doc.addImage(photo, 'JPEG', 15, 40, 180, 160);
}

function getPhoto(evt) {
	console.log('getphoto');
	var file = evt.target.files[0];
	var reader = new FileReader();

	//if (!file.type.match('image.')) {
	//continue;
	//}

	var reader = new FileReader();

	reader.onload = (function(theFile) {
		return function(e) {
			//console.log(e.target.result);
			photo = e.target.result;

			//updatePane();
		};
	})(file);

	reader.readAsDataURL(file)

	//console.log(data);
	//console.log(file);
	//console.log(evt.target);
}

function updatePane() {
	if (typeof doc !== 'undefined') {
		generateLetters();
		var string = doc.output('datauristring');
		$('.preview-pane').attr('src', string);
	}
}

function savePDF() {
	generateLetters();
	doc.save('anschreiben.pdf');
}

$(function() {
	for (var a in agencies) {
		var agency = agencies[a];
		var html = '\
			<div class="checkbox">\
			<label>\
				<input name="agencies[]" value="' + a + '" type="checkbox"> ' + agency.title + '</label>\
			</div>\
		';
		$("#agencies").append(html);
	}
	//$('body').on('change', 'passport_photo', getPhoto);
	document.getElementById('passport_photo').addEventListener('change', getPhoto, false);

});
