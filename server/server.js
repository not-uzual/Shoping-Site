const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const connectDataBase = require('./config/db')
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const productRouter = require('./routes/product.routes')
const cartRouter = require('./routes/cart.routes')

dotenv.config()

const app = express();
const PORT = 8000

connectDataBase()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))


app.get('/', (req, res) => {
    res.json({ message: "Server is running" })  
    
})

app.use('/user', authRouter)
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
