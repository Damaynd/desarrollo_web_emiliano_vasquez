const form = document.getElementById("form-registro");

const nInput = document.getElementById("name");
const rInput = document.getElementById("rut");
const eInput = document.getElementById("email");
const rSelect = document.getElementById("rol");
const pwInput = document.getElementById("password");
const pwConfirmInput = document.getElementById("pw_confirmation");
const careerCont = document.getElementById("campo-carrera-container");
const careerInput = document.getElementById("campo-carrera");
const careerLabel = document.getElementById("label-carrera");
const deptoCont = document.getElementById("campo-departamento-container");
const deptoInput = document.getElementById("campo-departamento");
const deptoLabel = document.getElementById("label-departamento");

function actFieldsByRole() {

    const rol = rSelect.value;
    careerCont.style.display = "none";
    deptoCont.style.display = "none";
    careerInput.value = "";
    deptoInput.value = "";

    if (rol === "e_pregrado") {
        careerCont.style.display = "block";
        careerLabel.textContent = "Carrera *";

    } else if (rol === "e_postgrado") {
        careerCont.style.display = "block";
        careerLabel.textContent = "Programa *";

    } else if (rol === "docente") {
        deptoCont.style.display = "block";
        deptoLabel.textContent = "Departamento *";

    } else if (rol === "funcionario") {
        deptoCont.style.display = "block";
        deptoLabel.textContent = "Unidad o área *";
    }
}

function showErr(input, errorId, mensaje) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = mensaje;
    errorElement.hidden = false;
    input.classList.add("input-error");
}

function cleanErr(input, errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = "";
    errorElement.hidden = true;
    input.classList.remove("input-error");
}

function globalCleanErr() {
    cleanErr(nInput, "error-name");
    cleanErr(rInput, "error-rut");
    cleanErr(eInput, "error-email");
    cleanErr(rSelect, "error-rol");
    cleanErr(careerInput, "error-campo-carrera");
    cleanErr(deptoInput, "error-campo-departamento");
    cleanErr(pwInput, "error-password");
    cleanErr(pwConfirmInput, "error-pw_confirmation");
}

function eValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function cleanRut(rut) {
    return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
}

function rValido(rut) {
    const rutLimpio = cleanRut(rut);

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

function pwValida(password) {
    return password.length >= 8;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    globalCleanErr();

    let formEsValido = true;

    const nombre = nInput.value.trim();
    const rut = rInput.value.trim();
    const email = eInput.value.trim();
    const rol = rSelect.value;
    const carrera = careerInput.value.trim();
    const departamento = deptoInput.value.trim();
    const password = pwInput.value;
    const pwConfirmation = pwConfirmInput.value;

    if (nombre.length < 3) {
        showErr(nInput, "error-name", "Ingrese un nombre completo válido.");
        formEsValido = false;
    }

    if (!rValido(rut)) {
        showErr(rInput, "error-rut", "Ingrese un RUT válido !");
        formEsValido = false;
    }

    if (!eValido(email)) {
        showErr(eInput, "error-email", "Ingrese un correo electrónico válido !");
        formEsValido = false;
    }

    if (rol === "") {
        showErr(rSelect, "error-rol", "Seleccione un rol !");
        formEsValido = false;
    }

    if ((rol === "e_pregrado" || rol === "e_postgrado") && carrera === "") {
        showErr(careerInput, "error-campo-carrera", "Complete este campo !");
        formEsValido = false;
    }

    if ((rol === "docente" || rol === "funcionario") && departamento === "") {
        showErr(deptoInput, "error-campo-departamento", "Complete este campo !");
        formEsValido = false;
    }

    if (!pwValida(password)) {
        showErr(pwInput, "error-password", "La contraseña debe tener al menos 8 caracteres !");
        formEsValido = false;
    }

    if (pwConfirmation !== password) {
        showErr(pwConfirmInput, "error-pw_confirmation", "Las contraseñas no coinciden !");
        formEsValido = false;
    }

    if (formEsValido) {
        alert("Formulario enviado correctamente !");
        form.reset();
        actFieldsByRole();
        globalCleanErr();
    }
});

rSelect.addEventListener("change", actFieldsByRole);
actFieldsByRole();