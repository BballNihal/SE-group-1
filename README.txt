The SQL code to initizalize the database is here:
(use carefully, it will delete the previous data)

CREATE DATABASE IF NOT EXISTS SHOP;
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


____________________________
example of added product:
INSERT INTO products(nameVar,descriptionVar,manufacturer,price,premiumStatus,availability,productID) VALUES("GASOLINE","gas for your truck","Gasco",278.2,1,1,"P1234567890123456");
____________________________
check what is in the database with 
select * from cart;
or 
select * from products;
(in another file from the one that creates the databases)