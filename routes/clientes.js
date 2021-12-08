const express = require('express')
const router = express.Router()
const DB = require('../config/config')

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

router.get('/clientes', async (req, res) => {
	const clientes = await obtener_clientes()

	res.render('clientes', {
		clientes: clientes
	})
})

module.exports = router