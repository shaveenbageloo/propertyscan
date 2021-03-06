// pl-scraper.js

const axios = require('axios');
const cheerio = require('cheerio');



async function getPropertyDetails(propertyURL) {

    console.log(propertyURL);
    let title, 
    price, 
    address, 
    beds, 
    baths ,
    floorarea ,
    rates,
    levy
    = '';


    await axios.get(propertyURL)
        .then(response => {

            const html = response.data;
            const $ = cheerio.load(html, 
                {normalizeWhitespace: true,
                xmlMode: true}
                );
            // console.log($);
            const marginedIn = $('.marginedIn > div ');

            marginedIn.each(function () {

                title = returnData($(this).find('.titleContainer > h1').text(), ['{NA}']);
                price = returnData($(this).find('.titleContainer > h2 > span').text(), ['R', ' ']);
                address = returnData($(this).find('.address').text(), ['Address:']);

                const resultFeatures = $(this).find('.resultFeatures > .feature').toArray();
                resultFeatures.forEach(element => {
                    const featureItem = element.children[0].data;

                    if (featureItem.toLowerCase().includes('beds')) {
                        beds = returnData(featureItem, ['&nbsp;Beds']);
                    } else
                    if (featureItem.toLowerCase().includes('baths')) {
                        baths = returnData(featureItem, ['&nbsp;Baths']);
                    };
                });


                const mainFeaturesStrong = $(this).find('.mainFeatures > .mainFeature > strong').toArray();
                const mainFeatures = $(this).find('.mainFeatures > .mainFeature').toArray();
                let i = 0;

                mainFeaturesStrong.forEach(element => {

                    const strongText = element.children[0].data;
                    const mainFeatureValue = mainFeatures[i].children[1].data;
                    i++;

                    if (strongText.toLowerCase().includes('floor area')) {
                        floorarea = returnData(mainFeatureValue, ['&nbsp','m&sup2;']);
                    } else

                    if (strongText.toLowerCase().includes('rates')) {
                        rates = returnData(mainFeatureValue, ['&nbsp;R ']);
                    } else
                    if (strongText.toLowerCase().includes('levy')) {
                        levy = returnData(mainFeatureValue, ['&nbsp;R ']);
                    }

                });


                if (title !== undefined) {
                    console.log('Title: ' + title);
                    console.log('Price: ' + price);
                    console.log('Address: ' + address);
                    console.log('Beds: ' + beds);
                    console.log('Baths: ' + baths);
                    console.log('Floor Area: ' + floorarea);
                    console.log('Rates: ' + rates);
                    console.log('Levy: ' + levy);
                }



            });

        })
        .catch(error => {
            console.log(error);
        });









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



