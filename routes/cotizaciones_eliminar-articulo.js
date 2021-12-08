const express = require('express')
const router = express.Router()
const DB = require('../config/config')

router.get('/cotizaciones/ver-editar/:id_cot/:id_art/eliminar', async (req, res) => {
	const id_cotizacion = req.params.id_cot
	const id_art = req.params.id_art

	const query = `delete from cot_art where id_articulo = ${id_art}`

	await DB.Open(query, [], true)
	
	res.redirect(`/cotizaciones/ver-editar/${id_cotizacion}`)
})

module.exports = router