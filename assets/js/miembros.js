const miembros = [
    {
        nombre: "Ana Pérez",
        correo: "ana.perez@uc.cl",
        tipo: "pregrado",
        detalle: "Ingeniería Civil en Computación"
    },
    {
        nombre: "Diego Soto",
        correo: "diego.soto@uc.cl",
        tipo: "postgrado",
        detalle: "Magíster en Ciencia de Datos"
    },
    {
        nombre: "María González",
        correo: "maria.gonzalez@uc.cl",
        tipo: "docente",
        detalle: "Departamento de Computación"
    },
    {
        nombre: "Carlos Rojas",
        correo: "carlos.rojas@uc.cl",
        tipo: "funcionario",
        detalle: "Unidad de Calidad de Vida"
    },
    {
        nombre: "Fernanda López",
        correo: "fernanda.lopez@uc.cl",
        tipo: "pregrado",
        detalle: "Ingeniería Civil"
    },
    {
        nombre: "Tomás Herrera",
        correo: "tomas.herrera@uc.cl",
        tipo: "postgrado",
        detalle: "Doctorado en Computación"
    },
    {
        nombre: "Paula Muñoz",
        correo: "paula.munoz@uc.cl",
        tipo: "docente",
        detalle: "Departamento de Matemáticas"
    },
    {
        nombre: "Jorge Navarro",
        correo: "jorge.navarro@uc.cl",
        tipo: "funcionario",
        detalle: "Secretaría Académica"
    }
];

const filtroTipo = document.getElementById("filtro-tipo");
const ordenMiembros = document.getElementById("orden-miembros");
const tablaBody = document.getElementById("tabla-miembros-body");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const paginaActualSpan = document.getElementById("pagina-actual");

const miembrosPorPagina = 4;
let paginaActual = 1;

function obtenerTextoTipo(tipo) {
    if (tipo === "pregrado") return "Estudiante de pregrado";
    if (tipo === "postgrado") return "Estudiante de postgrado";
    if (tipo === "docente") return "Docente";
    if (tipo === "funcionario") return "Funcionario/a";
    return tipo;
}

function obtenerMiembrosProcesados() {
    let resultado = [...miembros];

    const tipoSeleccionado = filtroTipo.value;
    const ordenSeleccionado = ordenMiembros.value;

    if (tipoSeleccionado !== "todos") {
        resultado = resultado.filter(miembro => miembro.tipo === tipoSeleccionado);
    }

    if (ordenSeleccionado === "nombre-asc") {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (ordenSeleccionado === "nombre-desc") {
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (ordenSeleccionado === "correo-asc") {
        resultado.sort((a, b) => a.correo.localeCompare(b.correo));
    } else if (ordenSeleccionado === "correo-desc") {
        resultado.sort((a, b) => b.correo.localeCompare(a.correo));
    }

    return resultado;
}

function renderTabla() {
    const miembrosProcesados = obtenerMiembrosProcesados();
    const totalPaginas = Math.max(1, Math.ceil(miembrosProcesados.length / miembrosPorPagina));

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    const inicio = (paginaActual - 1) * miembrosPorPagina;
    const fin = inicio + miembrosPorPagina;
    const miembrosPagina = miembrosProcesados.slice(inicio, fin);

    tablaBody.innerHTML = "";

    if (miembrosPagina.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="4">No hay miembros para mostrar.</td>`;
        tablaBody.appendChild(fila);
    } else {
        miembrosPagina.forEach(miembro => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${miembro.nombre}</td>
                <td>${miembro.correo}</td>
                <td>${obtenerTextoTipo(miembro.tipo)}</td>
                <td>${miembro.detalle}</td>
            `;

            tablaBody.appendChild(fila);
        });
    }

    paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
}

filtroTipo.addEventListener("change", function () {
    paginaActual = 1;
    renderTabla();
});

ordenMiembros.addEventListener("change", function () {
    paginaActual = 1;
    renderTabla();
});

btnAnterior.addEventListener("click", function () {
    if (paginaActual > 1) {
        paginaActual--;
        renderTabla();
    }
});

btnSiguiente.addEventListener("click", function () {
    const totalPaginas = Math.max(1, Math.ceil(obtenerMiembrosProcesados().length / miembrosPorPagina));
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderTabla();
    }
});

renderTabla();