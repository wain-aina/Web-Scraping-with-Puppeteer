const puppeteer = require('puppeteer');
const json2csv = require('json-2-csv');
const fs = require('fs');

(async () => {

const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://books.toscrape.com/catalogue/category/books/womens-fiction_9/index.html');

// Set screen size.
await page.setViewport({width: 1080, height: 1024});

// Get books.
const bookTitles = await page.evaluate(() => {
    const titles = document.querySelectorAll('.product_pod h3 a')
    const booksArray = [];

    for(title of titles){
        let name = title.getAttribute('title');

        let price = document.querySelector('.price_color').innerText;

        let availability = document.querySelector('.availability').innerText;

        booksArray.push({
            book: name,
            price: price,
            availability: availability,
        });
    }

    return booksArray;
})

//console.log(bookTitles);

let options = {
    arrayIndexsAsKeys: false
}

const csv = json2csv.json2csv(bookTitles, options);

fs.writeFileSync('output.csv', csv)

await browser.close();

})();