const express = require('express')
const router = express.Router()
const DB = require('../config/config')

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

router.post('/clientes/buscar', (req, res) => {
	const busqueda = req.body.busqueda

	if (busqueda == '') {
		res.redirect('/clientes')
	} else {
		res.redirect(`/clientes/buscar/${busqueda}`)
	}
})

router.get('/clientes/buscar/:num_doc_buscar', async (req, res) => {
	const busqueda = req.params.num_doc_buscar
	const clientes = await obtener_clientes_por_nro_doc(busqueda)

	res.render('clientes', {
		clientes: clientes
	})
})

module.exports = router