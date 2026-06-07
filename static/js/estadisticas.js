async function cargarEstadisticas() {

    try {

        const respuesta = await fetch("/api/estadisticas");

        if (!respuesta.ok) {

            throw new Error("No se pudieron cargar las estadísticas D:");

        }

        const datos = await respuesta.json();
        crearGraficoMiembrosPorDia(datos.miembros_por_dia);
        crearGraficoActividadesPorTipo(datos.actividades_por_tipo);
        crearGraficoActividadesPorComuna(datos.actividades_por_comuna);

    } 
    
    catch (error) {

        console.error(error);
        mostrarError("No se pudieron cargar los gráficos D:");

    }
}

function graficoMiembrosPorDia(datos) {

    Highcharts.chart("grafico-miembros-dia", {

        chart: { type: "line" },
        title: { text: "" },
        xAxis: {

            categories: datos.map(item => item.fecha),
            title: { text: "Día" }},

        yAxis: {
            allowDecimals: false,
            title: { text: "Cantidad de miembros" }},

        series: [{
            name: "Miembros",
            data: datos.map(item => item.cantidad)}]
    });
}

function graficoActividadesPorTipo(datos) {

    Highcharts.chart("grafico-actividades-tipo", {
        chart: { type: "pie" },
        title: { text: "" },

        series: [{
            name: "Actividades",
            data: datos.map(item => ({
                name: item.tipo,
                y: item.cantidad}))
        }]
    });
}

function graficoActividadesPorComuna(datos) {

    Highcharts.chart("grafico-actividades-comuna", {
        chart: { type: "column" },
        title: { text: "" },

        xAxis: {
            categories: datos.map(item => item.comuna),
            title: { text: "Comuna" }},

        yAxis: {
            allowDecimals: false,
            title: { text: "Cantidad de actividades" }},

        series: [{
            name: "Actividades",
            data: datos.map(item => item.cantidad)
        }]
    });
}

function mostrarError(mensaje) {
    
    const contenedores = document.querySelectorAll(".grafico");

    contenedores.forEach(contenedor => {
        contenedor.innerHTML = `<p class = "error-grafico">${mensaje}</p>`;
    });
}

cargarEstadisticas();