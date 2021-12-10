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

const cliente_asesor = () => {
	const labels = [
		"3577",
		"3325",
		"7904", 
		"8354",
		"4448",
		"3789",
		"3966",
		"5955",
		"2008",
		"5922"
	]

	const valores = []
	for (let i = 0; i < labels.length; i++) {
		const cant_clientes = document.getElementById('ase_' + labels[i]).value
		valores.push(cant_clientes)
	}

	console.log(labels)

	const data = {
		labels: labels,
		datasets: [
			{
				label: '',
				data: valores,
				backgroundColor: [
					"#1d3e6e",
					"#7a95b0",
					"#8db046",
					"#fe3533",
					"##900001",
					"#a6b401",
					"#eff67b",
					"#d50102",
					"#6c0102",
					"b3e7dc"
				]
			}
		]
	}

	const cliente_asesor = document.getElementById("cliente_asesor").getContext('2d')

	const chart = new Chart(cliente_asesor, {
		type: 'bar',
		data: data
	})
}

window.addEventListener('load', articuloxdonde)
window.addEventListener('load', clientextipo)
window.addEventListener('load', cliente_asesor)