const cantidad = document.getElementById('cantidad')
const selecMoneda = document.getElementById('selecMoneda')
const buscar = document.getElementById('buscar')
const resultado = document.getElementById('resultado')
const grafica = document.querySelector('.grafica')

//Api para conversión
const apiDolar = async () => {
    try {
        const res = await fetch('https://mindicador.cl/api/')
        const data = await res.json()
        const dolar = data.dolar.valor
        console.log(data.dolar.valor)
        return dolar
    } catch (error) {
        alert(error.message)
    }
}

const apiEuro = async () => {
    try {
        const res = await fetch('https://mindicador.cl/api/')
        const data = await res.json()
        const euro = data.euro.valor
        console.log(data.euro.valor)
        return euro
    } catch (error) {
        alert(error.message)
    }
}

const convertirAdolar = async () => {
    const dolar = await apiDolar()
    buscar.addEventListener('click', () => {
        if (selecMoneda.value == 'dolar') {
            const dol = cantidad.value / dolar
            resultado.innerHTML = `Resultado: $${dol.toFixed(2)}`
        }
        else if (selecMoneda.value == 'seleccionar') {
            resultado.innerHTML = "Seleccione moneda"
        }

    })
}
convertirAdolar()

const convertirAeuro = async () => {
    const euro = await apiEuro()
    buscar.addEventListener('click', () => {
        if (selecMoneda.value == 'euro') {
            const eur = cantidad.value / euro
            resultado.innerHTML = `Resultado: €${eur.toFixed(2)}`
        }

    })
}
convertirAeuro()

//Grafica
async function getAndCreateDataToChart(moneda) {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const dat = await res.json();
    const datos = dat.serie
    console.log(datos)
    const labels = datos.map((dato) => {
        const fecha = dato.fecha.slice(0, 10)
        return fecha;
    });
    const data = datos.map((dato) => {
        const valor = dato.valor;
        console.log(valor)
        return valor;
    });
    const datasets = [
        {
            label: "Historial últimos días",
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];
    return { labels, datasets };
}

async function renderGrafica(moneda) {
    const data = await getAndCreateDataToChart(moneda);
    const config = {
        type: "line",
        data
    };
    if (window.myChart instanceof Chart) { window.myChart.destroy(); }
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    window.myChart = new Chart(myChart, config);
}

buscar.addEventListener('click', () => {
    if (selecMoneda.value == 'euro') {
        renderGrafica('euro')
    }
    else if (selecMoneda.value == 'dolar') {
        renderGrafica('dolar')
    }

})
