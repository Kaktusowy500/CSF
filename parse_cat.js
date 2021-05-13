const rp = require('request-promise');
const $ = require('cheerio');
const parseOffer = require('./parse_offer');

class Steal {
	constructor(title, url, price, discount) {
		this.title = title;
		this.url = url;
		this.price = price;
		this.discount = discount;

	}
}

function parseCat(allSteals, ctgUrl, mshops, mdiscount, callback) {
	var options = {
		url: ctgUrl,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
		}
	};

	rp(options)
		.then(function (html) {

			let offers = $('.category-list-body .cat-prod-row', html);
			let nextPage = $('.pagination-top > a', html);
			//console.log('Looking for steals in: ' +options.url);
			// console.log(offers.length);
			for (let i = 0; i < offers.length; i++) {
				let discount = $('.price-discount_label', offers[i]).text();
				let title = $('.cat-prod-row__name > a', offers[i]).text();
				let shopNum = $('.shop-numb', offers[i]).text();
				let url = $('.cat-prod-row__name > a', offers[i]).attr("href");
				let price = $('.value', offers[i]).text();
				discount = discount.replace("-", "");
				discount = discount.replace("%", "");

				if (shopNum) {
					shopNum = shopNum.replace(" sklepach", "");
					shopNum = shopNum.replace("w ", "");
				}
				else {
					shopNum = '1';
				}

				if (discount>= mdiscount && shopNum >= mshops) {
					// candidate for steal
					let steal = new Steal(title, url, price, discount);
					parseOffer.parseOffer(allSteals, steal);

				}
			}
			//recurrent next page browse
			let nextUrl = nextPage.attr("href");
			if (typeof nextUrl !== "undefined") {
				//parse next page
				parseCat(allSteals, 'https://www.ceneo.pl' + nextUrl, mshops, mdiscount, function (steals) { 
					console.log(steals);
				});
			}

			// callback(steals);
		})
		.catch(function (err) {

			if (err.cause.code == "ECONNRESET") {
				console.error('Retry---------------------------------------------------------------------');
				setTimeout(function () {
					parseCat(allSteals, ctgUrl, mshops, mdiscount);
				}, 10000);
			}
			else
				console.log(err);
		});
}

module.exports = parseCat;