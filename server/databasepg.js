const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.PSQL_USER,
  password: process.env.PASSWRD,
  port: process.env.PORT,
  database: process.env.DATABASE
})

pool.connect()
  .then(() => {
    console.log('Successfully connected to DB!');
  })
  .catch(err => {
    console.log(err);
  })


// pool.query('SELECT id as review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness FROM reviews WHERE product_id = ($1)', [productID])
//   .then((reviewRes) => {
//     reviewRes.rows.map((rev) => {
//       pool.query('SELECT id, url FROM review_photos WHERE review_id = ($1)', [rev.review_id])
//         .then((revPhotos) => {
//           rev['photos'] = revPhotos.rows;
//           console.log('rev', rev);
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     })
//   })
//   .catch((err) => {
//     console.log(err);
//   })
  // .finally(() => {
  //   pool.end();
  // })


module.exports = pool;