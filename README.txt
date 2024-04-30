Type "npm test" to test the code
Edit config.js for server information

example of added product:
INSERT INTO products(nameVar,descriptionVar,manufacturer,price,premiumStatus,availability,productID) VALUES("GASOLINE","gas for your truck","Gasco",278.2,1,1,"P1234567890123456");
____________________________
check what is in the database with 
select * from cart;
or 
select * from products;
(in another file from the one that creates the databases)
____________________________
Use database from subgroup 1
