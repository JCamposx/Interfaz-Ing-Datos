const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_ultimo_id_cot = async () => {
	const cotizacion = []
	const query = `select max(Num_cotizacion) from cotizacion`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_cot: e[0]
		}
		cotizacion.push(user_schema.id_cot)
	})

	return cotizacion[0]
}

const obtener_nros_doc = async () => {
	const nros_doc = []
	const query = `select num_doc_cl from cliente`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			num_doc: e[0]
		}
		nros_doc.push(user_schema.num_doc)
	})

	return nros_doc
}

const obtener_clientes = async () => {
	const clientes = []
	const query = 'select * from cliente'
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			tipo_doc: e[0],
			num_doc: e[1],
			tipo_cliente: e[2],
			nombre: e[3],
			apellido: e[4],
			razon_social: e[5],
			correo: e[6],
			direccion: e[7],
			telefono: e[8],
			id_ase: e[9]
		}
		clientes.push(user_schema)
	})

	return clientes
}

router.get('/cotizaciones/nuevo', async (req, res) => {
	const nueva_id = await obtener_ultimo_id_cot()
	const clientes = await obtener_clientes()

	res.render('cotizaciones_nuevo', {
		id_cotizacion: nueva_id + 1,
		clientes: clientes,
		alerta: 0
	})
})

router.post('/cotizaciones/nuevo/:id_cot', async (req, res) => {
	const id_cotizacion = req.params.id_cot

	const num_doc = req.body.num_doc
	const descripcion = req.body.descripcion
	const condiciones = req.body.condiciones
	const fecha_emision = req.body.fecha_emi
	const fecha_vencimiento = req.body.fecha_ven
	const forma_pago = req.body.forma_pago
	const sucursal = req.body.sucursal

	const nros_doc =  await obtener_nros_doc()

	if (nros_doc.includes(num_doc)) {
		const query = `insert into cotizacion
						values (
							${id_cotizacion},
							upper('${descripcion}'),
							to_date('${fecha_emision} 08:08:08', 'yyyy-mm-dd hh24:mi:ss'),
							to_date('${fecha_vencimiento} 08:08:08', 'yyyy-mm-dd hh24:mi:ss'),
							upper('${condiciones}'),
							${forma_pago},
							${sucursal},
							null,
							'${num_doc}'
						)`

		console.log(query)
		
		await DB.Open(query, [], true)

		res.redirect(`/cotizaciones/ver-editar/${id_cotizacion}`)

	} else {
		const clientes = await obtener_clientes()

		res.render('cotizaciones_nuevo', {
			id_cotizacion: id_cotizacion,
			clientes: clientes,
			alerta: 1
		})
	}
})

/////////////////////////////////////////////////////////////////////////////////////////////////

const obtener_clientes_por_nro_doc = async (busqueda) => {
	const clientes = []
	const query = `select * from cliente where num_doc_cl like '${busqueda}%'`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			tipo_doc: e[0],
			num_doc: e[1],
			tipo_cliente: e[2],
			nombre: e[3],
			apellido: e[4],
			razon_social: e[5],
			correo: e[6],
			direccion: e[7],
			telefono: e[8],
			id_ase: e[9]
		}
		clientes.push(user_schema)
	})

	return clientes
}

router.post('/cotizaciones/nuevo/:id_cot/buscar-cliente', (req, res) => {
	const id_nueva_cot = req.params.id_cot
	const busqueda = req.body.busqueda

	if (busqueda == '') {
		res.redirect(`/cotizaciones/nuevo`)
	} else {
		res.redirect(`/cotizaciones/nuevo/${id_nueva_cot}/buscar-cliente/${busqueda}`)
	}
})

router.get('/cotizaciones/nuevo/:id_cot/buscar-cliente/:num_doc_buscar', async (req, res) => {
	const id_nueva_cot = req.params.id_cot
	const busqueda = req.params.num_doc_buscar
	const clientes = await obtener_clientes_por_nro_doc(busqueda)

	res.render('cotizaciones_nuevo', {
		id_cotizacion: id_nueva_cot,
		clientes: clientes,
		alerta: 0
	})
})

module.exports = router