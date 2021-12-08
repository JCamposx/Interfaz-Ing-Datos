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

const obtener_ids_articulos = async () => {
	const ids = []
	const query = `select
						a.id_articulo
					from articulo a`

	const result = await DB.Open(query, [], false)
	result.rows.map(e => {
		const user_schema = {
			id_articulo: e[0]
		}
		ids.push(user_schema.id_articulo)
	})

	return ids
}

const obtener_cot_art = async (id_cot) => {
	const ids = []
	const query = `select
						ca.id_articulo
					from cot_art ca
					where ca.num_cotizacion = ${id_cot}`

	const result = await DB.Open(query, [], false)
	result.rows.map(e => {
		const user_schema = {
			id_articulo: e[0]
		}
		ids.push(user_schema.id_articulo)
	})

	return ids
}

const obtener_num_version = async (id_cot) => {
	const num_version = []
	const query = `select distinct
						max(ca.num_version)
					from cot_art ca
					where ca.num_cotizacion = ${id_cot}`

	const result = await DB.Open(query, [], false)
	result.rows.map(e => {
		const user_schema = {
			num_version: e[0]
		}
		num_version.push(user_schema.num_version)
	})

	return num_version[0]
}

router.get('/cotizaciones/ver-editar/:id_cot/agregar-articulo', async (req, res) => {
	const id_cotizacion = req.params.id_cot
	const articulos = await obtener_articulos()

	res.render('cotizaciones_agregar-articulo', {
		id_cotizacion: id_cotizacion,
		articulos: articulos,
		alerta: 0
	})
})

router.post('/cotizaciones/ver-editar/:id_cot/agregar-articulo', async (req, res) => {
	const id_cotizacion = req.params.id_cot

	const id_articulo = req.body.id_articulo
	const cantidad = req.body.cantidad

	const lista_ids_articulos = await obtener_ids_articulos()
	const lista_cot_art = await obtener_cot_art(id_cotizacion)

	const num_version = await obtener_num_version(id_cotizacion)


	
	if (lista_cot_art.includes(parseInt(id_articulo))) {
		const query = `update cot_art
						set cantidad = cantidad + ${cantidad}
						where num_cotizacion = ${id_cotizacion} and id_articulo = ${id_articulo} and num_version = ${num_version}`

		await DB.Open(query, [], true)

		res.redirect(`/cotizaciones/ver-editar/${id_cotizacion}`)
	} else if (!lista_ids_articulos.includes(parseInt(id_articulo))) {
		const articulos = await obtener_articulos()

		res.render('cotizaciones_agregar-articulo', {
			id_cotizacion: id_cotizacion,
			articulos: articulos,
			alerta: 2
		})
	} else {

		const query = `insert into cot_art
						values (${cantidad}, ${num_version}, ${id_cotizacion}, ${id_articulo})`
		
		await DB.Open(query, [], true)

		res.redirect(`/cotizaciones/ver-editar/${id_cotizacion}`)
	}
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

router.post('/cotizaciones/ver-editar/:id_cot/agregar-articulo/buscar', async (req, res) => {
	const id_cot = req.params.id_cot
	const busqueda = req.body.busqueda

	if (busqueda == '') {
		res.redirect(`/cotizaciones/ver-editar/${id_cot}/agregar-articulo`)
	} else {
		res.redirect(`/cotizaciones/ver-editar/${id_cot}/agregar-articulo/buscar/${busqueda}`)
	}
})

router.get('/cotizaciones/ver-editar/:id_cot/agregar-articulo/buscar/:id_art_buscar', async (req, res) => {
	const id_cot = req.params.id_cot
	const busqueda = req.params.id_art_buscar
	const articulos = await obtener_articulos_por_id(busqueda)

	res.render('cotizaciones_agregar-articulo', {
		id_cotizacion: id_cot,
		articulos: articulos,
		alerta: 0
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/cotizaciones/ver-editar/:id_cot/agregar-articulo/mostrar', (req, res) => {
	const id_cot = req.params.id_cot
	
	res.redirect(`/cotizaciones/ver-editar/${id_cot}/agregar-articulo`)
})


module.exports = router