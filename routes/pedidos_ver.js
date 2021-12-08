const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_pedido = async (query) => {
	const pedido = []
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			num_pedido: e[0],
			fecha_pedido: e[1],
			estado: e[2],
			id_ven: e[3],
			nro_doc: e[4],
			monto_total: e[5]
		}
		pedido.push(user_schema)
	})

	return pedido[0]
}

const obtener_ped_art = async (query) => {
	const ped_art = []
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			num_pedido: e[0],
			id_art: e[1],
			cant_art: e[2],
			nombre_art: e[3],
			precio_unit: e[4],
			total_art_ped: e[5]
		}
		ped_art.push(user_schema)
	})

	return ped_art
}

router.get('/pedidos/ver/:cod', async (req, res) => {
	const cod_pedido = req.params.cod
	const query = `select
						p.num_pedido,
						p.fecha_pedido,
						p.estado,
						p.id_ven,
						p.nro_doc,
						sum(a.precio_unit * pa.cant_art)
					from pedido p, articulo a, ped_art pa
					where p.num_pedido = pa.num_pedido and pa.num_pedido = ${cod_pedido} and a.id_art = pa.id_art
					group by p.num_pedido, p.fecha_pedido, p.estado, p.id_ven, p.nro_doc`
	
	const pedido = await obtener_pedido(query)
	
	const query_2 = `select
						pa.*,
						a.nombre_art,
						a.precio_unit,
						a.precio_unit * pa.cant_art
					from ped_art pa, articulo a
					where pa.num_pedido = ${cod_pedido} and a.id_art = pa.id_art`
	const ped_art = await obtener_ped_art(query_2)

	console.log(ped_art)

	res.render('pedidos_ver', {
		pedido: pedido,
		ped_art: ped_art
	})
})

module.exports = router