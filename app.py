from flask import Flask, render_template, request, redirect, url_for, flash
from database.db import SessionLocal
from database.models import Region, Comuna, Miembro, Actividad, Foto
from sqlalchemy import text
from datetime import datetime
from pathlib import Path
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.secret_key = "key-tarea2"

UPLOAD_FOLDER = Path("static/uploads")
UPLOAD_FOLDER.mkdir(parents = True, exist_ok = True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}

def archivo_permitido(filename):

    return (

        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

    )

def calcular_duracion(hora_inicio, hora_termino):

    formato = "%H:%M"
    inicio = datetime.strptime(hora_inicio, formato)
    termino = datetime.strptime(hora_termino, formato)
    diferencia = termino - inicio
    minutos_totales = int(diferencia.total_seconds() // 60)
    horas = minutos_totales // 60
    minutos = minutos_totales % 60
    return f"{horas:02d}:{minutos:02d}"

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
        comunas = (
            session.query(Comuna)
            .order_by(Comuna.nombre.asc()).all()
        )

        if request.method == "GET":

            return render_template(

                "registro.html",
                comunas = comunas,
                errores = {},
                datos = {},
                dias_seleccionados = []

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

        if not telefono:
            errores["telefono"] = "Ingrese un teléfono."
        elif not telefono.isdigit() or len(telefono) < 8:
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
        else:

            for archivo in archivos:

                if not archivo_permitido(archivo.filename):
                    errores["foto"] = "Formato de archivo no permitido."
                    break

        if errores:

            return render_template(

                "registro.html",
                comunas = comunas,
                errores = errores,
                datos = request.form,
                dias_seleccionados = dias

            )

        rutas_guardadas = []
        archivos_guardados = []

        try:

            for archivo in archivos:

                nombre_original = secure_filename(archivo.filename)
                nombre_unico = f"{uuid.uuid4().hex}_{nombre_original}"
                ruta_abs = app.config["UPLOAD_FOLDER"] / nombre_unico
                archivo.save(ruta_abs)
                rutas_guardadas.append(ruta_abs)

                archivos_guardados.append({

                    "ruta_archivo": f"uploads/{nombre_unico}",
                    "nombre_archivo": nombre_original

                })

            miembro = Miembro(

                nombre = nombre,
                email = email,
                telefono = telefono,
                fecha_registro = datetime.now(),
                comuna_id = int(comuna_id)

            )

            session.add(miembro)
            session.flush()

            duracion = calcular_duracion(hora_inicio, hora_termino)

            for dia in dias:

                actividad = Actividad(

                    miembro_id = miembro.id,
                    dia = dia,
                    hora_inicio = hora_inicio,
                    duracion = duracion,
                    tipo = tipo_actividad,
                    nombre = nombre_actividad,
                    descripcion = descripcion_actividad

                )

                session.add(actividad)
                session.flush()

                for archivo_guardado in archivos_guardados:

                    foto = Foto(

                        ruta_archivo = archivo_guardado["ruta_archivo"],
                        nombre_archivo = archivo_guardado["nombre_archivo"],
                        actividad_id = actividad.id

                    )

                    session.add(foto)

            session.commit()
            flash("Registro realizado correctamente.")
            return redirect(url_for("index"))

        except Exception:
            session.rollback()

            for ruta in rutas_guardadas:
                if ruta.exists():
                    ruta.unlink()

            errores["general"] = "Ocurrió un error al guardar el registro."

            return render_template(
                "registro.html",
                comunas = comunas,
                errores = errores,
                datos = request.form,
                dias_seleccionados = dias
            )

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