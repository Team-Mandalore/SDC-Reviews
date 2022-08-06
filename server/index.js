const express = require('express');
const app = express();
const pool = require('./databasepg.js');

app.use(express.json());


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

  pool.query('select json_agg(res) as results \
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
    ratings: {},
    recommended: {},
    characteristics: {}
  }

  pool.query('SELECT rating, COUNT(rating) \
  FROM reviews \
  WHERE product_id = ($1) \
  GROUP BY rating', [metaProdID])
  .then((ratingCounts) => {
    pool.query('SELECT recommend, COUNT(recommend) \
    FROM reviews \
    WHERE product_id = ($1) \
    GROUP BY recommend', [metaProdID])
    .then((recommendCount) => {
      pool.query('SELECT c.name, cr.characteristic_id AS id, cr.value \
      FROM characteristics AS c \
      LEFT JOIN characteristic_reviews AS cr ON c.id = cr.characteristic_id \
      WHERE c.product_id = ($1)', [metaProdID])
      .then((chars) => {
        var ratings = {};
        for (var i = 0; i < ratingCounts.rows.length; i++) {
        ratings[ratingCounts.rows[i].rating] = ratingCounts.rows[i].count;
        }
        metaData.ratings = ratings;

        var recommends = {};
        for (var i = 0; i < recommendCount.rows.length; i++) {
          recommends[recommendCount.rows[i].recommend] = recommendCount.rows[i].count;
        }
        metaData.recommended = recommends;

        var characs = {};
        for (var i = 0; i < chars.rows.length; i++) {
          characs[chars.rows[i].name] = {id: chars.rows[i].id, value: chars.rows[i].value}
        }
        metaData.characteristics = characs;

        console.log(metaData);
        res.send(metaData);
      })
      .catch((err) => {
        console.log(err);
      })
    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    console.log(err);
  })
})


app.post('/reviews/:id', function (req, res) {
  const revProdID = req.params.id;
  console.log(revProdID);
})


app.listen(5000, () => {
  console.log('Server is listening on port 5000');
})