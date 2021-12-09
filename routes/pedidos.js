const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_pedidos = async () => {
	const pedidos = []
	const query = `select
						p.*,
						c.num_cotizacion,
						c.num_doc_cl
					from pedido p, cotizacion c
					where p.num_pedido = c.num_pedido
					order by p.num_pedido desc`
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

router.get('/pedidos', async (req, res) => {
	const pedidos = await obtener_pedidos()
	
	res.render('pedidos', {
		pedidos: pedidos
	})
})

////////////////////////////////////////////////////////////////////////////////////////////

const obtener_vendedores = async () => {
	const vendedores = []
	const query = 'select * from vendedor'
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_ven: e[0],
			telefono: e[1],
			nombre: e[2],
			apellido: e[3],
			correo: e[4],
			fecha_ingreso: e[5]
		}
		vendedores.push(user_schema)
	})

	return vendedores
}

router.get('/:id_cot/nuevo-pedido/:id_pedido/total/:total', async (req, res) => {
	const id_cot = req.params.id_cot
	const num_pedido = req.params.id_pedido
	const total = req.params.total
	const vendedores = await obtener_vendedores()

	res.render('pedidos_nuevo', {
		id_cot: id_cot,
		num_pedido: num_pedido,
		total: total,
		vendedores: vendedores
	})
})

router.post('/crear-nuevo-pedido', async (req, res) => {
	const id_cot = req.body.id_cot
	const num_pedido = req.body.num_pedido
	const fecha_emi = req.body.fecha_emi
	const fecha_ven = req.body.fecha_ven
	const estado = req.body.estado
	const id_vendedor = req.body.id_vendedor
	const total = req.body.monto_total

	const query = `insert into pedido values (${num_pedido}, to_date('${fecha_emi}', 'yyyy-mm-dd'), to_date('${fecha_ven}', 'yyyy-mm-dd'), ${total}, ${estado}, ${id_vendedor})`

	await DB.Open(query, [], true)

	const query_2 = `update cotizacion set num_pedido = ${num_pedido} where num_cotizacion = ${id_cot}`
	await DB.Open(query_2, [], true)

	res.redirect('/pedidos')
})

module.exports = router