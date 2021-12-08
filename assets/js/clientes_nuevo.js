const cambiar_datos = (evt) => {
	const tipo_cliente = evt.target.value

	const nombre = document.getElementById('nombre')
	const apellido = document.getElementById('apellido')
	const razon_social = document.getElementById('razon_social')

	if (tipo_cliente == 1) {
		nombre.setAttribute('class', 'col')
		nombre.setAttribute('required', '')
		apellido.setAttribute('class', 'col')
		apellido.setAttribute('required', '')
		razon_social.setAttribute('class', 'col visually-hidden')
		razon_social.removeAttribute('required')
	} else {
		nombre.setAttribute('class', 'col visually-hidden')
		nombre.removeAttribute('required')
		apellido.setAttribute('class', 'col visually-hidden')
		apellido.removeAttribute('required')
		razon_social.setAttribute('class', 'col-8')
		razon_social.setAttribute('required', '')
	}
}

const main = () => {
	document.getElementById('tipo_cli').addEventListener('change', cambiar_datos)
	
}

window.addEventListener('load', main)