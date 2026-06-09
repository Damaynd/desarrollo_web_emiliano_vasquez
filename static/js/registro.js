const form = document.querySelector(".formulario");

const nInput = document.getElementById("nombre");
const eInput = document.getElementById("email");
const tInput = document.getElementById("telefono");
const cSelect = document.getElementById("comuna_id");
const nActInput = document.getElementById("nombre_actividad");
const tActSelect = document.getElementById("tipo_actividad");
const dActInput = document.getElementById("descripcion_actividad");
const daysInputs = document.querySelectorAll('input[name="dias"]');
const h0Input = document.getElementById("hora_inicio");
const hfInput = document.getElementById("hora_termino");
const fotoInput = document.getElementById("foto");

function showErr(input, errorId, mensaje) {

    const errorElement = document.getElementById(errorId);

    if (!errorElement) return;

    errorElement.textContent = mensaje;
    errorElement.hidden = false;

    if (input) {
        input.classList.add("input-error");
    }
}

function cleanErr(input, errorId) {

    const errorElement = document.getElementById(errorId);
    if (!errorElement) return;

    errorElement.textContent = "";
    errorElement.hidden = true;

    if (input) {
        input.classList.remove("input-error");
    }
}

function globalCleanErr() {

    cleanErr(nInput, "error-nombre");
    cleanErr(eInput, "error-email");
    cleanErr(tInput, "error-telefono");
    cleanErr(cSelect, "error-comuna_id");
    cleanErr(nActInput, "error-nombre_actividad");
    cleanErr(tActSelect, "error-tipo_actividad");
    cleanErr(dActInput, "error-descripcion_actividad");
    cleanErr(null, "error-dias");
    cleanErr(h0Input, "error-hora_inicio");
    cleanErr(hfInput, "error-hora_termino");
    cleanErr(fotoInput, "error-foto");
}

function eValido(email) {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function tValido(telefono) {

    const regex = /^\d{8,}$/;
    return regex.test(telefono);

}

function diasSeleccionados() {

    return Array.from(daysInputs).some(dia => dia.checked);
}

function archivosValidos(files) {

    const extensionesValidas = ["png", "jpg", "jpeg", "webp", "gif"];

    for (const file of files) {

        const partes = file.name.split(".");
        const extension = partes[partes.length - 1].toLowerCase();

        if (!extensionesValidas.includes(extension)) {

            return false;
        }
    }

    return true;
}

if (form) {
    
    form.addEventListener("submit", function (event) {

        globalCleanErr();
        let formEsValido = true;

        const nombre = nInput.value.trim();
        const email = eInput.value.trim();
        const telefono = tInput.value.trim();
        const comuna = cSelect.value;
        const nombreActividad = nActInput.value.trim();
        const tipoActividad = tActSelect.value;
        const descripcionActividad = dActInput.value.trim();
        const horaInicio = h0Input.value;
        const horaTermino = hfInput.value;
        const archivos = fotoInput.files;

        if (nombre.length < 3) {
            showErr(nInput, "error-nombre", "Ingrese un nombre completo válido.");
            formEsValido = false;
        }

        if (!eValido(email)) {
            showErr(eInput, "error-email", "Ingrese un correo electrónico válido !");
            formEsValido = false;
        }

        if (!telefono) {
            showErr(tInput, "error-telefono", "Ingrese un teléfono !");
            formEsValido = false;
        } else if (!tValido(telefono)) {
            showErr(tInput, "error-telefono", "Ingrese un teléfono válido !");
            formEsValido = false;
        }

        if (comuna === "") {
            showErr(cSelect, "error-comuna_id", "Seleccione una comuna !");
            formEsValido = false;
        }

        if (nombreActividad.length < 3) {
            showErr(nActInput, "error-nombre_actividad", "Ingrese un nombre de actividad válido !");
            formEsValido = false;
        }

        if (tipoActividad === "") {
            showErr(tActSelect, "error-tipo_actividad", "Seleccione un tipo de actividad !");
            formEsValido = false;
        }

        if (descripcionActividad.length < 10) {
            showErr(dActInput, "error-descripcion_actividad", "Ingrese una descripción más completa !");
            formEsValido = false;
        }

        if (!diasSeleccionados()) {
            showErr(null, "error-dias", "Seleccione al menos un día !");
            formEsValido = false;
        }

        if (horaInicio === "") {
            showErr(h0Input, "error-hora_inicio", "Ingrese una hora de inicio !");
            formEsValido = false;
        }

        if (horaTermino === "") {
            showErr(hfInput, "error-hora_termino", "Ingrese una hora de término !");
            formEsValido = false;
        }

        if (horaInicio !== "" && horaTermino !== "" && horaTermino <= horaInicio) {
            showErr(hfInput, "error-hora_termino", "La hora de término debe ser posterior a la de inicio !");
            formEsValido = false;
        }

        if (archivos.length === 0) {
            showErr(fotoInput, "error-foto", "Debe adjuntar al menos una foto !");
            formEsValido = false;
        } else if (!archivosValidos(archivos)) {
            showErr(fotoInput, "error-foto", "Formato de archivo no permitido !");
            formEsValido = false;
        }

        if (!formEsValido) {
            event.preventDefault();
        }
    });
}