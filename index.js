const express = require("express")
const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require("pretty");


var app = express()

app.get("/", function (request, response) {
    response.send("Hello World!")
})

// Function to scrape property attributes
async function scrapeProperty(url) {
    try {
        // Fetch the HTML of the page
        const { data } = await axios.get(url);

        // Load the HTML into cheerio
        const $ = cheerio.load(data, {
            xml: true
        });

        // Extract property details
        const propertyDetails = {};

        // Example: Extract the property title
        propertyDetails.title = $('h1').text().trim();

        const resultFeatures = $(this).find('.resultFeatures > .feature').toArray();


        // Example: Extract the price
        //propertyDetails.price = $('.price').text().trim();
        //propertyDetails.price = $('listing-price-display__price txt-heading-1').text().trim();

        // Extract other attributes as per the structure of the page
        // You might need to inspect the page and adjust the selectors accordingly   
        // propertyDetails.bedrooms = $('span[title="Bedrooms"]').text().trim();
        //propertyDetails.bathrooms = $('span[title="Bathrooms"]').text().trim();
        //propertyDetails.garages = $('span[title="Garages"]').text().trim();

        // Print the extracted details
        console.log(propertyDetails);
    } catch (error) {
        console.error('Error fetching the property details:', error);
    }
}


app.get("/details", function (request, response) {
    console.log('Getting details of property:');
    url = request.query.propertyID;

    // Call the function
    scrapeProperty(url);


    response.send('JSON will be returned here...' + url)
})


app.listen(10000, function () {
    console.log("Started application on port %d", 10000)
});