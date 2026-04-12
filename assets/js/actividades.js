const formActividad = document.getElementById("form-actividad");

const nombreActividadInput = document.getElementById("nombre-actividad");
const tipoActividadInput = document.getElementById("tipo-actividad");
const descripcionActividadInput = document.getElementById("descripcion-actividad");
const diasActividadInputs = document.querySelectorAll('input[name="dias"]');
const horaInicioInput = document.getElementById("hora-inicio");
const horaTerminoInput = document.getElementById("hora-termino");
const archivoActividadInput = document.getElementById("archivo-actividad");
const enlaceActividadInput = document.getElementById("enlace-actividad");

function mostrarError(input, errorId, mensaje) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = mensaje;
    errorElement.hidden = false;

    if (input) {
        input.classList.add("input-error");
    }
}

function limpiarError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = "";
    errorElement.hidden = true;

    if (input) {
        input.classList.remove("input-error");
    }
}

function limpiarTodosLosErroresActividad() {
    limpiarError(nombreActividadInput, "error-nombre-actividad");
    limpiarError(tipoActividadInput, "error-tipo-actividad");
    limpiarError(descripcionActividadInput, "error-descripcion-actividad");
    limpiarError(null, "error-dias");
    limpiarError(horaInicioInput, "error-hora-inicio");
    limpiarError(horaTerminoInput, "error-hora-termino");
    limpiarError(archivoActividadInput, "error-archivo-actividad");
    limpiarError(enlaceActividadInput, "error-enlace-actividad");
}

function hayDiaSeleccionado() {
    return Array.from(diasActividadInputs).some(dia => dia.checked);
}

function enlaceValido(enlace) {
    try {
        new URL(enlace);
        return true;
    } catch {
        return false;
    }
}

formActividad.addEventListener("submit", function (event) {
    event.preventDefault();
    limpiarTodosLosErroresActividad();

    let formularioValido = true;

    const nombreActividad = nombreActividadInput.value.trim();
    const tipoActividad = tipoActividadInput.value;
    const descripcionActividad = descripcionActividadInput.value.trim();
    const horaInicio = horaInicioInput.value;
    const horaTermino = horaTerminoInput.value;
    const enlaceActividad = enlaceActividadInput.value.trim();
    const archivoSeleccionado = archivoActividadInput.files.length > 0;

    if (nombreActividad.length < 3) {
        mostrarError(nombreActividadInput, "error-nombre-actividad", "Ingrese un nombre válido.");
        formularioValido = false;
    }

    if (tipoActividad === "") {
        mostrarError(tipoActividadInput, "error-tipo-actividad", "Seleccione un tipo de actividad.");
        formularioValido = false;
    }

    if (descripcionActividad.length < 10) {
        mostrarError(descripcionActividadInput, "error-descripcion-actividad", "Ingrese una descripción más completa.");
        formularioValido = false;
    }

    if (!hayDiaSeleccionado()) {
        mostrarError(null, "error-dias", "Seleccione al menos un día.");
        formularioValido = false;
    }

    if (horaInicio === "") {
        mostrarError(horaInicioInput, "error-hora-inicio", "Ingrese una hora de inicio.");
        formularioValido = false;
    }

    if (horaTermino === "") {
        mostrarError(horaTerminoInput, "error-hora-termino", "Ingrese una hora de término.");
        formularioValido = false;
    }

    if (horaInicio !== "" && horaTermino !== "" && horaTermino <= horaInicio) {
        mostrarError(horaTerminoInput, "error-hora-termino", "La hora de término debe ser posterior a la de inicio.");
        formularioValido = false;
    }

    if (!archivoSeleccionado) {
        mostrarError(archivoActividadInput, "error-archivo-actividad", "Debe adjuntar al menos una foto o video.");
        formularioValido = false;
    }

    if (!enlaceValido(enlaceActividad)) {
        mostrarError(enlaceActividadInput, "error-enlace-actividad", "Ingrese un enlace válido.");
        formularioValido = false;
    }

    if (formularioValido) {
        alert("Actividad registrada correctamente.");
        formActividad.reset();
        limpiarTodosLosErroresActividad();
    }
});