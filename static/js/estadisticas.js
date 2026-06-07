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