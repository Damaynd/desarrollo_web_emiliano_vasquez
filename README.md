# Sistema de Gestion de Actividades DCC

## AppWeb Tarea 4 CC5002-2 - Desarrollo de Aplicaciones Web

El sistema permite registrar miembros de la comunidad DCC junto con las actividades que realizan, almacenar archivos asociados a estas actividades, consultar un listado de miembros, revisar el detalle de cada miembro con sus actividades y fotos, visualizar estadíssticas del sistema, agregar comentarios a las actividades registradas, buscar actividades y evaluarlas con notas.

## Autor

- **Nombre:** Emiliano Vasquez Parada
- **Correo:** evasquez@dcc.uchile.cl
- **Telefono:** +56 9 7874 9167

## Estructura del proyecto

```text
T1/
├── app.py
├── requirements.txt
├── README.md
├── database/
│   ├── db.py
│   ├── models.py
│   └── sql/
│       ├── tarea2.sql
│       ├── tabla-comentario.sql
│       ├── tabla-nota.sql
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
│   │   ├── estadisticas.js
│   │   └── comentarios.js
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
├── tarea4/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/tarea4/
│           └── resources/
└── .gitignore
```

## Como ejecutar el proyecto

1. Crear y activar entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

Si PowerShell bloquea la activacion del entorno:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\activate
```

2. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

3. Configurar MySQL:

Cargar en la base los archivos:

- `database/sql/tarea2.sql`
- `database/sql/region-comuna.sql`
- `database/sql/tabla-comentario.sql`
- `database/sql/tabla-nota.sql`

El archivo `tarea2.sql` crea la estructura base de Tarea 2. Si la base ya tiene datos que se quieren conservar, no se debe ejecutar nuevamente porque elimina y recrea el esquema `tarea2`.

La conexión se configura en `database/db.py`:

```python
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
```

4. Ejecutar Flask:

```powershell
python app.py
```

Luego abrir:

```text
http://127.0.0.1:5000
```

5. Ejecutar la parte de Tarea 4 con Spring Boot:

```powershell
cd tarea4
.\mvnw.cmd spring-boot:run
```

Luego abrir:

```text
http://localhost:8080/buscador
```

## Descripción general del proyecto

La Tarea 3 agrega dos bloques principales:

- Estadísticas generadas en el cliente con JS, obteniendo los datos desde Flask;
- Comentarios asíncronos asociados a cada actividad extraprogramática.

La Tarea 4 agrega sobre eso, pero en un proyecto Spring Boot separado dentro de `tarea4/`:

- Un buscador de actividades que consulta por nombre, descripción o comuna cuando el usuario escribe al menos 3 caracteres;
- Un sistema de notas para evaluar actividades de forma asíncrona y actualizar la nota mostrada sin recargar la página

Flask se mantiene como la aplicación principal paa las funcionalidades anteriores. Spring Boot se conecta a la misma base `tarea2`, lee las actividades ya registradas y guarda las notas en la tabla `nota`.

La idea general del diseño fue mantener la estructura cercana a la que ya existia, pero separando claramente:

- Rutas HTML renderizadas con Jinja;
- Rutas JSON consumidas con `fetch`;
- Modelos de base de datos;
- Archivos estáticos de CSS y JS.

## Arquitectura general y lógica del sistema

La lógica del proyecto esta organizada en cuatro capas:

- `app.py`: capa principal del servidor.

    Aquí se definen las rutas HTML, los endpoints JSON, las validaciones server-side, la apertura y cierre de sesiones de base de datos, la inserción de registros y la serialización de datos que luego consume JS

    Para Tarea 3 se agregaron:

    - `serializar_comentario(comentario)`, que transforma un comentario SQLAlchemy en un objeto JSON simple;
    - `/api/estadisticas`, que entrega en una sola respuesta los datos de los tres gráficos;
    - `/api/actividades/<int:actividad_id>/comentarios`, que permite listar y crear comentarios asociados a una actividad

    La Tarea 4 no se implementa en Flask para evitar duplicar rutas y lógica. Desde Flask sólo se deja el enlace hacia el buscador de Spring Boot

- `models.py`: representación del dominio

    Modela las tablas:

    - `Region`
    - `Comuna`
    - `Miembro`
    - `Actividad`
    - `Foto`
    - `Comentario`

    Sus relaciones principales son:

    - Una región tiene muchas comunas;
    - Una comuna tiene muchos miembros;
    - Un miembro tiene muchas actividades;
    - Una actividad tiene muchas fotos;
    - Una actividad tiene muchos comentarios

- `templates/`: capa de presentación renderizada por Flask.

    Los templates usan herencia desde `base.html` y reutilizan `partials/navbar.html` para evitar duplicación de estructura común.

    Para Tarea 3, `estadisticas.html` define los contenedores de los tres gráficos y carga Highcharts junto con `estadisticas.js`. Además, `detalle_miembro.html` incluye el listado y formulario de comentarios dentro de cada actividad. La vista de Tarea 4 queda en `tarea4/src/main/resources/templates/buscador.html`.

- `static/`: recursos estáticos.

    Aquí se agrupan hojas de estilo, scripts de cliente y archivos subidos por usuarios. Para Tarea 3 se agregó `comentarios.js` y se actualizó `estadisticas.js` para trabajar con datos reales desde Flask. Los estáticos de Tarea 4 quedan dentro de `tarea4/src/main/resources/static`.

## Decisiones de diseño importantes

### Unificar registro de miembro y actividad

En la Tarea 1 existían formularios separados para registrar miembros y actividades. En esta versión se mantiene una sola vista (`registro.html`) y una sola ruta (`/registro`) para registrar ambos datos.

La razón fue evitar tener que implementar autenticación, selección posterior de usuario o manejo de sesión para saber a qué miembro asociar una actividad. Como el enunciado original no exigía usuarios autenticados, se eligió un operación de registro completa:

- Se crea un miembro;
- Se crean sus actividades;
- Se guardan sus fotos;
- Se confirma todo con un único `commit()`.

Esta decisión se refleja en `app.py`, donde la ruta `/registro` crea primero el `Miembro`, luego usa `session.flush()` para obtener su `id`, y finalmente crea las filas de `Actividad` y `Foto`.

### Una actividad por cada día seleccionado

El formulario permite seleccionar varios días, pero la tabla `actividad` almacena un solo día por fila. Por eso se decidió crear una actividad independiente por cada día seleccionado.

Ejemplo: si el usuario selecciona lunes, miércoles y viernes, se crea un miembro y tres actividades asociadas a ese mismo miembro.

Esta decisión es coherente con el modelo relacional y evita guardar listas dentro de una columna pensada para un único valor.

### Calcular duración en servidor

La base almacena `hora_inicio` y `duracion`, no `hora_termino`. Por eso `app.py` incluye `calcular_duracion(hora_inicio, hora_termino)`.

Se decidió calcular la duración en el servidor porque:

- Evita depender del cliente para una transformación relevante;
- Mantiene la base coherente con el formato esperado;
- Centraliza la lógica antes de insertar la actividad

### Validación doble: cliente y servidor

El proyecto valida en cliente para mejorar la experiencia de usuario, pero vuelve a validar en servidor antes de insertar datos.

Ésto se aplica en:

- `registro.js` y `/registro`, para el formulario principal;
- `comentarios.js` y `/api/actividades/<int:actividad_id>/comentarios`, para los comentarios.

La decisión se tomo porque JS del lado del cliente puede desactivarse o modificarse. Por eso Flask conserva la responsabilidad final de aceptar o rechazar datos.

### Guardar archivos en `static/uploads`

Los archivos subidos se guardan en `static/uploads` usando `secure_filename(...)` y un prefijo `uuid`.

Esta decisión resuelve dos problemas:

- Evita colisiones entre archivos con el mismo nombre;
- Deja las fotos accesibles desde la carpeta estática de Flask.

La tabla `foto` sólo guarda la ruta relativa y el nombre original del archivo.

### Endpoint único para estadísticas

El enunciado pedia usar JS para generar gráficos en el cliente llamando a una URL del servidor que obtuviera la información desde la base de datos. Se decidió implementar un único endpoint:

```text
/api/estadisticas
```

Este endpoint retorna los datos necesarios para los tres gráficos:

- `miembros_por_dia`;
- `actividades_por_tipo`;
- `actividades_por_comuna`.

La razón de usar un solo endpoint fue reducir llamadas desde el cliente y mantener la carga de estadísticas como una operación unica. Esta decisión se refleja en `static/js/estadisticas.js`, donde se hace un solo `fetch("/api/estadisticas")` y luego se distribuyen los datos a las funciones que crean cada gráfico.

### Uso de Highcharts para los gráficos

Para los graficos se eligió Highcharts porque el enunciado permitía usar bibliotecas externas y ésta permite generar de forma directa los tres tipos pedidos:

- Línea;
- Torta;
- Barras.

La decisión evita implementar manualmente cálculos de coordenadas, escalas, leyendas y responsividad. En el código se refleja en:

- `templates/estadisticas.html`, donde se carga Highcharts desde CDN;
- `static/js/estadisticas.js`, donde se llama a `Highcharts.chart(...)` para cada gráfico.

### Comentarios dentro del detalle de miembro

El enunciado indica que al visualizar una actividad debe poder verse y agregarse comentarios. En vez de crear una pagina separada por actividad, se decidió insertar el bloque de comentarios directamente en cada tarjeta de actividad dentro de `detalle_miembro.html`.

La razón fue que la aplicación ya tenía una vista de detalle del miembro con sus actividades, por lo que era el lugar más natural para mantener el contexto:

- El usuario ve los datos de la actividad;
- Revisa sus fotos;
- Ve sus comentarios;
- Agrega un nuevo comentario sin salir de la pagina.

Esto se refleja en `detalle_miembro.html`, donde cada actividad contiene una seccion con clase `comentarios-actividad` y un atributo `data-actividad-id`.

### Comentarios asíncronos con JSON

Para los comentarios se decidió usar `fetch` con JSON en lugar de un submit tradicional con recarga de página.

La razón fue cumplir con el requisito de llamadas asíncronas y mejorar la experiencia de usuario: al agregar un comentario, la página no se recarga completa, sino que se actualiza solamente el listado de comentarios de esa actividad.

Esta decisión se refleja en:

- `static/js/comentarios.js`, que hace `GET` para listar comentarios y `POST` para crear uno nuevo;
- `/api/actividades/<int:actividad_id>/comentarios`, que responde JSON tanto en lectura como en escritura;
- `serializar_comentario(...)`, que normaliza la estructura enviada al cliente.

### Restricción de 300 caracteres en comentarios

El enunciado exige al menos 5 caracteres para el texto del comentario. Ademas, la tabla entregada define `texto VARCHAR(300)`. Por eso se agrego también un máximo de 300 caracteres.

Esta decisión evita errores de base de datos por textos demasiado largos y hace que la validación cliente/servidor sea consistente con el esquema real.

### Manejo de texto ingresado por usuarios

Como los comentarios pueden contener texto arbitrario, se evitó insertar HTML desde el usuario. En `comentarios.js`, los comentarios se renderizan usando `textContent` en vez de concatenar HTML crudo.

Esta decisión ayuda a reducir riesgos asociados a entradas maliciosas, ya que el texto se interpreta como contenido textual y no como etiquetas HTML ejecutables.

### Buscador como vista separada

Para Tarea 4 se decidió crear una vista nueva, `/buscador`, en vez de mezclar la búsqueda dentro del listado de miembros o dentro del detalle de miembro.

La razón fue que el buscador trabaja sobre actividades, no sobre miembros, y necesitaba mostrar resultados que mezclan datos de distintas tablas:

- Miembro asociado;
- Día de la actividad;
- Tipo;
- Comuna;
- Nombre;
- Descripción;
- Nota

Esto se refleja en `tarea4/src/main/resources/templates/buscador.html`, que contiene el input de búsqueda, y en `tarea4/src/main/resources/static/js/buscador.js`, que se encarga de pedir los resultados y construir las tarjetas en el navegador.

### Búsqueda automática desde 3 caracteres

El enunciado pide buscar automáticamente cuando el usuario haya escrito 3 caracteres. Por eso `tarea4/src/main/resources/static/js/buscador.js` escucha el evento `input` y llama al servidor sólo cuando el texto tiene largo suficiente.

También se dejó un pequeño retraso antes de buscar, para evitar hacer demasiadas consultas mientras el usuario sigue escribiendo. Si el texto tiene menos de 3 caracteres, se limpian los resultados y se muestra un mensaje indicando que todavía no se puede buscar.

### Tabla independiente para notas

Las notas se guardan en una tabla nueva, `nota`, asociada a `actividad`. Se decidió mantenerla como una tabla separada porque una actividad puede recibir más de una evaluación.

En vez de guardar una única nota dentro de `actividad`, la tabla `nota` permite registrar varias evaluaciones y luego calcular un resumen. Por eso la interfaz muestra:

- `-`, si la actividad todavía no tiene notas;
- El promedio de las notas, si ya fue evaluada;
- La cantidad de evaluaciones registradas.

Esta decisión se refleja en los modelos JPA de `tarea4/src/main/java/com/tarea4/models`, donde `Nota` se relaciona con `Actividad`, y en `ApiService`, donde se recalcula el promedio después de insertar una nota nueva.

### Validación de notas en cliente y servidor

En el cliente se muestra un selector con valores entre 1 y 7 para evitar entradas inválidas desde la interfaz.

De todas formas, el servidor vuelve a validar la nota antes de insertarla. Esta validación es necesaria porque una petición HTTP puede construirse manualmente, sin pasar por el formulario del navegador. Por eso Spring Boot rechaza cualquier valor que no sea un número entero entre 1 y 7 en `/api/actividades/{id}/notas`.

### Actualizar la nota sin recargar

Al agregar una nota, el servidor responde con el promedio actualizado y la cantidad de notas asociadas a la actividad. Con eso, `tarea4/src/main/resources/static/js/buscador.js` actualiza solamente la tarjeta correspondiente.

La razón fue mantener la intercción asíncrona pedida por el enunciado: el usuario evalúa una actividad y ve el cambio inmediatamente, sin perder la búsqueda que ya tenía en pantalla.

## Explicación por archivos principales

`app.py`:

- En `/` obtiene los últimos cinco miembros registrados y los envía a `index.html`.
- En `/registro` carga comunas, valida el formulario, guarda archivos, crea el miembro, calcula duración, crea actividades y crea fotos asociadas.
- En `/miembros` obtiene miembros desde la base con paginación.
- En `/miembros/<id>` muestra el detalle de un miembro.
- En `/api/estadisticas` calcula y retorna datos agregados para los tres gráficos.
- En `/api/actividades/<int:actividad_id>/comentarios` lista comentarioss con `GET` y crea comentarios con `POST`.

`models.py`:

Representa las entidades principales del sistema y sus relaciones para Flask. Para Tarea 3 se agrego `Comentario`, relacionado con `Actividad` mediante `actividad_id`. La entidad `Nota` queda implementada en el módulo Spring Boot de Tarea 4.

`base.html`:

Define la estructura común del sitio:

- `head`;
- CSS comunes;
- Navbar;
- Bloques `title`, `extra_css`, `content` y `extra_js`.

`partials/navbar.html`:

Contiene la barra de navegacion compatida entre vistas.

`index.html`:

Funciona como portada y menú principal del sistema. También muestra los ultimos cinco miembros registrados y mensajes de éxito.

`registro.html`:

Contiene el formularioi unificado de miembro y actividad. Esta preparado para mostrar errores de validación del cliente y del servidor.

`miembros.html`:

Muestra un listado paginado de miembros registrados con enlace al detalle de cada uno.

`detalle_miembro.html`:

Muestra los datos del miembro, sus actividades, fotos asociadas, y, para cada actividad, un bloque de comentarios con formulario asíncrono.

`estadisticas.html`:

Define los contenedores de los tres gráficos de Tarea 3:

- Miembros registrados por día;
- Actividades por tipo;
- Actividades por comuna.

Tambien carga Highcharts y `static/js/estadisticas.js`.

`tarea4/src/main/resources/templates/buscador.html`:

Contiene el formulario de búsqueda de actividades. La vista parte sin resultados y luego `tarea4/src/main/resources/static/js/buscador.js` se encarga de consultar al servidor, mostrar actividades encontradas, destacar el texto que coincide con la búsqueda y permitir evaluarlas.

`contacto.html`:

Vista simple con información de contacto.

`database/sql/tabla-comentario.sql`:

Script entregado para agregar la tabla `comentario` a la base `tarea2`.

`database/sql/tabla-nota.sql`:

Script entregado para agregar la tabla `nota` a la base `tarea2`. Esta tabla guarda las evaluaciones de las actividades.

## Organización del CSS

Se separó la presentación por responsabilidades:

- `styles.css`: reglas globales, secciones generales, detalle de miembro, tarjetas de actividad y estilos de comentarios.
- `navbar.css`: estilos exclusivos de la barra de navegación.
- `forms.css`: estilos del formulario de registro.
- `tables.css`: estilos de tabla de miembros y paginación.
- `index.css`: estilos de portada y últimos miembros.
- `stats.css`: estilos de la pagina de estadísticas y contenedores de gráficos.

Los estilos de comentarios se dejaron en `styles.css` porque forman parte del detalle de miembro, que ya úsaba reglas generales de tarjetas y actividades. Los estilos de gráficas se mantuvieron en `stats.css` porque sólo pertenecen a la vista `/estadisticas`. Los estilos del buscador de Tarea 4 quedan en `tarea4/src/main/resources/static/css/buscador.css`.

## Organización del frontend con JS

El frontend Flask queda dividido en tres archivos principales:

- `registro.js`: valida el formulario de registro antes del submit tradicional.
- `estadisticas.js`: usa `fetch("/api/estadisticas")`, recibe datos JSON desde Flask y genera los tres gráficos usando Highcharts.
- `comentarios.js`: usa `fetch` para cargar comentarios por actividad, validar nuevos comentarios en cliente, enviarlos con `POST` y actualizar el listado sin recargar la página.

Esta separación evita mezclar lógicas distintas en un solo archivo y deja cada script asociado a una vista o funcionalidad concreta. Para Tarea 4, el script del buscador queda dentro del proyecto Spring Boot.

## Funcionalidades implementadas

- Portada.
- Navegación principal.
- Mensaje de éxito al registrar.
- Últimos cinco miembros registrados.
- Registro unificado de miembro y actividad.
- Validación en cliente y servidor para registro.
- Guardado de archivos en `static/uploads`.
- Inserción en `miembro`, `actividad` y `foto`.
- Listado paginado de miembros.
- Detalle de miembro.
- Visualización de actividades y fotos.
- Estadísticas reales desde base de datos:
  - Miembros registrados por dia;
  - Actividades por tipo;
  - Actividades por comuna.
- Gráficos generados en cliente con JS y Highcharts.
- Tabla `comentario`.
- Modelo `Comentario`.
- Listado asíncrono de comentarios por actividad.
- Formulario asíncrono para agregar comentarios.
- Validación cliente/servidor para comentarios.
- Tabla `nota`.
- Modelo `Nota` en Spring Boot.
- Buscador asíncrono de actividades.
- Búsqueda por nombre, descripción o comuna.
- Destacado del texto que coincide con la búsqueda.
- Formulario asíncrono para evaluar actividades.
- Validación cliente/servidor para notas entre 1 y 7.
- Recálculo de nota promedio y contador de evaluaciones sin recargar la página.
- Contacto.

## Rutas principales

```text
GET / -> Portada
GET /registro -> Formulario de registro
POST /registro -> Procesamiento de registro
GET /miembros -> Listado paginado de miembros
GET /miembros/<id> -> Detalle de miembro
GET /estadisticas -> Página de estadísticas
GET /api/estadisticas -> Datos JSON para gráficos
GET /api/actividades/<id>/comentarios -> Comentarios de una actividad
POST /api/actividades/<id>/comentarios -> Crear comentario en una actividad
GET /contacto -> Página de contacto
```

Las rutas de Tarea 4 están en Spring Boot:

```text
GET http://localhost:8080/buscador -> Buscador de actividades
GET http://localhost:8080/api/actividades/buscar?q=texto -> Buscar actividades
POST http://localhost:8080/api/actividades/<id>/notas -> Crear nota en una actividad
```
