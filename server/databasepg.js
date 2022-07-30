const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  port: 5432,
  database: "reviewsservice"
})

client.connect()
  .then(() => {
    console.log('Successfully connected!');
  })
  .catch(err => {
    console.log(err);
  })

const productID = 1;
const results = [];

client.query('SELECT id as review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness FROM reviews WHERE product_id = ($1)', [productID])
  .then((reviewRes) => {
    reviewRes.rows.map((rev) => {
      client.query('SELECT id, url FROM review_photos WHERE review_id = ($1)', [rev.review_id])
        .then((revPhotos) => {
          rev['photos'] = revPhotos.rows;
          console.log('rev', rev);
        })
        .catch((err) => {
          console.log(err);
        })
    })
  })
  .catch((err) => {
    console.log(err);
  })
  // .finally(() => {
  //   client.end();
  // })


