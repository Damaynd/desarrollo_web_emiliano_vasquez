fetch("navbar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar navbar.html");
    }
    return response.text();
  })
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  })
  .catch(error => console.error("Error cargando navbar:", error));