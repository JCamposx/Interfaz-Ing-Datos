const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_articulos = async () => {
	const articulos = []
	const query = `select * from articulo order by id_articulo`

	const result = await DB.Open(query, [], false)
	result.rows.map(e => {
		const user_schema = {
			id_articulo: e[0],
			descripcion: e[1],
			cod_origen: e[2],
			stock: e[3],
			precio_unitario: e[4],
			id_almacen: e[5]
		}
		articulos.push(user_schema)
	})

	return articulos
}

const obtener_articulo = async (id_art) => {
	const articulo = []
	const query = `select * from articulo where id_articulo = ${id_art}`

	const result = await DB.Open(query, [], false)
	result.rows.map(e => {
		const user_schema = {
			id_articulo: e[0],
			descripcion: e[1],
			cod_origen: e[2],
			stock: e[3],
			precio_unitario: e[4],
			id_almacen: e[5]
		}
		articulo.push(user_schema)
	})

	return articulo[0]
}

router.get('/cotizaciones/ver-editar/:id_cot/editar-articulo/:id_art/:cantidad', async (req, res) => {
	const id_cotizacion = req.params.id_cot
	const id_articulo = req.params.id_art
	const cantidad = req.params.cantidad

	const articulos = await obtener_articulos()
	const articulo = await obtener_articulo(id_articulo)

	res.render('cotizaciones_editar-articulo', {
		id_cotizacion: id_cotizacion,
		cantidad: cantidad,
		articulo: articulo,
		articulos: articulos
	})
})

router.post('/cotizaciones/ver-editar/:id_cot/editar-articulo/:id_art', async (req, res) => {
	const id_cotizacion = req.params.id_cot
	const id_articulo = req.params.id_art

	const cant = req.body.cantidad

	const query = `update cot_art
					set
						cantidad = ${cant}
					where Num_cotizacion = ${id_cotizacion} and id_articulo = ${id_articulo}`
	
	await DB.Open(query, [], true)

	res.redirect(`/cotizaciones/ver-editar/${id_cotizacion}`)
})

////////////////////////////////////////////////////////////////////////////////////////////////////////

const obtener_articulos_por_id = async (busqueda) => {
	const articulos = []
	const query = `select * from articulo where id_articulo like '${busqueda}%'`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_articulo: e[0],
			descripcion: e[1],
			cod_origen: e[2],
			stock: e[3],
			precio_unitario: e[4],
			id_almacen: e[5]
		}
		articulos.push(user_schema)
	})

	return articulos
}

router.post('/cotizaciones/ver-editar/:id_cot/editar-articulo/:id_art/:cantidad/buscar', async (req, res) => {
	const id_cot = req.params.id_cot
	const id_art = req.params.id_art
	const cant = req.params.cantidad

	const busqueda = req.body.busqueda

	if (busqueda == '') {
		res.redirect(`/cotizaciones/ver-editar/${id_cot}/editar-articulo/${id_art}/${cant}`)
	} else {
		res.redirect(`/cotizaciones/ver-editar/${id_cot}/editar-articulo/${id_art}/${cant}/buscar/${busqueda}`)
	}
})

router.get('/cotizaciones/ver-editar/:id_cot/editar-articulo/:id_art/:cantidad/buscar/:id_art_buscar', async (req, res) => {
	const id_cot = req.params.id_cot
	const id_art = req.params.id_art
	const cant = req.params.cantidad
	const busqueda = req.params.id_art_buscar

	const articulo = await obtener_articulo(id_art)
	const articulos = await obtener_articulos_por_id(busqueda)
	console.log('articulo')
	res.render('cotizaciones_editar-articulo', {
		id_cotizacion: id_cot,
		cantidad: cant,
		articulo: articulo,
		articulos: articulos,
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/cotizaciones/ver-editar/:id_cot/editar-articulo/:id_art/:cantidad/mostrar', (req, res) => {
	const id_cot = req.params.id_cot
	const id_art = req.params.id_art
	const cant = req.params.cantidad
	
	res.redirect(`/cotizaciones/ver-editar/${id_cot}/editar-articulo/${id_art}/${cant}`)
})

module.exports = router