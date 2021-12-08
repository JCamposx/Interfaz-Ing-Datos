const express = require('express')
const router = express.Router()
const DB = require('../config/config')

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

router.get('/clientes/nuevo', async (req, res) => {
	const asesores = await obtener_asesores()

	res.render('clientes_nuevo', {
		asesores: asesores,
		alerta: 0
	})
})

router.post('/clientes/nuevo', async (req, res) => {
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

	if (lista_nro_doc.includes(num_doc)) {
		const asesores = await obtener_asesores()

		res.render('clientes_nuevo', {
			asesores: asesores,
			alerta: 1
		})
	} else if (!lista_ids_ase.includes(parseInt(id_ase))) {
		const asesores = await obtener_asesores()

		res.render('clientes_nuevo', {
			asesores: asesores,
			alerta: 2
		})
	} else {
		let query = ''
		if (tipo_cli == 1) {
			query = `insert into cliente
					   values (
						${tipo_doc}, '${num_doc}', ${tipo_cli}, upper('${nombre}'), upper('${apellido}'), null, upper('${correo}'), upper('${direccion}'), ${telefono}, ${id_ase}
						)`
		} else {
			query = `insert into cliente
					   values (
						${tipo_doc}, '${num_doc}', ${tipo_cli}, null, null, upper('${razon_social}'), upper('${correo}'), upper('${direccion}'), ${telefono}, ${id_ase}
						)`
		}

		await DB.Open(query, [], true)
		
		res.redirect('/clientes')
	}
})

module.exports = router