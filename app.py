from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import func, or_
from sqlalchemy.orm import joinedload, selectinload
from database.db import SessionLocal
from database.models import Comuna, Miembro, Actividad, Foto, Comentario, Nota
from datetime import datetime
from pathlib import Path
import uuid
from werkzeug.utils import secure_filename
from math import ceil

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

def serializar_comentario(comentario):

    return {
        "id": comentario.id,
        "nombre": comentario.nombre,
        "texto": comentario.texto,
        "fecha": comentario.fecha.strftime("%d-%m-%Y %H:%M")}


def resumen_nota_desde_notas(notas):

    cantidad = len(notas)

    if cantidad == 0:

        return {
            "nota": "-",
            "cantidad_notas": 0}

    promedio = sum(nota.nota for nota in notas) / cantidad

    return {
        "nota": f"{promedio:.1f}",
        "cantidad_notas": cantidad}

def obtener_resumen_nota(session, actividad_id):

    cantidad, promedio = (
        session.query(func.count(Nota.id), func.avg(Nota.nota))
        .filter(Nota.actividad_id == actividad_id)
        .one())

    cantidad = int(cantidad or 0)

    if cantidad == 0:

        return {
            "nota": "-",
            "cantidad_notas": 0}

    return {
        "nota": f"{float(promedio):.1f}",
        "cantidad_notas": cantidad}

def serializar_actividad_busqueda(actividad):

    resumen = resumen_nota_desde_notas(actividad.notas)

    return {
        "id": actividad.id,
        "miembro": actividad.miembro.nombre,
        "dia": actividad.dia,
        "tipo": actividad.tipo,
        "comuna": actividad.miembro.comuna.nombre,
        "nombre": actividad.nombre,
        "descripcion": actividad.descripcion,
        "nota": resumen["nota"],
        "cantidad_notas": resumen["cantidad_notas"]}

def convertir_nota(valor):

    if isinstance(valor, bool):

        return None

    if isinstance(valor, int):

        return valor

    if isinstance(valor, str) and valor.strip().isdigit():

        return int(valor.strip())

    return None

@app.route("/")
def index():
    
    session = SessionLocal()

    try:

        miembros = (
            session.query(Miembro)
            .order_by(Miembro.fecha_registro.desc())
            .limit(5)
            .all()
        )

        return render_template("index.html", miembros = miembros)

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

            errores["nombre"] = "Ingrese un nombre válido >8("

        if "@" not in email or "." not in email:

            errores["email"] = "Ingrese un correo válido >8("

        if not telefono:

            errores["telefono"] = "Ingrese un teléfono >8("

        elif not telefono.isdigit() or len(telefono) < 8:

            errores["telefono"] = "Ingrese un teléfono válido >8("

        if not comuna_id:
            errores["comuna_id"] = "Seleccione una comuna >8("

        if len(nombre_actividad) < 3:

            errores["nombre_actividad"] = "Ingrese un nombre de actividad válido >8("

        if not tipo_actividad:

            errores["tipo_actividad"] = "Seleccione un tipo de actividad >8("

        if len(descripcion_actividad) < 10:

            errores["descripcion_actividad"] = "Ingrese una descripción más completa >8("

        if not dias:

            errores["dias"] = "Seleccione al menos un día para la actividad >8("

        if not hora_inicio:

            errores["hora_inicio"] = "Ingrese una hora de inicio >8("

        if not hora_termino:

            errores["hora_termino"] = "Ingrese una hora de término >8("

        if hora_inicio and hora_termino and hora_termino <= hora_inicio:

            errores["hora_termino"] = "La hora de término debe ser posterior a la de inicio >8("

        if not archivos:

            errores["foto"] = "Debe adjuntar al menos una foto >8("

        else:

            for archivo in archivos:

                if not archivo_permitido(archivo.filename):

                    errores["foto"] = "Formato de archivo no permitido >8("

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

        except Exception as e:
            session.rollback()

            for ruta in rutas_guardadas:
                if ruta.exists():
                    ruta.unlink()

            app.logger.exception("Error al guardar el registro")

            errores["general"] = f"Hubo un error al procesar su registro u u"

            return render_template(
                "registro.html",
                comunas = comunas,
                errores = errores,
                datos = request.form,
                dias_seleccionados = dias
        )

    finally:
        session.close()


@app.route("/miembros")
def miembros():
    session = SessionLocal()

    try:
        page = request.args.get("page", 1, type = int)
        per_page = 5

        total_miembros = session.query(Miembro).count()
        total_pages = max(1, ceil(total_miembros / per_page))

        if page < 1:
            page = 1
        if page > total_pages:
            page = total_pages

        offset = (page - 1) * per_page

        miembros = (
            session.query(Miembro)
            .order_by(Miembro.fecha_registro.desc())
            .offset(offset)
            .limit(per_page)
            .all()
        )

        return render_template(
            "miembros.html",
            miembros = miembros,
            page = page,
            total_pages = total_pages
        )

    finally:
        session.close()


@app.route("/miembros/<int:id>")
def detalle_miembro(id):

    session = SessionLocal()

    try:
        miembro = session.query(Miembro).filter(Miembro.id == id).first()

        if not miembro:
            return "<h1> Miembro no encontrado </h1>", 404

        return render_template("detalle_miembro.html", miembro = miembro)

    finally:
        session.close()


@app.route("/buscador")
def buscador():

    return render_template("buscador.html")


@app.route("/api/estadisticas")
def api_estadisticas():
    session = SessionLocal()

    try:
        fecha_registro = func.date(Miembro.fecha_registro)

        miembros_por_dia = (
            session.query(fecha_registro, func.count(Miembro.id))
            .group_by(fecha_registro)
            .order_by(fecha_registro.asc())
            .all()
        )

        actividades_por_tipo = (
            session.query(Actividad.tipo, func.count(Actividad.id))
            .group_by(Actividad.tipo)
            .order_by(Actividad.tipo.asc())
            .all()
        )

        actividades_por_comuna = (
            session.query(Comuna.nombre, func.count(Actividad.id))
            .join(Miembro, Miembro.comuna_id == Comuna.id)
            .join(Actividad, Actividad.miembro_id == Miembro.id)
            .group_by(Comuna.id, Comuna.nombre)
            .order_by(Comuna.nombre.asc())
            .all()
        )

        return jsonify({
            "miembros_por_dia": [
                {"fecha": str(fecha), "cantidad": cantidad}
                for fecha, cantidad in miembros_por_dia
            ],
            "actividades_por_tipo": [
                {"tipo": tipo, "cantidad": cantidad}
                for tipo, cantidad in actividades_por_tipo
            ],
            "actividades_por_comuna": [
                {"comuna": comuna, "cantidad": cantidad}
                for comuna, cantidad in actividades_por_comuna
            ]
        })

    finally:
        session.close()


@app.route("/api/actividades/<int:actividad_id>/comentarios", methods = ["GET", "POST"])
def comentarios_actividad(actividad_id):

    session = SessionLocal()

    try:
        actividad = session.get(Actividad, actividad_id)

        if not actividad:

            return jsonify({"error": "Actividad no encontrada"}), 404

        if request.method == "GET":

            comentarios = (
                session.query(Comentario)
                .filter(Comentario.actividad_id == actividad_id)
                .order_by(Comentario.fecha.desc())
                .all()
            )

            return jsonify({

                "comentarios": [
                    serializar_comentario(comentario)
                    for comentario in comentarios
                ]
            })

        datos = request.get_json(silent = True) or {}
        nombre = datos.get("nombre", "").strip()
        texto = datos.get("texto", "").strip()
        errores = {}

        if len(nombre) < 3 or len(nombre) > 80:

            errores["nombre"] = "El nombre debe tener entre 3 y 80 caracteres."

        if len(texto) < 5:

            errores["texto"] = "El comentario debe tener al menos 5 caracteres."

        elif len(texto) > 300:

            errores["texto"] = "El comentario no puede superar los 300 caracteres."

        if errores:

            return jsonify({"errores": errores}), 400

        comentario = Comentario(
            nombre = nombre,
            texto = texto,
            fecha = datetime.now(),
            actividad_id = actividad_id
        )

        session.add(comentario)
        session.commit()

        return jsonify({

            "mensaje": "Comentario agregado correctamente.",
            "comentario": serializar_comentario(comentario)

        }), 201

    finally:

        session.close()

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/contacto")
def contacto():
    return render_template("contacto.html")

if __name__ == '__main__':
    app.run(debug = True)