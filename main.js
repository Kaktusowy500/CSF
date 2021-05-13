const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const express = require('express');
const parseCat = require('./parse_cat');

function loop() {
	// parse categories their parameters, prepare url for scraping
	const file = fs.readFileSync('params.json', 'utf8');
	let categories = JSON.parse(file); //read params
	console.log(categories.length);
	let allSteals = [];
	for (let i = 0; i < categories.length; i++) {
		let ctg = categories[i];
		let url = 'https://www.ceneo.pl/' + ctg.cat + ';0191;m' + ctg.minp + ';n' + ctg.maxp + ';discount;0112-0.htm'
		// parse category, with given filter
		parseCat(allSteals, url, ctg.mshops, ctg.mdiscount, function (steals) { //look in category
			console.log('Looking for steals in: ' + ctg.cat);
			console.log(steals);
		});
	}
	setTimeout(parseArr, 120000, allSteals);
}

// check if steal is new, add to steals list
function parseArr(allSteals) {
	let toShow = [];//new steals
	console.log('Analyzing steals');
	let prevSteals = JSON.parse(fs.readFileSync('steals.json', 'utf8'));
	allSteals.forEach((nEl) => {
		let found = false;
		prevSteals.forEach((pEl) => {
			if (pEl.url == nEl.url && pEl.price == nEl.price)
				found = true;
		});
		if (!found)
			toShow.push(nEl);
	});
	if (toShow.length > 0) {
		console.log('--------Found new steals------------------------------');
		console.log(toShow);
		console.log('------------------------------------------------------');
		prevSteals = prevSteals.concat(toShow);
		fs.writeFileSync('steals.json', JSON.stringify(prevSteals), 'utf8');
		let html = prepHtml(toShow);
		fs.writeFileSync('./html/index.html', html, 'utf8');
		server(html, false);
		console.log("Server updated");
		//console.log(allSteals);
	}
	else {
		console.log("No new steals");

	}
	setTimeout(loop, 1200000);
}

// prepare html from new steals data, update server 
function prepHtml(steals) {
	let lines = fs.readFileSync('./html/index.html', 'utf8').split('<span></span>');
	//console.log("Lines: " + lines.length);
	let outHtml = lines[0] + "<span></span>";
	for (let i = 0; i < steals.length; i++) {
		let steal = steals[i];
		let offer = "<a href = 'https://www.ceneo.pl" + steal.url + "'><div class = 'offer'><div class = 'offer-text'><h4>" + steal.title + "</h4>Cena teraz: " + steal.price;
		offer += "zł <br/><br/> Obnizka: <span style = 'color:red;'>" + steal.discount + "%</span><br/></div><div class='img'><img src='" + steal.img + "'/></div><div style='clear:both;'></div></div></a><span></span>";
		outHtml += offer;
	}
	for (let j = 1; j < lines.length - 1; j++) {
		outHtml += lines[j] + "<span></span>";
	}
	outHtml += lines[lines.length - 1];
	return outHtml;
}

function server(html, forFirst) {

	app.use(express.static('html'));

	app.get('/', function (req, res) {
		console.log("Got a GET request for the homepage");
		res.send(html);
	});
	if (forFirst)
		app.listen(3000);
}


// start server, load previous html
var app = express();
server(fs.readFileSync('./html/index.html', 'utf8'), true);
console.log("Server started");
loop();
