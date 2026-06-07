function crearComentarioHTML(comentario) {

    const article = document.createElement("article");
    article.className = "comentario-item";
    const meta = document.createElement("p");
    meta.className = "comentario-meta";
    meta.textContent = `${comentario.fecha} - ${comentario.nombre}`;
    const texto = document.createElement("p");
    texto.className = "comentario-texto";
    texto.textContent = comentario.texto;
    article.appendChild(meta);
    article.appendChild(texto);

    return article;

}

function mostrarMensaje(elemento, mensaje, esError = true) {

    elemento.textContent = mensaje;
    elemento.hidden = false;
    elemento.classList.toggle("comentario-error", esError);
    elemento.classList.toggle("comentario-exito", !esError);

}

async function cargarComentarios(actividadId, lista) {

    const respuesta = await fetch(`/api/actividades/${actividadId}/comentarios`);

    if (!respuesta.ok) {

        throw new Error("No se pudieron cargar los comentarios.");

    }

    const datos = await respuesta.json();
    lista.innerHTML = "";

    if (datos.comentarios.length === 0) {

        const vacio = document.createElement("p");
        vacio.textContent = "Esta actividad todavía no tiene comentarios.";
        lista.appendChild(vacio);
        return;

    }

    datos.comentarios.forEach(comentario => {

        lista.appendChild(crearComentarioHTML(comentario));
    });
}

function validarComentario(nombre, texto) {

    const errores = [];

    if (nombre.length < 3 || nombre.length > 80) {

        errores.push("El nombre debe tener entre 3 y 80 caracteres >:(");

    }

    if (texto.length < 5) {

        errores.push("El comentario debe tener al menos 5 caracteres >:/ ");
    }

    if (texto.length > 300) {

        errores.push("El comentario no puede superar los 300 caracteres >:|");
    }

    return errores;
}

document.querySelectorAll(".comentarios-actividad").forEach(seccion => {

    const actividadId = seccion.dataset.actividadId;
    const lista = seccion.querySelector(".comentarios-lista");
    const form = seccion.querySelector(".comentario-form");
    const mensaje = seccion.querySelector(".comentario-mensaje");

    cargarComentarios(actividadId, lista).catch(error => {

        console.error(error);
        lista.innerHTML = "<p>No se pudieron cargar los comentarios u u </p>";
    });

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const nombre = form.nombre.value.trim();
        const texto = form.texto.value.trim();
        const errores = validarComentario(nombre, texto);

        if (errores.length > 0) {

            mostrarMensaje(mensaje, errores[0]);

            return;
        }

        try {

            const respuesta = await fetch(`/api/actividades/${actividadId}/comentarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},

                body: JSON.stringify({ nombre, texto })});

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                const error = datos.errores
                
                    ? Object.values(datos.errores)[0]
                    : "No se pudo agregar el comentario.";

                mostrarMensaje(mensaje, error);
                return;
            }

            form.reset();
            mostrarMensaje(mensaje, datos.mensaje, false);
            await cargarComentarios(actividadId, lista);

        } catch (error) {
            console.error(error);
            mostrarMensaje(mensaje, "No se pudo conectar con el servidor.");
        }
    });
});