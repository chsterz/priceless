var doc

function generatePricelists () {
	generatePricelist(pricelist)
}

function generatePricelist (pricelist) {
	// letter layout according to http://upload.wikimedia.org/wikipedia/commons/6/64/DIN_5008%2C_Form_A.svg
	doc = new jsPDF("p", "mm", "a4")

	if (typeof doc == "undefined")
		alert("Error within PDF generation. Your browser does not seem to support this operation. If possible, please try another one.")

	var event_name = "Preisliste " + $("#event_name").val() || "Event Name"
	doc.setFontSize(28)
	doc.text(25, 27, event_name)

	var prices = ""

	$(".drink_line").each(function (i, obj) {
		if ($(obj).find(".checked_field").attr("checked") == "checked")
			prices = prices + $(obj).find(".name_field").val() + "\t" + $(obj).find(".price_field").val() + crlf
	})

	doc.setFontSize(14)

	var txt = prices
	var lines = doc.splitTextToSize(txt, 155)
	doc.text(25, 60.46, lines)

	/*
	 if (photo) {
	 doc.addPage();
	 doc.addImage(photo, 'JPEG', 15, 40, 180, 160);
	 }
	 */
}

function updatePane () {
	generatePricelists()

	if (typeof doc !== "undefined") {
		var string = doc.output("datauristring")
		$(".preview-pane").show()
		$(".preview-pane").attr("src", string)
	}
}

function savePDF () {
	generatePricelists()
	doc.save("preisliste.pdf")
}

function calculate50 (price) {
	if (price < 1.0) {
		return ( price + 0.5 )
	} else {
		return ( price * 1.5 )
	}
}

function roundup50 (price) {
	return ( ( Math.ceil(( price * 100 ) / 50) * 50 ) / 100 )
}

let $addCustomDrinkButton = null;
let $drinkListWrapper = null;
let $form = null;
let $clearLocalStorageButton = null;

function addCustomDrink (event) {
	event.preventDefault();
	event.stopPropagation();

	const drinkName = $("#custom_drink_name").val()
	const drinkPrice = $("#custom_drink_price").val()

	pricelist.push({
		drink: drinkName,
		price: drinkPrice
	})

	renderPriceItems()
	savePricelist(pricelist)
}

function renderPriceItems () {
	$drinkListWrapper.empty();

	for (let i = 0; i < pricelist.length; i++) {
		const drink = pricelist[i];

		const minPrice = roundup50(calculate50(drink.price))
		const currentPrice = drink.userPrice || minPrice;

		$drinkListWrapper.append(`
			<div class="form-group col-lg-12 drink_line" style="margin-bottom:5px;" data-index="${i}">
				<div class="checkbox col-lg-12">
				    <div class="col-md-3">
				        <input checked class="checked_field" name="pricelist" type="checkbox" />
                        <input type="text" class="name_field" value="${drink.drink}" />
					</div>

					<div class="input-group col-md-2 offset-md-4">
						<div class="input-group-addon">EUR</div>

						<input type="number" class="price_field"
							min="${minPrice.toFixed(2)}"
							value="${currentPrice.toFixed(2)}"
							step="0.50"
							placeholder="Preis"
						/>

				  	    <div class="input-group-addon">(${calculate50(drink.price).toFixed(2)})</div>
				  </div>
				</div>
			</div>
		`)
	}
}

function savePricelist (pricelist) {
	localStorage.setItem("pricelist", JSON.stringify(pricelist))
}

function initLocalStorage () {
	if (localStorage.getItem("pricelist")) {
		pricelist = JSON.parse(localStorage.getItem("pricelist"))
	} else {
		localStorage.setItem("pricelist", JSON.stringify(pricelist))
	}
}

$(document).ready(function () {
	initLocalStorage();

	$drinkListWrapper = $("#drinks");
	$addCustomDrinkButton = $("#addCustomDrink");
	$form = $("#drinkForm");
	$clearLocalStorageButton = $("#clearLocalStorage");

	$addCustomDrinkButton.on("click", addCustomDrink);
	$clearLocalStorageButton.on("click", function () {
		localStorage.removeItem("pricelist");
		window.location.reload();
	});

	renderPriceItems();

	// get every input element
	$form.find(".drink_line input").on("keydown", function () {
		// get value of every price item and save it to pricelist
		$(".drink_line").each(function (i, obj) {
			const $line = $(obj);
			const index = $line.data("index");

			const checked = $line.find(".checked_field").is(":checked")
			const drinkName = $line.find(".name_field").val();
			const userPrice = $line.find(".price_field").val()

			pricelist[index].userPrice = parseFloat(userPrice)
			pricelist[index].drink = drinkName
			pricelist[index].checked = checked
		})

		savePricelist(pricelist)
	})
})


var photo

function getPhoto (evt) {
	var file = evt.target.files[0]
	var reader = new FileReader()

	//if (!file.type.match('image.')) {
	//return;
	//}

	var reader = new FileReader()

	reader.onload = ( function (theFile) {
		return function (e) {
			photo = e.target.result
			//updatePane();
		}
	} )(file)

	reader.readAsDataURL(file)
}
