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