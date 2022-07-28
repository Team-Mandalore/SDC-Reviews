DROP DATABASE IF EXISTS reviewsservice;
CREATE DATABASE reviewsservice;

\c reviewsservice;

CREATE TABLE
  reviews(
    id SERIAL PRIMARY KEY NOT NULL,
    product_id SERIAL NOT NULL,
    rating smallint,
    date bigint NOT NULL,
    summary TEXT,
    body TEXT,
    recommend boolean,
    reported boolean,
    reviewer_name VARCHAR(255),
    reviewer_email VARCHAR(255),
    response TEXT,
    helpfulness INTEGER
);

\copy reviews FROM 'server/data/reviews.csv' DELIMITER ',' CSV HEADER;



CREATE TABLE
  review_photos(
    id SERIAL PRIMARY KEY NOT NULL,
    review_id SERIAL NOT NULL REFERENCES reviews (id),
    url TEXT
);

\copy review_photos FROM 'server/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;



CREATE TABLE
  characteristics(
    id SERIAL PRIMARY KEY NOT NULL,
    product_id SERIAL NOT NULL,
    name VARCHAR(255)
);

\copy characteristics FROM 'server/data/characteristics.csv' DELIMITER ',' CSV HEADER;



CREATE TABLE
  characteristic_reviews(
    id SERIAL PRIMARY KEY NOT NULL,
    characteristic_id SERIAL NOT NULL REFERENCES characteristics (id),
    review_id SERIAL NOT NULL REFERENCES reviews (id),
    value NUMERIC
);

\copy characteristic_reviews FROM 'server/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;



-- sudo -u postgres psql < server/schema.sql