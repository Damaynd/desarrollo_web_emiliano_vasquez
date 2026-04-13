const formActividad = document.getElementById("form-actividad");

const nActInput = document.getElementById("nombre-actividad");
const tActInput = document.getElementById("tipo-actividad");
const descrActInput = document.getElementById("descripcion-actividad");
const daysActInput = document.querySelectorAll('input[name="dias"]');
const t0Input = document.getElementById("hora-inicio");
const tfInput = document.getElementById("hora-termino");
const archActInput = document.getElementById("archivo-actividad");


function showError(input, errorId, mensaje) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = mensaje;
    errorElement.hidden = false;

    if (input) {
        input.classList.add("input-error");
    }
}

function clearError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = "";
    errorElement.hidden = true;

    if (input) {
        input.classList.remove("input-error");
    }
}

function globalCleanErrAct() {
    clearError(nActInput, "error-nombre-actividad");
    clearError(tActInput, "error-tipo-actividad");
    clearError(descrActInput, "error-descripcion-actividad");
    clearError(null, "error-dias");
    clearError(t0Input, "error-hora-inicio");
    clearError(tfInput, "error-hora-termino");
    clearError(archActInput, "error-archivo-actividad");
}

function daySelected() {
    return Array.from(daysActInput).some(dia => dia.checked);
}


formActividad.addEventListener("submit", function (event) {
    event.preventDefault();
    globalCleanErrAct();

    let esValido = true;

    const nAct = nActInput.value.trim();
    const tAct = tActInput.value;
    const descrAct = descrActInput.value.trim();
    const t0 = t0Input.value;
    const tf = tfInput.value;
    const archivo = archActInput.files.length > 0;

    if (nAct.length < 3) {
        showError(nActInput, "error-nombre-actividad", "Ingrese un nombre válido.");
        esValido = false;
    }

    if (tAct === "") {
        showError(tActInput, "error-tipo-actividad", "Seleccione un tipo de actividad.");
        esValido = false;
    }

    if (descrAct.length < 10) {
        showError(descrActInput, "error-descripcion-actividad", "Ingrese una descripción más completa.");
        esValido = false;
    }

    if (!daySelected()) {
        showError(null, "error-dias", "Seleccione al menos un día.");
        esValido = false;
    }

    if (t0 === "") {
        showError(t0Input, "error-hora-inicio", "Ingrese una hora de inicio.");
        esValido = false;
    }

    if (tf === "") {
        showError(tfInput, "error-hora-termino", "Ingrese una hora de término.");
        esValido = false;
    }

    if (t0 !== "" && tf !== "" && tf <= t0) {
        showError(tfInput, "error-hora-termino", "La hora de término debe ser posterior a la de inicio.");
        esValido = false;
    }

    if (!archivo) {
        showError(archActInput, "error-archivo-actividad", "Debe adjuntar al menos una foto o video.");
        esValido = false;
    }

    if (esValido) {
        alert("Actividad registrada correctamente.");
        formActividad.reset();
        globalCleanErrAct();
    }
});