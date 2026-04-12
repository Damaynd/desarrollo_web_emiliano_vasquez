const rolSelect = document.getElementById("rol");

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

rolSelect.addEventListener("change", actualizarCamposPorRol);
actualizarCamposPorRol();