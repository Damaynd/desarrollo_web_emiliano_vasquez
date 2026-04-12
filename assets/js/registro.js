const form = document.getElementById("form-registro");

const nameInput = document.getElementById("name");
const rutInput = document.getElementById("rut");
const emailInput = document.getElementById("email");
const rolSelect = document.getElementById("rol");
const passwordInput = document.getElementById("password");
const pwConfirmationInput = document.getElementById("pw_confirmation");

const carreraContainer = document.getElementById("campo-carrera-container");
const carreraInput = document.getElementById("campo-carrera");
const carreraLabel = document.getElementById("label-carrera");

const departamentoContainer = document.getElementById("campo-departamento-container");
const departamentoInput = document.getElementById("campo-departamento");
const departamentoLabel = document.getElementById("label-departamento");

function actualizarCamposPorRol() {
    const rol = rolSelect.value;

    carreraContainer.style.display = "none";
    departamentoContainer.style.display = "none";

    carreraInput.value = "";
    departamentoInput.value = "";

    if (rol === "e_pregrado") {
        carreraContainer.style.display = "block";
        carreraLabel.textContent = "Carrera *";
    } else if (rol === "e_postgrado") {
        carreraContainer.style.display = "block";
        carreraLabel.textContent = "Programa *";
    } else if (rol === "docente") {
        departamentoContainer.style.display = "block";
        departamentoLabel.textContent = "Departamento *";
    } else if (rol === "funcionario") {
        departamentoContainer.style.display = "block";
        departamentoLabel.textContent = "Unidad o área *";
    }
}

function mostrarError(input, errorId, mensaje) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = mensaje;
    errorElement.hidden = false;
    input.classList.add("input-error");
}

function limpiarError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = "";
    errorElement.hidden = true;
    input.classList.remove("input-error");
}

function limpiarTodosLosErrores() {
    limpiarError(nameInput, "error-name");
    limpiarError(rutInput, "error-rut");
    limpiarError(emailInput, "error-email");
    limpiarError(rolSelect, "error-rol");
    limpiarError(carreraInput, "error-campo-carrera");
    limpiarError(departamentoInput, "error-campo-departamento");
    limpiarError(passwordInput, "error-password");
    limpiarError(pwConfirmationInput, "error-pw_confirmation");
}

function emailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function limpiarRut(rut) {
    return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
}

function rutValido(rut) {
    const rutLimpio = limpiarRut(rut);

    if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) {
        return false;
    }

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = "";

    if (resto === 11) {
        dvEsperado = "0";
    } else if (resto === 10) {
        dvEsperado = "K";
    } else {
        dvEsperado = String(resto);
    }

    return dv === dvEsperado;
}

function passwordValida(password) {
    return password.length >= 8;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    limpiarTodosLosErrores();

    let formularioValido = true;

    const nombre = nameInput.value.trim();
    const rut = rutInput.value.trim();
    const email = emailInput.value.trim();
    const rol = rolSelect.value;
    const carrera = carreraInput.value.trim();
    const departamento = departamentoInput.value.trim();
    const password = passwordInput.value;
    const pwConfirmation = pwConfirmationInput.value;

    if (nombre.length < 3) {
        mostrarError(nameInput, "error-name", "Ingrese un nombre completo válido.");
        formularioValido = false;
    }

    if (!rutValido(rut)) {
        mostrarError(rutInput, "error-rut", "Ingrese un RUT válido.");
        formularioValido = false;
    }

    if (!emailValido(email)) {
        mostrarError(emailInput, "error-email", "Ingrese un correo electrónico válido.");
        formularioValido = false;
    }

    if (rol === "") {
        mostrarError(rolSelect, "error-rol", "Seleccione un rol.");
        formularioValido = false;
    }

    if ((rol === "e_pregrado" || rol === "e_postgrado") && carrera === "") {
        mostrarError(carreraInput, "error-campo-carrera", "Complete este campo.");
        formularioValido = false;
    }

    if ((rol === "docente" || rol === "funcionario") && departamento === "") {
        mostrarError(departamentoInput, "error-campo-departamento", "Complete este campo.");
        formularioValido = false;
    }

    if (!passwordValida(password)) {
        mostrarError(passwordInput, "error-password", "La contraseña debe tener al menos 8 caracteres.");
        formularioValido = false;
    }

    if (pwConfirmation !== password) {
        mostrarError(pwConfirmationInput, "error-pw_confirmation", "Las contraseñas no coinciden.");
        formularioValido = false;
    }

    if (formularioValido) {
        alert("Formulario enviado correctamente.");
        form.reset();
        actualizarCamposPorRol();
        limpiarTodosLosErrores();
    }
});

rolSelect.addEventListener("change", actualizarCamposPorRol);
actualizarCamposPorRol();