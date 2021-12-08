const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_articulos = async () => {
	const articulos = []
	const query = 'select * from articulo'
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_art: e[0],
			descripcion: e[1],
			cod_origen: e[2],
			stock: e[3],
			precio_unit: e[4],
			id_alm: e[5]
		}
		articulos.push(user_schema)
	})

	return articulos
}

router.get('/articulos', async (req, res) => {
	const articulos = await obtener_articulos()
	
	res.render('articulos', {
		articulos: articulos
	})
})

module.exports = router