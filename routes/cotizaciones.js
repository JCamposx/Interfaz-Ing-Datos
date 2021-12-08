const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_cotizaciones = async () => {
	const cotizaciones = []
	const query = `select distinct
						c.*,
						cl.id_a,
						ca.num_version,
						s.nombre_s,
						cal_monto_total(c.num_cotizacion)
					from cotizacion c, sucursal s, cot_art ca, cliente cl
					where c.id_s = s.id_s and c.num_doc_cl = cl.num_doc_cl and ca.num_version is not null
					order by c.Num_cotizacion desc`
						
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_cot: e[0],
			descripcion: e[1],
			fecha_emision: e[2],
			fecha_vencimiento: e[3],
			condiciones: e[4],
			forma_pago: e[5],
			id_suc: e[6],
			num_pedido: e[7],
			num_doc: e[8],
			id_ase: e[9],
			num_version: e[10],
			nombre_sucursal: e[11],
			monto_final: e[12]
		}
		cotizaciones.push(user_schema)
	})

	return cotizaciones
}

router.get('/cotizaciones', async (req, res) => {
	const cotizaciones = await obtener_cotizaciones()

	res.render('cotizaciones', {
		cotizaciones: cotizaciones
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////////

const obtener_cotizaciones_por_id = async (busqueda) => {
	const cotizaciones = []
	const query = `select distinct
						c.*,
						cl.id_a,
						ca.num_version,
						s.nombre_s,
						cal_monto_total(c.num_cotizacion)
					from cotizacion c, sucursal s, cot_art ca, cliente cl
					where c.id_s = s.id_s and c.num_doc_cl = cl.num_doc_cl and ca.num_version is not null and c.num_cotizacion like '${busqueda}%'
					order by c.Num_cotizacion desc`
						
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_cot: e[0],
			descripcion: e[1],
			fecha_emision: e[2],
			fecha_vencimiento: e[3],
			condiciones: e[4],
			forma_pago: e[5],
			id_suc: e[6],
			num_pedido: e[7],
			num_doc: e[8],
			id_ase: e[9],
			num_version: e[10],
			nombre_sucursal: e[11],
			monto_final: e[12]
		}
		cotizaciones.push(user_schema)
	})

	return cotizaciones
}

router.post('/cotizaciones/buscar', async (req, res) => {
	const busqueda = req.body.busqueda

	if (busqueda == '') {
		res.redirect('/cotizaciones')
	} else {
		res.redirect(`/cotizaciones/buscar/${busqueda}`)
	}
})

router.get('/cotizaciones/buscar/:id_cot_buscar', async (req, res) => {
	const busqueda = req.params.id_cot_buscar
	const cotizaciones = await obtener_cotizaciones_por_id(busqueda)

	res.render('cotizaciones', {
		cotizaciones: cotizaciones
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////////

const obtener_pedidos = async () => {
	const pedidos = []
	const query = `select
						p.*,
						c.num_cotizacion,
						c.num_doc_cl
					from pedido p, cotizacion c
					where p.num_pedido = c.num_pedido`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			num_pedido: e[0],
			fecha_emi: e[1],
			fecha_ven: e[2],
			total: e[3],
			estado: e[4],
			id_ven: e[5],
			num_cot: e[6],
			num_doc: e[7]
		}
		pedidos.push(user_schema)
	})

	return pedidos
}

router.get('/cotizaciones/:id_cot/crear-pedido/:total', async (req, res) => {
	const id_cot = req.params.id_cot
	const monto_total = req.params.total

	const pedidos = await obtener_pedidos()
	const id_nuevo_pedido = pedidos.length + 1

	res.redirect(`/${id_cot}/nuevo-pedido/${id_nuevo_pedido}/total/${monto_total}`)
})

module.exports = router