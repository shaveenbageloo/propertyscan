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
            const titleContainer = $('.marginedIn > div ');

            titleContainer.each(function () {
                title = returnData($(this).find('.titleContainer > h1').text());
                price = returnData($(this).find('.titleContainer > h2 > span').text());
                address = returnData($(this).find('.address').text());




                console.log(title);
                console.log(price);
                console.log(address);
                console.log(beds);
                console.log(bath);



            });



        })
        .catch(console.error);





}

function returnData(tagIn) {
    if (tagIn !== '') {
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

getPropertyDetails('https://www.privateproperty.co.za/for-sale/gauteng/east-rand/alberton/meyersdal/rose-garden/kingfisher-crescent-26/T2981902');



