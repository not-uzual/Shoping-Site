const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const connectDataBase = require('./config/db')
const authRouter = require('./routes/auth.routes')

dotenv.config()

const app = express();
const PORT = 8000

connectDataBase()

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({ message: "Server is running" })
    
})

app.use('/user', authRouter)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
