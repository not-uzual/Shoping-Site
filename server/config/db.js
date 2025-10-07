const mongoose = require('mongoose')

async function connectDataBase(){
    try {
        await mongoose.connect(process.env.dbURL);
        console.log("[Database Connected]");
    } catch (error) {
        console.log("[Database Conncection Failed]");
        console.error(error);
    }
}

module.exports = connectDataBase