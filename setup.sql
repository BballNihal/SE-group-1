cartCREATE DATABASE IF NOT EXISTS SHOP;
USE SHOP;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
CREATE TABLE products(
nameVar varchar(64),
descriptionVar varchar(64),
manufacturer varchar(64),
price float,
premiumStatus bit,
availability bit,
productID varchar(17),
id int PRIMARY KEY AUTO_INCREMENT
);
CREATE TABLE orders(
cartID VARCHAR(100) NOT NULL,
paymeentInfo varchar(17),
discountCode float,
price float,
orderID VARCHAR(100) NOT NULL,
memberID VARCHAR(100),
status VARCHAR(100),
id int PRIMARY KEY AUTO_INCREMENT
);
CREATE TABLE appointments(
memberID VARCHAR(100),
time VARCHAR(100),
Specification varchar(100),
id int PRIMARY KEY AUTO_INCREMENT
);
CREATE TABLE cart (
cartID VARCHAR(100) NOT NULL,
productID VARCHAR(100) NOT NULL,
quantity BIGINT NOT NULL,
<<<<<<< HEAD
=======
memberID VARCHAR(100),
>>>>>>> 8555c4155ad262e9e8e515ae80091eed18fab276
id BIGINT NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;