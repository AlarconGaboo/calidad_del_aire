// Definimos las constantes con la URL base y el endpoint
const BASE_URL = 'https://sinca.mma.gob.cl/index.php/json';
const ENDPOINT = '/listadomapa2k19/';

document.getElementById('search-button').addEventListener('click', function() {
    const input = document.getElementById('comuna-input');
    let comuna = formatText(input.value);

    fetch(`${BASE_URL}${ENDPOINT}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Esto muestra toda la estructura de datos

            const result = data.find(item => 
                item.comuna.toLowerCase().trim() === comuna.toLowerCase().trim()
            );

            if (result) {
                console.log('Datos específicos de la comuna:', result); // Muestra la información específica de la comuna
                displayResult(result);
            } else {
                displayError('No se encontró información para la comuna ingresada.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError('Hubo un error al obtener los datos.');
        });

    input.value = '';  // Limpia el input
    document.getElementById('result').innerHTML = '';  // Limpia el resultado previo
});

document.getElementById('comuna-input').addEventListener('focus', function() {
    this.value = '';  // Limpia el input cuando se hace clic en él
    document.getElementById('result').innerHTML = '';  // Limpia el resultado previo
});

function formatText(text) {
    return text.replace(/\b\w/g, char => char.toUpperCase());
}

function clasificarCalidadMP10(valor) {
    if (valor <= 50) {
        return "Buena";
    } else if (valor <= 100) {
        return "Moderada";
    } else if (valor <= 150) {
        return "Mala";
    } else if (valor <= 200) {
        return "Muy Mala";
    } else {
        return "Peligrosa";
    }
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');

    // Verificar si el campo MP10 existe
    const mp10Data = result.realtime.find(item => item.code === "PM10");
    if (mp10Data && mp10Data.info && mp10Data.info.rows.length > 0) {
        const mp10 = mp10Data.info.rows[0].c[1].v;
        const calidadMP10 = clasificarCalidadMP10(mp10);

        resultDiv.innerHTML = `
            <p><strong>Comuna:</strong> ${result.comuna}</p>
            <p><strong>Región:</strong> ${result.region}</p>
          
            <p><strong>La concentracion de la calidad del aire es :</strong> ${mp10} µg/m³</p>
            <p><strong>Calidad:</strong> ${calidadMP10}</p>
  
        `;
    } else {
        resultDiv.innerHTML = `
            <p><strong>Comuna:</strong> ${result.comuna}</p>
            <p><strong>Región:</strong> ${result.region}</p>
            <p><strong>Latitud:</strong> ${result.latitud}</p>
            <p><strong>Longitud:</strong> ${result.longitud}</p>
            <p><strong>MP10:</strong> No disponible</p>
            <p><strong>Calidad del Aire (MP10):</strong> No disponible</p>
            <p><strong>Estado:</strong> ${result.estado}</p>
        `;
    }
}


console.log(results)
function displayError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>${message}</p>`;
}
