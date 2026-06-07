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