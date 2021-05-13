# Ceneo Steals Finder
A NodeJS web scraper which looks for deals on Ceneo and prepares website with them.

## Table of contents
* [General info](#general-info)
* [Dependencies](#dependencies)
* [Setup](#setup)
* [Screenshots](#screenshots)
* [Status](#status)


## General info
This web-scraper was made to get familiar with Node.js and check if it is possible to find any deals by Ceneo scraping. It looks for offers marked as bargain in defined categories within given filters. Next it parses percent of discount, number of shops offering paticular product and other parameters. Basing on scraped data it rejects some offers with wrong parsed prices, these which were probably marked as bargain by mistake or which are offered by blacklisted shops. Recent deals are presented on website which is hosted on a localhost server. The whole process is looped so website is updated with new deals. In general, it works quite decent, it can find some interesting bargains but many of "deals" are Ceneo's mistakes caused by incorrect product grouping. Their bots sometimes also have some problems with scraping shops' websites - the goods are unavalaible or price is diffrent from the one shown on Ceneo. Unfortunately these issues are quite hard to eliminate. This program was made for learning purposes, please do not use it for continous scraping. In general, websites do not like traffic generated by bots and scraping may be illegal. 

## Dependencies
- Node.js (I have used v14.15.1)
- cheerio (1.0.0)
- express (4.17.1)
- request-promise (4.2.4)

Packages' versions are provided for the record - program should work with the latest ones too.
All dependencies can be also find in package.json file.  

## Setup
To run this program of course nodeJS and all dependencies are required. Categories with filters should be defined in params.json file, in list. Example scraping filter: `{"cat":"Monitory","minp":50,"maxp":400,"mshops":4,"mdiscount":40}`. 
Necessary parameters:
- category (cat)
- minimum price (minp)
- maximum price (maxp)
- minimum number of shops offering certain product (mshops)
- minimum discout percent (mdiscount)

When everything is prepared, simply type `node main` in terminal. It will scrape and add new deals to steals.json, it will also add new code with deals to index.html in html folder. The website with offers will be avalaible on `http://localhost:3000`.

## Screenshots
Simple website provided by program to make browsing deals easy:
![website](Screenshots/ss1.png)

## Status
Finished
