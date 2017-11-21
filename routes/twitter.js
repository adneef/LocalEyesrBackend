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
    // cut array down to top 8
    let top8Trends = filteredTrends.slice(0, 8)
    res.send(top8Trends)
  }
})


// get related hashtags from client search request
router.get('/related', function(req, res, next) {
  // console.log('req from related: ', req);
  t.get('search/tweets', { q: `${req.query.term}`, count: 200 }, gotData)

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
    const dataArray = []
          for (var k in hashtagWithCount) {
            let hashObj = {hash: k, count: hashtagWithCount[k]}
            dataArray.push(hashObj)
          }
    res.send(dataArray)
  }
})


// most recent tweets about denver
router.get('/denver', function(req, res, next) {
  t.get('search/tweets', { q: 'Denver', count: 200 }, gotData)
  // filter data from twitter API call
  function gotData(err, data, response) {
    let filteredDenver = data.statuses.slice(1, 5).map(item => {
      if (item.entities.hashtags.length === 0) {
        return {
          created_at: item.created_at,
          text: item.text,
          hashtags: 'none'
        }
      }
      let hashtags = item.entities.hashtags[0].text
      return {
        created_at: item.created_at,
        text: item.text,
        hashtags: hashtags
      }
    })
    console.log(filteredDenver);
    res.send(filteredDenver)

  }
})


// most recent tweets about co spring
router.get('/springs', function(req, res, next) {
  t.get('search/tweets', { q: 'Colorado Springs', count: 200 }, gotData)
  // filter data from twitter API call
  function gotData(err, data, response) {
    let filteredSprings = data.statuses.slice(1, 5).map(item => {
      if (item.entities.hashtags.length === 0) {
        return {
          created_at: item.created_at,
          text: item.text,
          hashtags: 'none'
        }
      }
      let hashtags = item.entities.hashtags[0].text
      return {
        created_at: item.created_at,
        text: item.text,
        hashtags: hashtags
      }
    })
    res.send(filteredSprings)
  }
})


// most recent tweets about boulder
router.get('/boulder', function(req, res, next) {
  t.get('search/tweets', { q: 'Boulder, CO', count: 200 }, gotData)
  // filter data from twitter API call
  function gotData(err, data, response) {
    let filteredBoulder = data.statuses.slice(1, 5).map(item => {
      if (item.entities.hashtags.length === 0) {
        return {
          created_at: item.created_at,
          text: item.text,
          hashtags: 'none'
        }
      }
      let hashtags = item.entities.hashtags[0].text
      return {
        created_at: item.created_at,
        text: item.text,
        hashtags: hashtags
      }
    })
    res.send(filteredBoulder)
  }
})

module.exports = router;
