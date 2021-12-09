const articuloxdonde = () => {
	const nacional = document.getElementById('nacional').value
	const extranjero = document.getElementById('extranjero').value

	const data = {
		labels: [
			"Nacional",
			"Extranjero"
		],
		datasets: [
			{
				data: [nacional, extranjero],
				backgroundColor: [
					"#004c97",
					"#00994e"
				]
			}
		]
	}

	const articuloxdonde = document.getElementById("articuloxdonde").getContext('2d')

	const chart = new Chart(articuloxdonde, {
		type: 'doughnut',
		data: data
	})
}

const clientextipo = () => {
	const p_jur = document.getElementById('p_jur').value
	const p_nat = document.getElementById('p_nat').value

	const data = {
		labels: [
			"Persona Jurídica",
			"Persona Natural"
		],
		datasets: [
			{
				data: [p_jur, p_nat],
				backgroundColor: [
					"#004c97",
					"#00994e"
				]
			}
		]
	}

	const clientextipo = document.getElementById("clientextipo").getContext('2d')

	const chart = new Chart(clientextipo, {
		type: 'doughnut',
		data: data
	})
}

window.addEventListener('load', articuloxdonde)
window.addEventListener('load', clientextipo)