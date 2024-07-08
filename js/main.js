const LEFT_PAGE_OFFSET_X = 25
const LEFT_PAGE_OFFSET_Y = 30

let doc
let photo

let $addCustomDrinkButton = null
let $drinkListWrapper = null
let $form = null
let $clearLocalStorageButton = null
let $previewPane = null

function drawDottedLine (doc, x, y, length) {
	for (let i = 0; i < length; i += 2) {
		doc.setFillColor(0, 0, 0)
		doc.setLineWidth(0)
		doc.ellipse(x + i, y, 0.25, 0.25)
	}
}

function generatePricelist () {
	// letter layout according to http://upload.wikimedia.org/wikipedia/commons/6/64/DIN_5008%2C_Form_A.svg
	doc = new jsPDF("p", "mm", "a4")

	if (typeof doc == "undefined") {
		window.alert("Error within PDF generation. Your browser does not seem to support this operation. If possible, please try another one.")
	}

	let event_name = "Preisliste " + $("#event_name").val() || "Event Name"
	doc.setFont("helvetica", "bold")
	doc.setFontSize(28)
	doc.text(event_name, LEFT_PAGE_OFFSET_X, LEFT_PAGE_OFFSET_Y)

	doc.setFont("helvetica", "normal")
	doc.setFontSize(14)

	$(".drink_line").each(function (i, obj) {
		if ($(obj).find(".checked_field").attr("checked") == "checked") {
			const name = $(obj).find(".name_field").val()
			const price = Number.parseFloat($(obj).find(".price_field").val()).toFixed(2).replace(".", ",")

			doc.setFont("helvetica", "bold")
			doc.text(
				doc.splitTextToSize(name, 155),
				LEFT_PAGE_OFFSET_X,
				LEFT_PAGE_OFFSET_Y + 30 + i * (8)
			)

			doc.setFont("courier", "normal")
			doc.text(
				(price + " €"),
				LEFT_PAGE_OFFSET_X + 140,
				LEFT_PAGE_OFFSET_Y + 30 + i * (8),
				{
					"align": "right"
				}
			)

			drawDottedLine(doc, LEFT_PAGE_OFFSET_X, LEFT_PAGE_OFFSET_Y + 26 + i * (8) + 5, 160)
		}
	})

	/*
	 if (photo) {
	 doc.addPage();
	 doc.addImage(photo, 'JPEG', 15, 40, 180, 160);
	 }
	 */
}

function updatePane () {
	generatePricelist()

	if (doc) {
		const string = doc.output("datauristring")

		$previewPane.show()
		$previewPane.attr("src", string)

		console.log("Updated preview pane")
	}
}

function savePDF () {
	generatePricelist()
	doc.save("preisliste.pdf")
}

function calculate50 (price) {
	if (price < 1.0) {
		return ( price + 0.5 )
	}

	return ( price * 1.5 )
}

function roundup50 (price) {
	return ( ( Math.ceil(( price * 100 ) / 50) * 50 ) / 100 )
}

function addCustomDrink (event) {
	event.preventDefault()
	event.stopPropagation()

	const newDrinkName = $("#custom_drink_name").val()
	const newDrinkPrice = Number.parseFloat($("#custom_drink_price").val().toString().replace(",", "."))

	if (!newDrinkName || !newDrinkPrice || Number.isNaN(newDrinkPrice)) {
		console.error("No name or price given")
		return
	}

	console.log("Adding custom drink", newDrinkName, newDrinkPrice, )

	pricelist.push({
		drink: newDrinkName,
		price: newDrinkPrice
	})

	renderPriceItems()
	savePricelist(pricelist)
	updatePane()
}

function renderPriceItems () {
	$drinkListWrapper.empty()

	for (let i = 0; i < pricelist.length; i++) {
		const drink = pricelist[i]

		const minPrice = roundup50(calculate50(drink.price))
		const currentPrice = drink.userPrice || minPrice

		$drinkListWrapper.append(`
			<div class="form-group col-lg-12 drink_line" style="margin-bottom:5px;" data-index="${ i }">
				<div class="checkbox col-lg-12">
				    <div class="col-md-3">
				        <input checked class="checked_field" name="pricelist" type="checkbox" />
                        <input type="text" class="name_field" value="${ drink.drink }" />
					</div>

					<div class="input-group col-md-2 offset-md-4">
						<div class="input-group-addon">EUR</div>

						<input type="number" class="price_field"
							min="${ minPrice.toFixed(2) }"
							value="${ currentPrice.toFixed(2) }"
							step="0.50"
							placeholder="Preis"
						/>

				  	    <div class="input-group-addon">(${ calculate50(drink.price).toFixed(2) })</div>
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

function initVariables () {
	$drinkListWrapper = $("#drinks")
	$addCustomDrinkButton = $("#addCustomDrink")
	$form = $("#drinkForm")
	$clearLocalStorageButton = $("#clearLocalStorage")
	$previewPane = $(".preview-pane")
}

function addListeners () {
	$addCustomDrinkButton.on("click", addCustomDrink)

	$clearLocalStorageButton.on("click", function () {
		localStorage.removeItem("pricelist")
		window.location.reload()
	})

	// this listener is triggered when the user changes any input field
	$form.find(".drink_line input").on("change", function () {
		// get value of every price item and save it to pricelist
		$(".drink_line").each(function (i, obj) {
			const $line = $(obj)
			const index = $line.data("index")

			const checked = $line.find(".checked_field").is(":checked")
			const drinkName = $line.find(".name_field").val()
			const userPrice = parseFloat($line.find(".price_field").val())

			pricelist[index].userPrice = userPrice
			pricelist[index].drink = drinkName
			pricelist[index].checked = checked
		})

		savePricelist(pricelist)
		updatePane()
	})
}

$(document).ready(() => {
	initLocalStorage()
	initVariables()

	renderPriceItems()
	updatePane()

	addListeners()
})

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
