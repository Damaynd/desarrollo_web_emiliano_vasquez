const datosMiembros = [
    { etiqueta: "Pregrado", valor: 12 },
    { etiqueta: "Postgrado", valor: 6 },
    { etiqueta: "Docentes", valor: 5 },
    { etiqueta: "Funcionarios/as", valor: 4 }
];

const datosActividades = [
    { etiqueta: "Artísticas", valor: 7 },
    { etiqueta: "Deportivas", valor: 10 },
    { etiqueta: "Tecnológicas", valor: 5 },
    { etiqueta: "Sociales", valor: 4 },
    { etiqueta: "Recreativas", valor: 8 }
];

const datosDias = [
    { etiqueta: "Lunes", valor: 6 },
    { etiqueta: "Miércoles", valor: 9 },
    { etiqueta: "Viernes", valor: 11 },
    { etiqueta: "Sábado", valor: 7 }
];

function renderGraficoBarras(containerId, datos) {
    const container = document.getElementById(containerId);
    const maxValor = Math.max(...datos.map(dato => dato.valor));

    container.innerHTML = "";

    datos.forEach(dato => {
        const fila = document.createElement("div");
        fila.className = "barra-item";

        const etiqueta = document.createElement("div");
        etiqueta.className = "barra-etiqueta";
        etiqueta.textContent = dato.etiqueta;

        const barraWrapper = document.createElement("div");
        barraWrapper.className = "barra-wrapper";

        const barra = document.createElement("div");
        barra.className = "barra";
        barra.style.width = `${(dato.valor / maxValor) * 100}%`;
        barra.textContent = dato.valor;

        barraWrapper.appendChild(barra);
        fila.appendChild(etiqueta);
        fila.appendChild(barraWrapper);

        container.appendChild(fila);
    });
}

renderGraficoBarras("grafico-miembros", datosMiembros);
renderGraficoBarras("grafico-actividades", datosActividades);
renderGraficoBarras("grafico-dias", datosDias);