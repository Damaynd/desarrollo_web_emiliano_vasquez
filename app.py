from flask import Flask, render_template
from sqlalchemy import text
from database.db import SessionLocal
from database.models import Region, Comuna, Miembro

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

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

@app.route("/registro")
def registro():
    return render_template("registro.html")

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