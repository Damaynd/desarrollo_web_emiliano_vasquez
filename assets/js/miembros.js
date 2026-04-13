const miembros = [
    {
        nombre: "Ana Pérez",
        correo: "ana.perez@dcc.uchile.cl",
        tipo: "pregrado",
        detalle: "Ingeniería Civil en Computación"
    },
    {
        nombre: "Diego Soto",
        correo: "diego.soto@dcc.uchile.cl",
        tipo: "postgrado",
        detalle: "Magíster en Ciencia de Datos"
    },
    {
        nombre: "María González",
        correo: "maria.gonzalez@dcc.uchile.cl",
        tipo: "docente",
        detalle: "Departamento de Computación"
    },
    {
        nombre: "Carlos Rojas",
        correo: "carlos.rojas@dcc.uchile.cl",
        tipo: "funcionario",
        detalle: "Unidad de Calidad de Vida"
    },
    {
        nombre: "Fernanda López",
        correo: "fernanda.lopez@dcc.uchile.cl",
        tipo: "pregrado",
        detalle: "Ingeniería Civil"
    },
    {
        nombre: "Tomás Herrera",
        correo: "tomas.herrera@dcc.uchile.cl",
        tipo: "postgrado",
        detalle: "Doctorado en Computación"
    },
    {
        nombre: "Paula Muñoz",
        correo: "paula.munoz@dcc.uchile.cl",
        tipo: "docente",
        detalle: "Departamento de Matemáticas"
    },
    {
        nombre: "Jorge Navarro",
        correo: "jorge.navarro@dcc.uchile.cl",
        tipo: "funcionario",
        detalle: "Secretaría Académica"
    }
];

const fTipo = document.getElementById("filtro-tipo");
const orderMems = document.getElementById("orden-miembros");
const tBody = document.getElementById("tabla-miembros-body");
const bttnPrev = document.getElementById("btn-anterior");
const bttnNext = document.getElementById("btn-siguiente");
const pagActSpan = document.getElementById("pagina-actual");

const memsPerPage = 4;
let pagAct = 1;

function obtTextCareer(tipo) {
    if (tipo === "pregrado") return "Estudiante de pregrado";
    if (tipo === "postgrado") return "Estudiante de postgrado";
    if (tipo === "docente") return "Docente";
    if (tipo === "funcionario") return "Funcionario/a";
    return tipo;
}

function obtMemsProc() {
    let resultado = [...miembros];

    const tSel = fTipo.value;
    const orderSel = orderMems.value;

    if (tSel !== "todos") {
        resultado = resultado.filter(miembro => miembro.tipo === tSel);
    }

    if (orderSel === "nombre-asc") {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orderSel === "nombre-desc") {
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (orderSel === "correo-asc") {
        resultado.sort((a, b) => a.correo.localeCompare(b.correo));
    } else if (orderSel === "correo-desc") {
        resultado.sort((a, b) => b.correo.localeCompare(a.correo));
    }

    return resultado;
}

function renderTabla() {
    const memsProc = obtMemsProc();
    const totalPags = Math.max(1, Math.ceil(memsProc.length / memsPerPage));

    if (pagAct > totalPags) {
        pagAct = totalPags;
    }

    const inicio = (pagAct - 1) * memsPerPage;
    const fin = inicio + memsPerPage;
    const memsPage = memsProc.slice(inicio, fin);

    tBody.innerHTML = "";

    if (memsPage.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="4">No hay miembros para mostrar.</td>`;
        tBody.appendChild(fila);
    } else {
        memsPage.forEach(miembro => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${miembro.nombre}</td>
                <td>${miembro.correo}</td>
                <td>${obtTextCareer(miembro.tipo)}</td>
                <td>${miembro.detalle}</td>
            `;

            tBody.appendChild(fila);
        });
    }

    pagActSpan.textContent = `Página ${pagAct} de ${totalPags}`;
    bttnPrev.disabled = pagAct === 1;
    bttnNext.disabled = pagAct === totalPags;
}

fTipo.addEventListener("change", function () {
    pagAct = 1;
    renderTabla();
});

orderMems.addEventListener("change", function () {
    pagAct = 1;
    renderTabla();
});

bttnPrev.addEventListener("click", function () {
    if (pagAct > 1) {
        pagAct--;
        renderTabla();
    }
});

bttnNext.addEventListener("click", function () {
    const totalPaginas = Math.max(1, Math.ceil(obtMemsProc().length / memsPerPage));
    if (pagAct < totalPaginas) {
        pagAct++;
        renderTabla();
    }
});

renderTabla();