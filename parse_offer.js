const rp = require('request-promise');
const $ = require('cheerio');

module.exports = {
	parseOffer: parseOffer
};

function parseOffer(allSteals, steal) {
	let offerP = steal.price;
	var options = {
		url: 'https://www.ceneo.pl/' + steal.url + ';0280-0.htm',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
		}
	};

	rp(options)
		.then(function (html) {
			let offers = $('.wrapper .product-offer-2020', html);
			let exShop = false;
			let ceneoErr = false;
			let sumPrice = 0;
			//console.log(offers.length);
			for (let i = 0; i < offers.length; i++) {
				let price = parseInt($('.price > span', offers[i]).text());
				sumPrice += price;
				let shop = $('.store-logo > img', offers[i]).attr('alt');
				//excluded shops(wrong ceneo parsing)
				if (price == offerP && (shop == 'esus-it.pl' || shop == 'dobrebrzmienie.pl' || shop == 'tool4you.pl' || shop == 'gryfkomp.pl' || shop == 'sklep.jukado.eu')) {//sumPriceegro?
					exShop = true;
				}
				else if (price < offerP * 1.1) {
					exShop = false; // list in price descending order
					//console.log(steal.title + " included - not sumPriceegro" );
				}
			}
			//check if price from category and price in offer are equal 
			if (offerP != parseInt($('.price > span', offers[0]).text()))
				ceneoErr = true;

			if (sumPrice / offers.length * 0.63 > offerP && !exShop && !ceneoErr) {
				steal.img = "https:" + $('.js_image-preview > img', html).attr('src');
				//console.log('STEAL!!!,'+ sumPrice/offers.length*0.55);
				console.log(steal);
				allSteals.push(steal);
			}

		})
		.catch(function (err) {

			console.log(err);
		});
}