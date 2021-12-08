const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_articulos_por_id = async (busqueda) => {
	const articulos = []
	const query = `select * from articulo where id_articulo like '${busqueda}%'`
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

router.post('/articulos/buscar', (req, res) => {
	const busqueda = req.body.busqueda

	if (busqueda == '') {
		res.redirect('/articulos')		
	} else {
		res.redirect(`/articulos/buscar/${busqueda}`)
	}
})

router.get('/articulos/buscar/:id_art_buscar', async (req, res) => {
	const busqueda = req.params.id_art_buscar
	const articulos = await obtener_articulos_por_id(busqueda)

	res.render('articulos', {
		articulos: articulos
	})
})

module.exports = router