DROP DATABASE IF EXISTS reviewsservice;
CREATE DATABASE reviewsservice;

\c reviewsservice;

CREATE TABLE
  reviews(
    -- userID int AUTO_INCREMENT,
    -- username varchar(255) NOT NULL,
    -- PRIMARY KEY (userID),
    id SERIAL PRIMARY KEY NOT NULL,
    product_id SERIAL NOT NULL,
    rating smallint,
    date TIMESTAMPTZ NOT NULL,
    summary TEXT,
    body TEXT,
    recommend boolean,
    reported boolean,
    reviewer_name VARCHAR(255),
    reviewer_email VARCHAR(255),
    response TEXT,
    helpfulness INTEGER
);


-- CREATE TABLE
--   messages(
--     message_id int AUTO_INCREMENT,
--     text varchar(255) NOT NULL,
--     userID int NOT NULL,
--     roomID int NOT NULL,
--     PRIMARY KEY (message_id),
--     FOREIGN KEY (userID) REFERENCES users(userID),
--     FOREIGN KEY (roomID) REFERENCES rooms(roomID)
-- );



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
