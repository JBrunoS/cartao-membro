const express = require('express')
const cors = require('cors')
const routes = require('./routes');
const path = require('path')

require('dotenv').config()

const app = express();

app.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes);

app.listen(process.env.PORT || 3333);