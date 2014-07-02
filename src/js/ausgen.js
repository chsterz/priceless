var doc;
var photo;
var agencies = {
	"LVS Berlin": {
		  title: "Senatsverwaltung für Inneres"
		, subtitle: "Abteilung II – Verfassungsschutz"
		, street: "Postfach 62 05 60"
		, zipcode: "10795"
		, city: "Berlin"
		, country: "Deutschland"
		, tel: "030 90 129-111"
		, fax:  "030 90 129-844"
		, law: "§ 31, Abs. 1 des Gesetzes über den Verfassungsschutz in Berlin und § 16 Berliner Datenschutzgesetz"

	}
	, "LVS Brandenburg": {
		  title: "Ministerium des Inneren des Landes Brandenburg"
		, subtitle: "Abteilung Verfassungsschutz"
		, street: "Posfach 60 11 26"
		, zipcode: "14411"
		, city: "Potsdam"
		, country: "Deutschland"
		, tel: "0331 866 - 2500"
		, fax: "0331 866 – 2599"
		, law: "§ 18 Brandenburgischen Datenschutzgesetze und § 12, Abs. 1 Brandenburgisches Verfassungsschutzgesetzes"
		, mail: "info@verfassungsschutz-brandenburg.de"
	}
}
var addr = {
	  name: ''
	, street: ''
	, city: ''
	, zipcode: ''
}
var crlf = "\r\n";
var texts = ["Sehr geehrte Damen und Herren," + crlf + crlf +
"geben Sie mir bitte auf der Grundlage von $rechtsgrundlage$ schriftlich \
Auskunft über die durch Ihre Behörde (auch im Weg der \
Auftragsdatenverarbeitung)" + crlf + 
"   - zu meiner Person gespeicherten Daten," + crlf + 
"   - den Zweck und die Rechtsgrundlage der Speicherung," + crlf + 
"   - die Herkunft der Daten und die empfangenden Stellen oder Kategorien \
von empfangenden Stellen, an die Daten übermittelt werden oder \
wurden." + crlf + crlf +
"Bitte teilen Sie mir ggfs. auch mit, auf welcher Rechtsgrundlage Daten \
über mich übermittelt wurden." + crlf + crlf +
"Schliesslich bitte ich um eine Eingangsbestätigung dieses Schreibens." + crlf +
"Bis zu Ihrer Antwort widerspreche ich der Löschung über mich gesammelter Daten." 
+ crlf + crlf + crlf +
"Mit freundlichen Grüßen"
];

function generateLetters() {
	var receivers = [];
	console.log("gernat");
	$("input[name='agencies[]']:checked").each(function() {
		//checked_agencies.push($(this).val());
		//console.log($(this).val());

		receivers.push( agencies[$(this).val()] );
	});

	if (receivers.length === 0) {
		alert('Sie haben kein Amt ausgewählt.');
		return;
	}

	console.log(receivers);
	var cnt = 0;
	for (var r in receivers) {
		generateLetter(receivers[r], cnt++);
	}
}

function generateLetter(receiver, cnt) {
console.log(cnt);
	// letter layout according to http://upload.wikimedia.org/wikipedia/commons/6/64/DIN_5008%2C_Form_A.svg
	if (cnt === 0) 
		doc = new jsPDF('p', 'mm', 'a4');
	else 
		doc.addPage();

	if (typeof doc == 'undefined') 
		alert('Error within PDF generation. Your browser does not seem to support this operation. If possible, please try another one.')

	// faltmarken 
	doc.setLineWidth(0.5);
	doc.line(0, 87, 10, 87);

	doc.setLineWidth(0.5);
	doc.line(0, 148.5, 10, 148.5);

	//doc.setFont(['Times', 'Roman']).setFontSize(12);
	//doc.text(20, 20, 'Hello world!');
	//doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');

	addr.name = $("#addr_name").val() || 'Max Mustermann';
	addr.street = $("#addr_street").val() || 'Musterstr. 1';
	addr.zipcode = $("#addr_zipcode").val() || '12345';
	addr.city = $("#addr_city").val() || 'Musterstadt';
	var send_back_to = [addr.name, addr.street, addr.zipcode + " " + addr.city].join(', ');

	doc.setFontSize(10);
	doc.text(20, 27, send_back_to);
	console.log(send_back_to);

	doc.setFontSize(12);
	var now = new Date();
	var date = "Datum: " + now.getDate() + "." + now.getMonth() + "." + now.getFullYear();
	var sender = [addr.name, addr.street, addr.zipcode + " " + addr.city, date].join(crlf);
	doc.text(125, 32, sender);

	var rcvr = 
		  receiver.title + crlf 
		+ receiver.street + crlf 
		+ receiver.zipcode + " " + receiver.city + crlf
		+ receiver.country;
	doc.text(20, 44.7, rcvr);

	var body = texts[0].replace("$rechtsgrundlage$", receiver.law);
	var txt = 'Betreff: Antrag auf Aktenauskunft' + crlf  + crlf + body + crlf
			+ crlf + addr.name;
	//doc.text(25, 95.46, txt);
	var lines = doc.splitTextToSize(txt, 155)
	doc.text(25, 95.46, lines)

	if (photo) {
		doc.addPage();
		doc.addImage(photo, 'JPEG', 15, 40, 180, 160);
	}
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
	generateLetters();

	if (typeof doc !== 'undefined') {
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
		console.log(a);
		var agency = agencies[a];
		var html = '\
			<div class="checkbox">\
			<label>\
				<input checked="checked" name="agencies[]" value="' + a + '" type="checkbox"> ' + agency.title + '</label>\
			</div>\
		';
		$("#agencies").append(html);
	}

	document.getElementById('passport_photo').addEventListener('change', getPhoto, false);

});
