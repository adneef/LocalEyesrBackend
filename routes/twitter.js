var express = require('express')
var router = express.Router()
const Twit = require('twit')
const t = new Twit({
  consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
  consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
  access_token: `${process.env.TWITTER_ACCESS_TOKEN}`,
  access_token_secret: `${process.env.TWITTER_ACCESS_SECRET}`
})


// return json object of top twitter trends in colorado
router.get('/trends', function(req, res, next) {
  let filteredTrends = []


  t.get('trends/place', { id: 2391279, count: 10 }, gotData)

  // filter data from twitter API call
  function gotData(err, data, response) {
    // TRENDS BY LOCATION, ORGANIZED BY POPULARITY
    const trends = data[0].trends.map(item => item.name)
    const trendsWithVolume = data[0].trends.filter(item => {
      if (item.tweet_volume) {
        filteredTrends.push({
          name: item.name,
          tweets: item.tweet_volume
        })
      }
    })
    // sort objects in arrary by tweet volume
    let sort_by = function(field, reverse, primer){
      let key = primer ?
        function(x) {return primer(x[field])} :
        function(x) {return x[field]};
      reverse = -1
      return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      }
    }
    filteredTrends.sort(sort_by('tweets'))
    // console.log(filteredTrends)
    res.send(filteredTrends)
  }
})

// get related hashtags from client search request
router.get('/related', function(req, res, next) {
  console.log('hello from related routes');
  // console.log('req from related: ', req);
  t.get('search/tweets', { q: 'sunday', count: 200 }, gotData)

  // filter data from twitter API call
  function gotData(err, data, response) {
    // get just hashtags
    const relatedHashtags = data.statuses.map(item => item.entities.hashtags)
    // remove empty arrays from data
    const filteredHashtags = relatedHashtags.filter(item => {
      if (item.length > 0) {
        return item
      }
    })
    // remove other data entities
    const justHashtags = []
    const hashtagTextOnly = filteredHashtags.map(item => {
      for (var i = 0; i < item.length; i++) {
        justHashtags.push(item[i].text)
      }
    })
    justHashtags.sort()
    // group the same hashtag together and keep track of occurrence
    const hashtagWithCount = justHashtags.reduce(function (acc, curr) {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
      return acc;
    }, {});

    console.log(hashtagWithCount);
    res.send(hashtagWithCount)
  }


})

module.exports = router;
