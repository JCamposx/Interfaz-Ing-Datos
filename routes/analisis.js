const express = require('express')
const router = express.Router()
const DB = require('../config/config')

const ARTICULOxDONDE = async (cod) => {
	const cant = []
	const query = `select
						ARTICULOxDONDE(${cod})
					from dual`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			cant: e[0]
		}
		cant.push(user_schema.cant)
	})

	return cant[0]
}

//////////////////////////////////////////////////////////////////////////////////

const CLIENTExTIPO = async (cod) => {
	const cant = []
	const query = `select
						CLIENTExTIPO(${cod})
					from dual`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			cant: e[0]
		}
		cant.push(user_schema.cant)
	})

	return cant[0]
}

//////////////////////////////////////////////////////////////////////////////////

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

const CLIENTE_ASESOR = async (cod) => {
	const cant = []
	const query = `select
						CLIENTE_ASESOR(${cod})
					from dual`
	const result = await DB.Open(query, [], false)

	result.rows.map(e => {
		const user_schema = {
			cant: e[0]
		}
		cant.push(user_schema.cant)
	})

	return cant[0]
}

//////////////////////////////////////////////////////////////////////////////////

router.get('/analisis', async (req, res) => {
	const nacional = await ARTICULOxDONDE(1)
	const extranjero = await ARTICULOxDONDE(2)

	const p_jur = await CLIENTExTIPO(1)
	const p_nat = await CLIENTExTIPO(2)

	const asesores = await obtener_asesores()
	for (let asesor of asesores) {
		asesor.cant_clientes = await CLIENTE_ASESOR(asesor.id_ase)
	}

	console.log(asesores)
	res.render('analisis', {
		nacional: nacional,
		extranjero: extranjero,
		p_jur: p_jur,
		p_nat: p_nat,
		asesores: asesores
	})
})

module.exports = router