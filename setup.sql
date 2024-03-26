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
CREATE TABLE cart (
cartID VARCHAR(100) NOT NULL,
productID VARCHAR(100) NOT NULL,
quantity BIGINT NOT NULL,
id BIGINT NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;