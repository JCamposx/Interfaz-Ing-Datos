const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const obtener_cliente = async (num_doc) => {
	const cliente = []
	const query = `select * from cliente c where c.num_doc_cl = '${num_doc}'`
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
		cliente.push(user_schema)
	})

	return cliente[0]
}

const obtener_asesores = async () => {
	const asesores = []
	const query = 'select * from asesor'
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			id_ase: e[0],
			nombre: e[1],
			apellido: e[2],
			telefono: e[3],
			correo: e[4],
			fecha_ingreso: e[5]
		}
		asesores.push(user_schema)
	})

	return asesores
}

const obtener_nros_doc = async () => {
	const nros_doc = []
	const query = 'select c.num_doc_cl from cliente c'
	const result = await DB.Open(query, [], false)
	
	result.rows.map(e => {
		nros_doc.push(e[0])
	})

	return nros_doc
}

const obtener_ids_asesores = async () => {
	const ids_asesores = []
	const query = 'select a.id_a from asesor a'
	const result = await DB.Open(query, [], false)
	
	result.rows.map(e => {
		ids_asesores.push(e[0])
	})

	return ids_asesores
}

router.get('/clientes/editar/:num_doc', async (req, res) => {
	const num_doc = req.params.num_doc
	const cliente = await obtener_cliente(num_doc)
	const asesores = await obtener_asesores()

	res.render('clientes_editar', {
		num_doc: num_doc,
		cliente: cliente,
		asesores: asesores,
		alerta: 0
	})
})

router.post('/clientes/editar/:nro_doc', async (req, res) => {
	const num_doc_antiguo = req.params.nro_doc
	
	const tipo_doc = req.body.tipo_doc
	const num_doc = req.body.nro_doc
	const tipo_cli = req.body.tipo_cli
	const nombre = req.body.nombre
	const apellido = req.body.apellido
	const razon_social = req.body.razon_social
	const correo = req.body.correo
	const direccion = req.body.direccion
	const telefono = req.body.telefono
	const id_ase = req.body.id_ase

	const lista_nro_doc = await obtener_nros_doc()
	const lista_ids_ase = await obtener_ids_asesores()

	if (lista_nro_doc.includes(num_doc) && num_doc != num_doc_antiguo) {
		const cliente = await obtener_cliente(num_doc_antiguo)
		const asesores = await obtener_asesores()

		res.render('clientes_editar', {
			num_doc: num_doc_antiguo,
			cliente: cliente,
			asesores: asesores,
			alerta: 1
		})
	} else if (!lista_ids_ase.includes(parseInt(id_ase))) {
		const cliente = await obtener_cliente(num_doc_antiguo)
		const asesores = await obtener_asesores()

		res.render('clientes_editar', {
			num_doc: num_doc_antiguo,
			cliente: cliente,
			asesores: asesores,
			alerta: 2
		})
	}
	else {
		let query = ''
		if (tipo_cli == 1) {
			query = `update cliente
					 set
						tipodoc_cl = ${tipo_doc},
						num_doc_cl = '${num_doc}',
						tipo_cliente = ${tipo_cli},
						Nombre_cl = upper('${nombre}'),
						apellido = upper('${apellido}'),
						RazonSocial_cl = null,
						correo_cl = upper('${correo}'),
						Direccion_cl = upper('${direccion}'),
						Telefono_cl = ${telefono},
						id_a = ${id_ase}
					 where num_doc_cl = '${num_doc_antiguo}'`
		} else {
			query = `update cliente
					 set
						tipodoc_cl = ${tipo_doc},
						num_doc_cl = '${num_doc}',
						tipo_cliente = ${tipo_cli},
						Nombre_cl = null,
						apellido = null,
						RazonSocial_cl = upper('${razon_social}'),
						correo_cl = upper('${correo}'),
						Direccion_cl = upper('${direccion}'),
						Telefono_cl = ${telefono},
						id_a = ${id_ase}
					 where num_doc_cl = '${num_doc_antiguo}'`
		}

		await DB.Open(query, [], true)

		res.redirect('/clientes')
	}
})

module.exports = router