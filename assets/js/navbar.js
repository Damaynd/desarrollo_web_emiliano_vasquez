fetch("partials/navbar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar la navbar");
    }
    return response.text();
  })
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  })
  .catch(error => console.error(error));