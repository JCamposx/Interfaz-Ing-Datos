const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_cotizacion_art = async (id_cot) => {
	const cot_art = []
	const query = `select distinct
						c.*,
						a.*,
						ca.cantidad,
						ca.num_version,
						cal_monto(ca.id_articulo, c.Num_cotizacion)
					from cotizacion c, cot_art ca, articulo a
					where c.Num_cotizacion = ca.Num_cotizacion and ca.Num_cotizacion = ${id_cot} and a.id_articulo = ca.id_articulo
					order by c.Num_cotizacion`

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
			id_art: e[9],
			descripcion_art: e[10],
			cod_origen: e[11],
			stock: e[12],
			precio_unit: e[13],
			id_almacen: e[14],
			cantidad: e[15],
			num_version: e[16],
			monto: e[17]
		}
		cot_art.push(user_schema)
	})

	return cot_art
}

const obtener_cotizacion = async (id_cot) => {
	const cotizacion = []
	const query = `select
						c.*,
						cl.id_a,
						cal_monto_total(${id_cot})
					from cotizacion c, cliente cl
					where c.num_cotizacion = ${id_cot} and c.num_doc_cl = cl.num_doc_cl`

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
			monto_total: e[10]
		}
		cotizacion.push(user_schema)
	})

	return cotizacion[0]
}

router.get('/cotizaciones/ver-editar/:id_cot', async (req, res) => {
	const id_cotizacion = req.params.id_cot

	const cot_art = await obtener_cotizacion_art(id_cotizacion)
	const cotizacion = await obtener_cotizacion(id_cotizacion)

	console.log(cotizacion)

	res.render('cotizaciones_ver-editar', {
		cotizacion: cotizacion,
		cot_art: cot_art
	})
})

router.post('/cotizaciones/editar/:id_cot', async (req, res) => {
	const id_cotizacion = req.params.id_cot

	const descripcion = req.body.descripcion
	const fecha_emision = req.body.fecha_emi
	const fecha_vencimiento = req.body.fecha_ven
	const condiciones = req.body.condiciones
	const forma_pago = req.body.forma_pago
	const id_suc = req.body.sucursal
	let num_pedido = req.body.num_pedido
	const num_doc = req.body.num_doc

	if (num_pedido == '-') {
		num_pedido = null
	}

	const query = `update cotizacion
					set
						Descripción_c = upper('${descripcion}'),
						Fecha_emision = to_date('${fecha_emision} 08:08:08', 'yyyy-mm-dd hh24:mi:ss'),
						fecha_vencimiento = to_date('${fecha_vencimiento} 08:08:08', 'yyyy-mm-dd hh24:mi:ss'),
						Condiciones_c = upper('${condiciones}'),
						FormaPago_c = ${forma_pago},
						id_s = ${id_suc},
						Num_pedido = ${num_pedido},
						num_doc_cl = '${num_doc}'
					where Num_cotizacion = ${id_cotizacion}`
	
	await DB.Open(query, [], true)

	res.redirect('/cotizaciones')
})

module.exports = router