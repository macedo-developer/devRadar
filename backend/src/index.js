const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')

const app = express();

mongoose.connect('mongodb+srv://macedo:macedo@cluster0-nylbb.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(cors());
app.use(express.json());
app.use(routes)

app.listen(3333, (err) => {
    if (err) {
        console.log("Ocorreu um erro!");
        return;
    }

    console.log('Servidor rodando na porta 3333');
});