const express = require('express');
const dotenv = require('dotenv')

const connectDataBase = require('./config/db.js')

dotenv.config()

const app = express();
const PORT = 8000

connectDataBase()

app.use(express.json())

app.get('/', (req, res) => {
    res.json({'message': "Server is running"})
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
