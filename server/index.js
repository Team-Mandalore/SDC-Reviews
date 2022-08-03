const express = require('express');
const app = express();
const client = require('./databasepg.js');

app.use(express.json()); //req.body


app.get('/reviews/:id/list', function (req, res) {
  const prodID = req.params.id;
  const prodPage = req.query.page || 0;
  const prodCount = req.query.count;

  var allReviews = {
    product: prodID,
    page: prodPage,
    count: prodCount,
    results: []
  }

  client.query('select json_agg(res) as results \
    from( \
      select r.id as review_id, r.rating, r.summary, r.recommend, r.response, r.body, to_timestamp(r.date/1000) as date, r.reviewer_name, r.helpfulness, \
      (select json_agg(photos) \
      from ( \
        select id, url from review_photos where review_id = r.id \
      ) photos \
    ) as photos \
    from reviews as r where r.product_id = ($1)) res;', [prodID])
  .then((rev) => {
    allReviews.results = rev.rows[0].results;
    res.send(allReviews);
  })
  .catch((err) => {
    console.log(err);
  })
})


app.get('/reviews/:id/meta', function (req, res) {
  const metaProdID = req.params.id;
  var metaData = {
    product_id: metaProdID,
    ratings: {
      '1': '',
      '2': '',
      '3': '',
      '4': '',
      '5': ''
    },
    recommended: {
      'true': '',
      'false': ''
    },
    characteristics: {

    }
  }

  client.query('SELECT rating, COUNT(rating) AS SELECT rating FROM reviews WHERE product_id = ($1) \
    FROM reviews \
    WHERE product_id = ($1) \
    GROUP BY rating', [metaProdID])
  .then((rat) => {
    console.log(rat.rows);
    res.send(rat.rows);
  })
})


app.listen(5000, () => {
  console.log('Server is listening on port 5000');
})