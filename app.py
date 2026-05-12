from flask import Flask, render_template, request
from database.db import SessionLocal
from database.models import Region, Comuna, Miembro, Actividad, Foto

app = Flask(__name__)

@app.route("/")
def index():
    
    session = SessionLocal()

    try:

        miembros = (
            session.query(Miembro)
            .order_by(Miembro.fecha_registro.desc())
            .limit(5)
            .all())

        return render_template("index.html", miembros = miembros)

    finally:

        session.close()

    

@app.route("/test-db")
def test_db():

    session = SessionLocal()

    try:

        result = session.execute(text("SELECT 1"))
        value = result.scalar()
        return f"Conexión OK. Resultado: {value}"

    finally:

        session.close()

@app.route("/test-regiones")
def test_regiones():

    session = SessionLocal()

    try:

        regiones = session.query(Region).limit(5).all()
        salida = "<h1>Regiones cargadas</h1><ul>"

        for region in regiones:

            salida += f"<li>{region.id} - {region.nombre}</li>"

        salida += "</ul>"

        return salida

    finally:

        session.close()

@app.route("/registro", methods = ["GET", "POST"])
def registro():

    session = SessionLocal()

    try:

        comunas = session.query(Comuna).order_by(Comuna.nombre.asc()).all()

        if request.method == "GET":

            return render_template(

                "registro.html",
                comunas = comunas,
                errores = {},
                datos = {}

            )

        errores = {}
        nombre = request.form.get("nombre", "").strip()
        email = request.form.get("email", "").strip()
        telefono = request.form.get("telefono", "").strip()
        comuna_id = request.form.get("comuna_id", "").strip()
        nombre_actividad = request.form.get("nombre_actividad", "").strip()
        tipo_actividad = request.form.get("tipo_actividad", "").strip()
        descripcion_actividad = request.form.get("descripcion_actividad", "").strip()
        dias = request.form.getlist("dias")
        hora_inicio = request.form.get("hora_inicio", "").strip()
        hora_termino = request.form.get("hora_termino", "").strip()

        archivos = [
            archivo for archivo in request.files.getlist("foto")
            if archivo and archivo.filename.strip() != ""
        ]

        if len(nombre) < 3:
            errores["nombre"] = "Ingrese un nombre válido."

        if "@" not in email or "." not in email:
            errores["email"] = "Ingrese un correo válido."

        if telefono and len(telefono) < 8:
            errores["telefono"] = "Ingrese un teléfono válido."

        if not comuna_id:
            errores["comuna_id"] = "Seleccione una comuna."

        if len(nombre_actividad) < 3:
            errores["nombre_actividad"] = "Ingrese un nombre de actividad válido."

        if not tipo_actividad:
            errores["tipo_actividad"] = "Seleccione un tipo de actividad."

        if len(descripcion_actividad) < 10:            
            errores["descripcion_actividad"] = "Ingrese una descripción más completa."

        if not dias:
            errores["dias"] = "Seleccione al menos un día."

        if not hora_inicio:
            errores["hora_inicio"] = "Ingrese una hora de inicio."

        if not hora_termino:
            errores["hora_termino"] = "Ingrese una hora de término."

        if hora_inicio and hora_termino and hora_termino <= hora_inicio:
            errores["hora_termino"] = "La hora de término debe ser posterior a la de inicio."

        if not archivos:
            errores["foto"] = "Debe adjuntar al menos una foto."

        if errores:

            return render_template(

                "registro.html",
                comunas = comunas,
                errores = errores,
                datos = request.form

            )

        return "<h1> Estamos listos papito !</h1>"

    finally:

        session.close()

@app.route("/actividades")
def actividades():
    return render_template("actividades.html")

@app.route("/miembros")
def miembros():
    return render_template("miembros.html")

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/contacto")
def contacto():
    return render_template("contacto.html")

if __name__ == '__main__':
    app.run(debug = True)