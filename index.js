const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
const json2csv = require('json2csv').Parser;


const movie = "https://www.imdb.com/title/tt0242519/";

const options = {
    uri: movie,
    headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7"
    },
    gzip: true
};

(async () => {
    const imdbData = [];
    const response = await request(options);

    const $ = cheerio.load(response);

    const title = $('div[class="title_wrapper"] > h1').text().trim()
    const rating = $('div[class="ratingValue"] > strong > span').text()
    const summary = $('div[class="plot-text"] > div > div').text().trim()
    const releaseDate = $('a[title="See more release dates"]').text().trim()

    imdbData.push({
        title,
        rating,
        summary,
        releaseDate
    })

    const j2csv = new json2csv();
    const csv = j2csv.parse(imdbData);

    fs.writeFileSync("./imdb.csv", csv, "utf-8");
})()