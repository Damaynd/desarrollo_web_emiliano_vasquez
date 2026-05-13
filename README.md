# Sistema de Gestión de Actividades DCC

## Aplicación web desarrollada para CC5002 - Desarrollo de Aplicaciones Web.

- El sistema permite registrar miembros de la comunidad DCC junto con las actividades que realizan, almacenar archivos asociados a estas actividades, consultar un listado de miembros y revisar el detalle de cada miembro con sus actividades y fotos.

## Autor

- **Nombre:** Emiliano Vásquez Parada
- **Correo:** evasquez@dcc.uchile.cl*
- **Teléfono:** +56 9 7874 9167


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

Esta versión del sistema corresponde a la evolución del prototipo de la Tarea 1 hacia una aplicación web con backend más guatón (robusto). A diferencia del producto inicial, que sólo simulaba este comportamiento con HTML, CSS y JS, esta versión incorpora:

- Flask para el servidor web y el manejo de rutas;
- Jinja2 para el renderizado de templates dinámicos;
- SQLAlchemy para representar y consultar entidades de la base de datos;
- MySQL como sistema para la DB;

La idea principal del diseño fue mantener el sistema simple y alineado con el enunciado.

## Arquitectura general y lógica del sistema

La lógica del proyecto está organizada en cuatro capas:

- `app.py`: capa lógica

    `app.py` implementa la lógica principal del servidor. Ahí se definen las rutas, se abre y cierra sesión con la base, se validan datos Server-Side, se guardan archivos, se insertan registros y se renderizan templates. También implementa más cosas como:

    - Validación de extensiones de archivo;
    - Cálculo de duración de una actividad a partir de hora inicio y hora término;
    - Páginas con listado de miembros.

    Concentramos la lógica en este único archivo ya que el proyecto no es tan grande como para pensar en compartimentalizar

- `models.py`: representación de nuestro dominio
    
    `models.py` modela las tablas del sistema:
        - Region
        - Comuna
        - Miembro
        - Actividad
        - Foto
    
    y sus relaciones:

        - una región tiene muchas comunas;
        - una comuna tiene muchos miembros;
        - un miembro tiene muchas actividades;
        - una actividad tiene muchas fotos.

    La lógica aquí no es de interfaz, sino de estructura del dominio y navegación entre entidades.

- `templates/`: capa de presentación

    Los templates se usan para renderizar el HTML desde el servidor. Hay herencia con respecto a:

        - `base.html`
        - `partials/navbar.html`

    para evitar repetir navegación y estructura general en cada vista. Esta refactorización fue importante porque, una vez que el proyecto dejó de ser estático, ya no tenía sentido mantener la misma navbar copiada en cada archivo HTML.

- `static/`: recursos estáticos

    Aquí se agrupan:
        - CSS;
        - JS
        - Archivos subidos por los usuarios (`static/uploads`)

    La separación entre `templates/` y `static/` sigue el patrón habitual de Flask y mantiene orden entre estructura HTML, lógica visual y recursos.

## Decisiones de diseño importantes

### Unificar “registro de miembro” y “registro de actividad”

En la Tarea 1 existían formularios separados para registrar miembros y actividades. En esta versión se decidió unificar ambos en una sola vista (`registro.html`) y en una sola ruta (`/registro`), ya que el enunciado pedía explícitamente una funcionalidad de “Registrar miembro y actividades” atendida por Flask.

Esta decisión evita un problema mayor de diseño: si el formulario de actividades hubiera permanecido separado, entonces habría sido necesario saber qué usuario está “logueado” o a qué miembro asociar la actividad. Implementar eso correctamente habría requerido autenticación o un manejo de sesión mucho más complejo.

Por eso se optó por una solución intermedia:

- una sola vista;
- dos bloques de datos;
- un solo envío;
- una sola operación de registro completa.

### Una actividad por cada día seleccionado

El formulario permite seleccionar varios días. Como la tabla actividad trabaja con un solo valor día por fila, la decisión fue crear una fila de actividad por cada día seleccionado.

Ejemplo:

Si el usuario selecciona Lunes, Miércoles y Viernes:
    - se crea un solo Miembro.
    - tres filas distintas en Actividad.

Todas éstas asociadas al mismo miembro.

### Calcular duracion en servidor

La base almacena hora_inicio y duracion, no hora_termino. Por eso se creó en app.py la función calcular_duracion(hora_inicio, hora_termino), que transforma las horas ingresadas por el usuario a un formato HH:MM.

La decisión de calcular esto en servidor permite:

- mantener coherencia con la base de datos;
- no depender del cliente para una parte importante de la lógica;
- dejar explícita la transformación de datos.

### Validación doble: cliente y servidor

Una parte importante del diseño fue mantener el mismo comportamiento visible del prototipo de Tarea 1 en el formulario, pero agregando una capa de seguridad y consistencia. Por eso:

- `registro.js` valida en cliente y evita el submit si detecta errores;
- `app.py` vuelve a validar antes de guardar archivos e insertar datos.

La lógica detrás de esta decisión es que JS mejora la experiencia de usuario, pero no puede ser el único mecanismo de validación, ya que el cliente puede modificar el request o incluso desactivar JS.

### Guardar archivos en static/uploads

En el backend se decidió guardar los archivos subidos en static/uploads, utilizando:

- secure_filename(...).
- un prefijo con uuid.
- luego almacenando la ruta relativa en la tabla foto.

Esto resuelve dos problemas:

- evita colisiones entre archivos con el mismo nombre.
- y deja las fotos accesibles luego desde la carpeta estática.

## Explicación por archivos principales

`app.py`:

Es el archivo más importante del sistema. Su lógica se puede resumir como:

- En `/` obtiene los últimos cinco miembros registrados y los envía a index.html;
- En `/registro`:
- Carga comunas;
- Valida el formulario;
- Guarda archivos;
- Crea un Miembro;
- Calcula duración;
- Crea una Actividad por cada día;
- Crea las Fotos asociadas;
- Jace commit() si todo sale bien;
- Hace rollback() y re-renderiza el formulario si algo falla;
- En `/miembros` obtiene miembros desde la base con paginación usando offset y limit;
- En `/miembros/<id>` muestra el detalle del miembro.

`models.py`:

Aquí se decidió reflejar las entidades mínimas necesarias para el sistema y sus relaciones. La principal utilidad de este módulo es permitir que Flask y Jinja naveguen las relaciones sin escribir SQL manualmente en cada vista.

`base.html`:

Se creó para desacoplar la estructura repetida del proyecto. Contiene:

- Head
- CSS comunes
- Inclusión de navbar
- Bloques title, extra_css, content y extra_js.

La lógica de diseño aquí es evitar código duplicado y tratar de ser lo más estructurado posible.

`partials/navbar.html`:

Extrajimos la barra de navegación a un módulo desacoplado.

`index.html`:

La portada cumple dos funciones:

- Sirve como menú principal del sistema;
- Muestra los últimos cinco miembros registrados y un mensaje de éxito si se realizó un registro correctamente.


`registro.html`:

Es la vista más importante del proyecto. Reúne dos responsabilidades:

- Datos del miembro;
- Datos de la actividad.

Además, está preparada para trabajar con:

- Validación cliente mediante <p hidden> e id's específicos para JS;
- Validación servidor mediante mensajes en Jinja.


`miembros.html`

Se rediseñó para mostrar un listado real alimentado por la base de datos. Muestra:

- Nombre;
- Correo;
- Teléfono; 
- Comuna;
- Fecha;
- Enlaces al detalle del miembro.

`detalle_miembro.html`:

Esta vista aprovecha directamente las relaciones del modelo. Permite mostrar:

- Datos del miembro;
- Actividades asociadas;
- Archivos vinculados a cada actividad.

`estadisticas.html`:

Tal cual dice el enunciado, se implementará mejor más tarde; es una feature legacy de Tarea 1.

`contacto.html`:

Es una vista simple con mis datos :D.

## Organización del CSS

Se decidió separar la presentación por responsabilidades:

- `styles.css`: reglas globales del sitio, colores base, tipografías, contenedores generales y secciones;
- `navbar.css`: estilos exclusivos de la barra de navegación;
- `forms.css`: estilos del formulario de registro, errores, fieldset de días y resaltado de inputs inválidos;
- `tables.css`: estilos de la tabla de miembros y la paginación;
- `index.css`: estilos de portada y del bloque de últimos miembros;
- `stats.css`: estilos de gráficos placeholder para estadísticas.

## Organización del frontend con JS

El JS principal del sistema se concentra en el formulario de registro. La lógica de `registro.js` sigue la misma idea del producto original:

- Toma referencias a los campos del formulario;
- Limpia errores previos;
- Valida los campos uno a uno;
- Muestra mensajes específicos por campo;
- Sólo cancela el submit si el formulario no es válido.

La decisión fue adaptar esa lógica anterior modificando lo menos posible, cosa de conservar el comportamiento esperado y no complicarse con el código. Esto permitió que el formulario siguiera sintiéndose como el de la tarea pasada.

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




