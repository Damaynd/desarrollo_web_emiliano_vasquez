const inputBusqueda = document.querySelector("#busqueda");
const formBusqueda = document.querySelector("#buscador-form");
const mensajeBusqueda = document.querySelector("#buscador-mensaje");
const contenedorResultados = document.querySelector("#resultados-busqueda");
let temporizadorBusqueda = null;
let controladorBusqueda = null;

function mostrarMensajeBusqueda(mensaje, esError = false) {

    mensajeBusqueda.textContent = mensaje;
    mensajeBusqueda.classList.toggle("buscador-error", esError);
}

function limpiarResultados() {

    contenedorResultados.innerHTML = "";
}

function agregarTextoDestacado(contenedor, texto, patron) {

    const valor = texto || "";
    const textoNormalizado = valor.toLowerCase();
    const patronNormalizado = patron.toLowerCase();

    if (!patronNormalizado) {  

        contenedor.appendChild(document.createTextNode(valor));

        return;
    }

    let posicion = 0;
    let indice = textoNormalizado.indexOf(patronNormalizado);

    while (indice !== -1) {

        if (indice > posicion) {

            contenedor.appendChild(document.createTextNode(valor.slice(posicion, indice)));
        }

        const marca = document.createElement("mark");
        marca.textContent = valor.slice(indice, indice + patron.length);
        contenedor.appendChild(marca);
        posicion = indice + patron.length;
        indice = textoNormalizado.indexOf(patronNormalizado, posicion);
    }

    if (posicion < valor.length) {

        contenedor.appendChild(document.createTextNode(valor.slice(posicion)));
    }
}

function crearParrafo(etiqueta, texto) {

    const parrafo = document.createElement("p");
    const fuerte = document.createElement("strong");
    fuerte.textContent = `${etiqueta}: `;
    parrafo.appendChild(fuerte);
    parrafo.appendChild(document.createTextNode(texto));

    return parrafo;
}

function capitalizarPrimeraLetra(texto) {

    const valor = texto || "";

    if (valor.length === 0) {

        return valor;
    }

    return valor.charAt(0).toUpperCase() + valor.slice(1);
}

function crearParrafoDestacado(etiqueta, texto, patron) {

    const parrafo = document.createElement("p");
    const fuerte = document.createElement("strong");
    fuerte.textContent = `${etiqueta}: `;
    parrafo.appendChild(fuerte);
    agregarTextoDestacado(parrafo, texto, patron);

    return parrafo;
}

function mostrarMensajeEvaluacion(elemento, mensaje, esError = false) {

    elemento.hidden = false;
    elemento.textContent = mensaje;
    elemento.classList.toggle("evaluacion-error", esError);
    elemento.classList.toggle("evaluacion-exito", !esError);
}

async function enviarNota(actividadId, nota, notaValor, notaContador, mensaje, boton) {

    if (!Number.isInteger(nota) || nota < 1 || nota > 7) {

        mostrarMensajeEvaluacion(mensaje, "Seleccione una nota válida entre 1 y 7.", true);

        return;
    }

    boton.disabled = true;

    try {

        const respuesta = await fetch(`/api/actividades/${actividadId}/notas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify({ nota })});

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(datos.error || "No se pudo agregar la nota.");
        }

        notaValor.textContent = datos.nota;
        notaContador.textContent = datos.cantidad_notas;
        mostrarMensajeEvaluacion(mensaje, datos.mensaje, false);
    }

    catch (error) {

        console.error(error);
        mostrarMensajeEvaluacion(mensaje, error.message, true);
    }

    finally {

        boton.disabled = false;
    }
}

function crearFormularioEvaluacion(actividad, notaValor, notaContador) {

    const contenedor = document.createElement("div");
    contenedor.className = "evaluacion";
    const botonMostrar = document.createElement("button");
    botonMostrar.type = "button";
    botonMostrar.className = "evaluar-toggle";
    botonMostrar.textContent = "Evaluar";
    const form = document.createElement("form");
    form.className = "evaluacion-form evaluacion-form-oculto";
    const label = document.createElement("label");
    label.textContent = "Seleccione nota";
    const select = document.createElement("select");
    select.name = "nota";
    select.required = true;

    for (let valor = 1; valor <= 7; valor += 1) {

        const option = document.createElement("option");
        option.value = valor;
        option.textContent = valor;
        select.appendChild(option);
    }

    const botonGuardar = document.createElement("button");
    botonGuardar.type = "submit";
    botonGuardar.textContent = "Guardar nota";
    const mensaje = document.createElement("p");
    mensaje.className = "evaluacion-mensaje";
    mensaje.hidden = true;
    label.appendChild(select);
    form.appendChild(label);
    form.appendChild(botonGuardar);
    form.appendChild(mensaje);

    botonMostrar.addEventListener("click", () => {

        const estaOculto = form.classList.toggle("evaluacion-form-oculto");
        botonMostrar.textContent = estaOculto ? "Evaluar" : "Ocultar evaluación";

        if (!estaOculto) {

            select.focus();
        }
    });

    form.addEventListener("submit", async event => {

        event.preventDefault();
        const nota = Number(select.value);

        await enviarNota(
            actividad.id,
            nota,
            notaValor,
            notaContador,
            mensaje,
            botonGuardar
        );
    });

    contenedor.appendChild(botonMostrar);
    contenedor.appendChild(form);

    return contenedor;
}

function crearResultadoActividad(actividad, patron) {

    const articulo = document.createElement("article");
    articulo.className = "section resultado-actividad";
    const titulo = document.createElement("h2");
    agregarTextoDestacado(titulo, actividad.nombre, patron);
    const nota = document.createElement("p");
    const notaEtiqueta = document.createElement("strong");
    notaEtiqueta.textContent = "Nota: ";
    const notaValor = document.createElement("span");
    notaValor.className = "nota-valor";
    notaValor.textContent = actividad.nota;
    const notaTexto = document.createTextNode(" (");
    const notaContador = document.createElement("span");
    notaContador.className = "nota-contador";
    notaContador.textContent = actividad.cantidad_notas;
    const notaCierre = document.createTextNode(" evaluaciones)");

    nota.appendChild(notaEtiqueta);
    nota.appendChild(notaValor);
    nota.appendChild(notaTexto);
    nota.appendChild(notaContador);
    nota.appendChild(notaCierre);
    articulo.appendChild(titulo);
    articulo.appendChild(crearParrafo("Miembro", actividad.miembro));
    articulo.appendChild(crearParrafo("Día", capitalizarPrimeraLetra(actividad.dia)));
    articulo.appendChild(crearParrafo("Tipo", capitalizarPrimeraLetra(actividad.tipo)));
    articulo.appendChild(crearParrafoDestacado("Comuna", actividad.comuna, patron));
    articulo.appendChild(crearParrafoDestacado("Descripción", actividad.descripcion, patron));
    articulo.appendChild(nota);
    articulo.appendChild(crearFormularioEvaluacion(actividad, notaValor, notaContador));

    return articulo;
}

function renderizarResultados(actividades, patron) {

    limpiarResultados();

    if (actividades.length === 0) {
        
        mostrarMensajeBusqueda("No se encontraron actividades para esa búsqueda u u");
        return;
    }

    mostrarMensajeBusqueda(`${actividades.length} actividades encontradas :D`);

    actividades.forEach(actividad => {

        contenedorResultados.appendChild(crearResultadoActividad(actividad, patron));
    });
}

async function buscarActividades() {

    const patron = inputBusqueda.value.trim();

    if (patron.length < 3) {

        if (controladorBusqueda) {

            controladorBusqueda.abort();
        }

        limpiarResultados();
        mostrarMensajeBusqueda("Escribe al menos 3 caracteres para buscar !");

        return;
    }

    if (controladorBusqueda) {

        controladorBusqueda.abort();
    }

    controladorBusqueda = new AbortController();
    mostrarMensajeBusqueda("Buscando actividades... o.o");

    try {

        const respuesta = await fetch(
            `/api/actividades/buscar?q=${encodeURIComponent(patron)}`,
            { signal: controladorBusqueda.signal }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo realizar la búsqueda u-u");
        }

        renderizarResultados(datos.actividades, patron);
    }

    catch (error) {

        if (error.name === "AbortError") {

            return;
        }

        console.error(error);
        limpiarResultados();
        mostrarMensajeBusqueda(error.message, true);
    }
}

formBusqueda.addEventListener("submit", event => {

    event.preventDefault();
    buscarActividades();
});

inputBusqueda.addEventListener("input", () => {

    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(buscarActividades, 300);
});
