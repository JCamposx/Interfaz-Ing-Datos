const express = require('express')
const morgan = require('morgan')
const route = require('../routes/routes')

const PORT = process.env.PORT
const app = express()

app.use(express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))
app.use(morgan('dev'))
app.use(route)

app.set('view engine', 'ejs')

app.listen(PORT, () => {
	console.log(`El servidor se ha iniciado correctamente en el puerto ${PORT}`)
})