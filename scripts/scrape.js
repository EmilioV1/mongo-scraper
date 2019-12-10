//Scrape script
//=============

//Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {

    request("https://www.nytimes.com", function (err, res, body) {

        var $ = cheerio.load(body);

        var articles = [];

        $(".css-8atqhb").each(function (i, element) {
<<<<<<< HEAD
=======

            var head = $(this).children(".css-n2blzn").text().trim();
            var sum = $(this).children(".css-1pfq5u").text().trim();
>>>>>>> aabe1410ead2e5592f7dae8ec4b84e61630f4d0b

            var head = $("h2", element).text().trim();
            var sum = $("p", element).text().trim();
            console.log("h2", head, "p", sum);
            if (head && sum) {
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;