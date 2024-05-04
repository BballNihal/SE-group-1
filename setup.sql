DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS appointments;

CREATE TABLE IF NOT EXISTS products (
    productID TEXT PRIMARY KEY,
    productType TEXT,
    name TEXT,
    price TEXT,
    quantity INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
    cartID TEXT,
    paymentInfo TEXT,
    discountCode TEXT,
    price TEXT,
    orderID TEXT PRIMARY KEY,
    memberID TEXT,
    statusVar TEXT
);


CREATE TABLE appointments(
memberID TEXT,
time TEXT,
Specification TEXT,
appointmentID TEXT NOT NULL,
id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE cart (
cartID TEXT NOT NULL,
productID TEXT NOT NULL,
quantity INTEGER NOT NULL,
id INTEGER PRIMARY KEY AUTOINCREMENT
);
