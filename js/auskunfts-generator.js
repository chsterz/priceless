var doc;

function generatePricelists() {
  generatePricelist(pricelist)
}

function generatePricelist(pricelist) {
	// letter layout according to http://upload.wikimedia.org/wikipedia/commons/6/64/DIN_5008%2C_Form_A.svg
	doc = new jsPDF('p', 'mm', 'a4');


	if (typeof doc == 'undefined') 
		alert('Error within PDF generation. Your browser does not seem to support this operation. If possible, please try another one.')


	var event_name = "Preisliste " + $("#event_name").val() || 'Event Name';
	doc.setFontSize(28);
	doc.text(25, 27, event_name);

  var prices = "";

  $('.drink_line').each(function(i, obj) {
    if ($(obj).find('.checked_field').attr('checked') == 'checked')
    prices = prices + $(obj).find('.name_field').val() + "\t" + $(obj).find('.price_field').val() + crlf;
  });

	doc.setFontSize(14);

	var txt =   prices;
	var lines = doc.splitTextToSize(txt, 155)
	doc.text(25, 60.46, lines)

	/*
	if (photo) {
		doc.addPage();
		doc.addImage(photo, 'JPEG', 15, 40, 180, 160);
	}
	*/
}

function updatePane() {
	generatePricelists();

	if (typeof doc !== 'undefined') {
		var string = doc.output('datauristring');
		$('.preview-pane').show();
		$('.preview-pane').attr('src', string);
	}
}

function savePDF() {
	generatePricelists();
	doc.save('preisliste.pdf');
}

function calculate50(price) {
  if (price < 1.0) {
    return (price + 0.5).toFixed(2);
  } else {
    return (price * 1.5).toFixed(2);
  }
}

function roundup50(price){
  return ( (Math.ceil((price*100)/50)*50)/100 ).toFixed(2);
}

$(function() {
	for (var d in pricelist) {
		var drink = pricelist[d];
		var checked = '';

		checked ='checked="checked"';

		var drinkLine = '\
			<div class="form-group col-lg-12 drink_line" style="margin-bottom:5px;">\
				<div class="checkbox col-lg-12">\
				  <div class="col-md-3">\
				    <input ' + checked + ' class="checked_field" name="pricelist[]" value="' + d + '" type="checkbox">\
            <input type="text" class="name_field" value="' + drink.drink + '"></input>\
					</div>\
				  <div class="input-group col-md-2 offset-md-4">\
					  <div class="input-group-addon">EUR</div>\
				  	<input type="number" class="price_field"\
				  	  min="' + roundup50(calculate50(drink.price))+'"\
				  	  value="' + roundup50(calculate50(drink.price)) +'"\
				  	  step="0.50"\
				  	  placeholder="Preis" >\
				  	</input>\
				  	<div class="input-group-addon"> (' +calculate50(drink.price) + ')</div>\
				  </div>\
				</div>\
			</div>\
		';
		$("#drinks").append(drinkLine);
	}
});

var photo;
function getPhoto(evt) {
	var file = evt.target.files[0];
	var reader = new FileReader();

	//if (!file.type.match('image.')) {
		//return;
	//}

	var reader = new FileReader();

	reader.onload = (function(theFile) {
		return function(e) {
			photo = e.target.result;
			//updatePane();
		};
	})(file);

	reader.readAsDataURL(file)
}
