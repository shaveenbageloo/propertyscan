// pl-scraper.js

const axios = require('axios');
const cheerio = require('cheerio');



async function getPropertyDetails(propertyURL) {

    console.log(propertyURL);
    let title, price, address, beds, bath = '';


    await axios.get(propertyURL)
        .then(response => {

            const html = response.data;
            const $ = cheerio.load(html);
            // console.log($);
            const titleContainer = $('.marginedIn > div ');


            titleContainer.each(function () {

                title = returnData($(this).find('.titleContainer > h1').text(), ['{NA}']);
                price = returnData($(this).find('.titleContainer > h2 > span').text(), ['R', ' ']);
                address = returnData($(this).find('.address').text(), ['Address:']);

                if (title !== undefined) {
                    console.log('Title: ' + title);
                    console.log('Price: ' + price);
                    console.log('Address: ' + address);
                }

            });

        })
        .catch(console.error);





}

function returnData(tagIn, removeStrings) {
    if (tagIn !== '' && tagIn !== undefined) {

        removeStrings.forEach(element => {
            tagIn = tagIn.replace(element, '');
        });

        return tagIn;

    }

}


async function getPropertyPage(domain, midurl, pageNumber) {

    let listofProperties = [];
    const url = domain + midurl + pageNumber;
    console.log(url);

    await axios.get(url)
        .then(response => {

            const html = response.data;
            const $ = cheerio.load(html);
            const statsTable = $('.resultsItemsContainer > a ');

            statsTable.each(function () {

                const href = domain + ($(this).attr('href'));
                listofProperties.push(href);
                console.log(href);

            });
        })
        .catch(console.error);

    return listofProperties;

}

const allProperties = [];

//const resultsFromMainPage = getPropertyPage('https://www.privateproperty.co.za/', 'for-sale/gauteng/east-rand/alberton/meyersdal/787?page=', 2);

console.log('Starting to run program...');

getPropertyDetails('https://www.privateproperty.co.za/for-sale/gauteng/east-rand/alberton/meyersdal/00-stellenzicht/00-kingfisher-crescent/T2692661');



