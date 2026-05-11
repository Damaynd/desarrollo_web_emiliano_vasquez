const dMem = [
    {etiqueta: "Pregrado", valor: 12},
    {etiqueta: "Postgrado", valor: 6},
    {etiqueta: "Docentes", valor: 5},
    {etiqueta: "Funcionarios/as", valor: 4}
];

const dAct = [
    {etiqueta: "Artísticas", valor: 7},
    {etiqueta: "Deportivas", valor: 10},
    {etiqueta: "Tecnológicas", valor: 5},
    {etiqueta: "Sociales", valor: 4},
    {etiqueta: "Recreativas", valor: 8}
];

const dDay = [
    {etiqueta: "Lunes", valor: 6},
    {etiqueta: "Miércoles", valor: 9},
    {etiqueta: "Viernes", valor: 11},
    {etiqueta: "Sábado", valor: 7}
];

function rendBars(containerId, datos) {
    const container = document.getElementById(containerId);
    const maxVal = Math.max(...datos.map(dato => dato.valor));

    container.innerHTML = "";

    datos.forEach(dato => {
        const row = document.createElement("div");
        row.className = "barra-item";

        const label = document.createElement("div");
        label.className = "barra-etiqueta";
        label.textContent = dato.etiqueta;

        const barWrap = document.createElement("div");
        barWrap.className = "barra-wrapper";

        const bar = document.createElement("div");
        bar.className = "barra";
        bar.style.width = `${(dato.valor / maxVal) * 100}%`;
        bar.textContent = dato.valor;

        barWrap.appendChild(bar);
        row.appendChild(label);
        row.appendChild(barWrap);

        container.appendChild(row);
    });
}

rendBars("grafico-miembros", dMem);
rendBars("grafico-actividades", dAct);
rendBars("grafico-dias", dDay);