//configuration file for the server information
const config = {
    db:{
        host: "localhost",
        user: "root",
        database:"CAL",
        password: "sql65536!#HYUJ"
    },
    server:{
        hostName: "localhost",
        port: 8000
    },
    sqliteDB: {
        path: "./database.db",//for the program in the root (or same directory as the database file)
        pathOne: "../database.db",//for cart, search and any program that is not in the root and have to go up one directory
        pathTwo: "../../database.db"//for search and any program that is not in the root and have to go up two directories
    }
    
};
module.exports = config;