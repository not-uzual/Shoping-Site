const express = require('express');

const app = express();
const PORT = 8000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({'message': "Sever is running"})
})

app.listen(PORT, ()=>console.log('server is listening now'));