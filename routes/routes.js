const express = require('express')
const router = express.Router()
const DB = require('../config/config')

router.use(require('./articulos_buscar'))
router.use(require('./articulos'))
router.use(require('./clientes_buscar'))
router.use(require('./clientes_editar'))
router.use(require('./clientes_nuevo'))
router.use(require('./clientes'))
router.use(require('./cotizaciones_agregar-articulo'))
router.use(require('./cotizaciones_editar-articulo'))
router.use(require('./cotizaciones_eliminar-articulo'))
router.use(require('./cotizaciones_nuevo'))
router.use(require('./cotizaciones_ver-editar'))
router.use(require('./cotizaciones'))
router.use(require('./pedidos_ver'))
router.use(require('./pedidos'))

router.get('/', (req, res) => {
	res.render('index')
})

module.exports = router