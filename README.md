# Sistema de Gestión de Actividades DCC

## Aplicación web desarrollada para CC5002 - Desarrollo de Aplicaciones Web.

- El sistema permite registrar miembros de la comunidad DCC junto con las actividades que realizan, almacenar archivos asociados a esas actividades, consultar un listado paginado de miembros y revisar el detalle de cada miembro con sus actividades y fotos.

## Autor

- **Nombre:** Emiliano Vásquez Parada
- **Correo:** evasquez@dcc.uchile.cl*
- **Teléfono:** +56 9 7874 9167

## Cómo ejecutar el proyecto

1. Crear y activar entorno virtual

```python
python -m venv .vev
.\.venv\Scripts\activate
```

2. Instalar dependencias
```python
pip install -r requirements.txt
```
3. Configurar MySQL

Cargar en la base:

- `tarea2.sql`
- `region-comuna.sql`

y dejar configurada correctamente la conexión en `database/db.py`.

4. Ejecutar Flask

```python
python app.py
```

Luego abrir:
http://127.0.0.1:5000

## Descripción general del proyecto

Esta versión del sistema corresponde a la evolución del prototipo de la Tarea 1 hacia una aplicación web con backend real. A diferencia del prototipo inicial, que solo simulaba comportamiento con HTML, CSS y JavaScript, esta versión incorpora:

- Flask para el servidor web y el manejo de rutas;
- Jinja2 para renderizar templates dinámicos;
- SQLAlchemy ORM para representar y consultar entidades de la base de datos;
- MySQL como sistema de persistencia;
- JavaScript para mantener las validaciones del lado cliente.

La idea principal del diseño fue mantener el sistema simple, legible y alineado con el enunciado, evitando introducir complejidad innecesaria como autenticación, sesiones de usuario o módulos demasiado sofisticados.

## Arquitectura general y lógica del sistema

La lógica del proyecto está organizada en cuatro capas simples:

- `app.py`: capa de orquestación

    `app.py` centraliza la lógica principal del servidor. Ahí se definen las rutas, se abre y cierra sesión con la base, se validan datos del lado servidor, se guardan archivos, se insertan registros y se renderizan templates. También concentra lógica auxiliar como:

    - Validación básica de extensiones de archivo;
    - Cálculo de duración de una actividad a partir de hora inicio y hora término;
    - Paginación del listado de miembros.

    La decisión de concentrar esta lógica en un solo archivo se tomó porque el sistema aún está en una escala pequeña y así resulta más fácil de seguir, explicar y depurar.

- `models.py`: representación del dominio
    
    `models.py` modela directamente las tablas relevantes del sistema:
        - Region
        - Comuna
        - Miembro
        - Actividad
        - Foto
    
    y sus relaciones ORM:

        - una región tiene muchas comunas;
        - una comuna tiene muchos miembros;
        - un miembro tiene muchas actividades;
        - una actividad tiene muchas fotos.

    La lógica aquí no es de interfaz, sino de estructura del dominio y navegación entre entidades. Esto permite hacer consultas más expresivas desde Flask, por ejemplo acceder desde un miembro a sus actividades o desde una actividad a sus fotos.

- `templates/`: capa de presentación

    Los templates se usan para renderizar el HTML desde servidor. Se decidió usar herencia de templates con:

        - `base.html`
        - `partials/navbar.html`

    para evitar repetir navegación y estructura general en cada vista. Esta refactorización fue importante porque, una vez que el proyecto dejó de ser estático, ya no tenía sentido mantener la misma navbar copiada en cada archivo HTML.

- `static/`: recursos estáticos

    Aquí se agrupan:
        - CSS;
        - JS
        - Archivos subidos por los usuarios (`static/uploads`)

    La separación entre templates/ y static/ sigue el patrón habitual de Flask y permite mantener orden entre estructura HTML, lógica visual y recursos permanentes.


## Decisiones de diseño importantes

### Unificar “registro de miembro” y “registro de actividad”

En la Tarea 1 existían formularios separados para registrar miembros y actividades. En esta versión se decidió unificar ambos en una sola vista (registro.html) y en una sola ruta (/registro), porque el enunciado pide explícitamente una funcionalidad de “Registrar miembro y actividades” atendida por Flask.

Esta decisión evita un problema mayor de diseño: si el formulario de actividades hubiera permanecido separado, entonces habría sido necesario saber qué usuario está “logueado” o a qué miembro asociar la actividad. Implementar eso correctamente habría requerido autenticación, manejo de sesión o algún mecanismo extra de identificación, lo que escapaba del foco principal de esta tarea.

Por eso se optó por una solución intermedia:

- una sola vista;
- dos bloques conceptuales de datos;
- un solo envío;
- y una sola operación de registro completa.

### Una actividad por cada día seleccionado

El formulario permite seleccionar varios días. Como la tabla actividad trabaja con un solo valor dia por fila, la decisión fue crear una fila de actividad por cada día seleccionado.

Ejemplo:

- si el usuario selecciona lunes, miércoles y viernes,
- se crea un solo Miembro,
- pero tres filas distintas en Actividad,
- todas asociadas al mismo miembro.

Esta decisión se adoptó para respetar el esquema de la base y mantener un modelo claro y consultable.

### Calcular duracion en servidor

La base almacena hora_inicio y duracion, no hora_termino. Por eso se creó en app.py la función calcular_duracion(hora_inicio, hora_termino), que transforma las horas ingresadas por el usuario a un formato de duración HH:MM.

La decisión de calcular esto en servidor permite:

- mantener coherencia con la base de datos;
- no depender del cliente para una parte importante de la lógica;
- y dejar explícita la transformación de datos.

### Validación doble: cliente y servidor

Una parte importante del diseño fue mantener el mismo comportamiento visible del prototipo de Tarea 1 en el formulario, pero agregando una segunda capa de seguridad y consistencia. Por eso:

- `registro.js` valida en cliente y evita el submit si detecta errores;
- `app.py` vuelve a validar antes de guardar archivos e insertar datos.

La lógica detrás de esta decisión es que JavaScript mejora la experiencia de usuario, pero no puede ser la única capa de validación, ya que el cliente puede modificar el request o incluso desactivar JS.

### Guardar archivos en static/uploads

En el backend se decidió guardar los archivos subidos en static/uploads, utilizando:

- secure_filename(...)
- un prefijo con uuid
- y luego almacenando la ruta relativa en la tabla foto.

Esto resuelve dos problemas:

- evita colisiones entre archivos con el mismo nombre;
- y deja las fotos accesibles luego desde la carpeta estática de Flask.

## Explicación por archivos principales

`app.py`:

Es el archivo más importante del sistema. Su lógica se puede resumir así:

- en `/` obtiene los últimos cinco miembros registrados y los envía a index.html;
- en `/registro`:
- carga comunas;
- valida el formulario;
- guarda archivos;
- crea un Miembro;
- calcula duración;
- crea una Actividad por cada día;
- crea las Foto asociadas;
- hace commit() si todo sale bien;
- hace rollback() y re-renderiza el formulario si algo falla;
- en `/miembros` obtiene miembros desde la base con paginación usando offset y limit;
- en `/miembros/<id>` muestra el detalle del miembro y sus relaciones ORM.

`models.py`:

Aquí se decidió reflejar las entidades mínimas necesarias para el sistema y sus relaciones reales. La principal utilidad de este archivo es permitir que Flask y Jinja naveguen las relaciones sin escribir SQL manualmente en cada vista.

`base.html`:

Se creó para desacoplar la estructura repetida del proyecto. Centraliza:

- head
- CSS comunes
- inclusión de navbar
- bloques title, extra_css, content y extra_js.

La lógica de diseño aquí es reducir duplicación y facilitar cambios globales.

`partials/navbar.html`:

Extrae la navegación principal a un archivo único. Esto evita repetir la misma navbar en todas las vistas y permite cambiarla una sola vez.

`index.html`:

La portada cumple dos funciones:

- servir como menú principal del sistema;
- mostrar los últimos cinco miembros registrados y el mensaje de éxito tras un registro correcto.

Se decidió mantenerla simple y clara, con secciones tipo tarjeta.

`registro.html`:

Es la vista más importante del proyecto. Reúne dos responsabilidades:

- datos del miembro;
- datos de la actividad.

Además, está preparada para trabajar con:

- validación cliente mediante <p hidden> e ids específicos para JS;
- validación servidor mediante mensajes renderizados por Jinja.

Se privilegió mantener una estructura simple y directa, sin capas extra innecesarias.

`miembros.html`

Se rediseñó para pasar desde una tabla mock de la Tarea 1 a un listado real alimentado por la base de datos. Muestra:

- nombre;
- correo;
- teléfono; 
- comuna;
- fecha;
- y enlaces al detalle del miembro.

`detalle_miembro.html`:

Esta vista aprovecha directamente las relaciones ORM del modelo. Permite mostrar:

- datos del miembro;
- actividades asociadas;
- archivos vinculados a cada actividad.

`estadisticas.html`:

Se dejó como una base visual mínima. La decisión aquí fue no invertir tiempo en una implementación completa porque esta parte quedó fuera del foco principal de la tarea actual.

`contacto.html`:

Es una vista simple con los datos del desarrollador. Su función es informativa y sirve como cierre del sistema.

## Organización del CSS

Se decidió separar la presentación por responsabilidades:

- `styles.css`: reglas globales del sitio, colores base, tipografías, contenedores generales y secciones;
- `navbar.css`: estilos exclusivos de la barra de navegación;
- `forms.css`: estilos del formulario de registro, errores, fieldset de días y resaltado de inputs inválidos;
- `tables.css`: estilos de la tabla de miembros y la paginación;
- `index.css`: estilos de portada y del bloque de últimos miembros;
- `stats.css`: estilos de gráficos placeholder para estadísticas.

La decisión aquí fue no concentrar todo en una sola hoja, para mantener el proyecto entendible y más fácil de ajustar por vista.

## Organización del frontend con JS

El JavaScript principal del sistema se concentra hoy en el formulario de registro. La lógica de registro.js sigue la misma idea del prototipo original:

- toma referencias a los campos del formulario;
- limpia errores previos;
- valida los campos uno a uno;
- muestra mensajes específicos por campo;
- y sólo cancela el submit si el formulario no es válido.

La decisión fue adaptar esa lógica anterior tocando lo menos posible, para conservar el comportamiento visible esperado y no sobrecomplicar el código. Esto permitió que el formulario siguiera sintiéndose “igual que en Tarea 1”, pero ahora conectado a backend real.

## Funcionalidades implementadas

- Portada
- Navegación principal
- Mensaje de éxito
- Últimos cinco miembros registrados
- Registro
- Formulario unificado
- Validación en cliente y servidor
- Guardado de archivos
- Inserción en miembro, actividad y foto
- Miembros
- Listado paginado
- Consulta real a la BD
- Enlace al detalle
- Detalle
- Datos del miembro
- Actividades asociadas
- Fotos asociadas
- Contacto
- Información del autor
- Estadísticas

## Estructura del proyecto
T1/
├── app.py
├── requirements.txt
├── README.md
├── database/
│   ├── db.py
│   ├── models.py
│   └── sql/
│       ├── tarea2.sql
│       └── region-comuna.sql
├── static/
│   ├── css/
│   │   ├── styles.css
│   │   ├── navbar.css
│   │   ├── forms.css
│   │   ├── tables.css
│   │   ├── stats.css
│   │   └── index.css
│   ├── js/
│   │   ├── registro.js
│   │   └── estadisticas.js
│   └── uploads/
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── registro.html
│   ├── miembros.html
│   ├── detalle_miembro.html
│   ├── estadisticas.html
│   ├── contacto.html
│   └── partials/
│       └── navbar.html
└── .gitignore


