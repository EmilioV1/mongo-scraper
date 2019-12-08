//Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//Bring in the Headline and Note mongoose models
var Headlines = require("../models/Headline");

module.exports = {
    fetch: function (cb) {
        scrape(function (data) {
            var articles = data;
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }

            Headlines.collection.insertMany(articles, { ordered: false }, function (err, docs) {
                cb(err, docs);
            });
        });
    },
    delete: function (query, cb) {
        Headlines.remove(query, cb);
    },
    get: function (query, cb) {
        Headlines.find(query)
            .sort({
                _id: -1
            })
            .exec(function (err, doc) {
                cb(doc);
            });
    },
    update: function (query, cb) {
        Headlines.update({ _id: query._id }, {
            $set: query
        }, {}, cb);
    }
};