# Sistema de Gestión de Actividades DCC

Este es el prototipo desarrollado para la Tarea 1 del maravilloso curso **CC5002 - Desarrollo de Aplicaciones Web**.

Este intento de sistema permite visualizar la propuesta de interfaz para registrar miembros de la comunidad DCC,
informar actividades extracurriculares, consultar listados de miembros y revisar estadísticas generales.

## Autor

**Emiliano Vásquez Parada**  
Correo: evasquez@dcc.uchile.cl  
Teléfono: +56 9 7874 9167

## Descripción del proyecto

Este prototipo ha sido desarrollado únicamente con archivos **HTML, CSS y JavaScript**, sin uso de servidor web ni DB's.

El objetivo es representar las principales interfaces del sistema, la navegación entre páginas y las reglas
de validación de los formularios.

## Páginas principales

- `index.html`: home page del sistema.
- `registro.html`: formulario para el registro de miembros.
- `actividades.html`: formulario para que los miembros informen actividades.
- `miembros.html`: listado de miembros con filtro, ordenamiento y paginación.
- `estadisticas.html`: visualización de métricas mediante gráficas sencillas.
- `contacto.html`: mi información de contacto :p.

## Árbol del proyecto

```text
/
├── index.html
├── registro.html
├── actividades.html
├── miembros.html
├── estadisticas.html
├── contacto.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── navbar.css
│   │   ├── forms.css
│   │   ├── tables.css
│   │   ├── stats.css
│   │   └── index.css
│   └── js/
│       ├── registro.js
│       ├── actividades.js
│       ├── miembros.js
│       └── estadisticas.js
└── README.md
```
## Decisiones de diseño

Traté de ser lo más simple y directo a la hora de la implementación, priorizando
el orden y la claridad del código, y también la navegación entre las distintas vistas.

Como exigía el enunciado, todas las validaciones no sólo están respaldadas por el required del .html,
sino que también por su correspondiente archivo JavaScript.

Los datos mostrados tanto en la página de miembros como en la página de estadísticas, son creados,
ya que según lo que entendí y comentó el profesor en el foro, tenían que ser estáticos para prototipar
la interfaz, más allá de la persistencia de datos.

## Lógica del código y validaciones

Las validaciones principales están implementadas en JS, usando `addEventListener("submit", ...)` para interceptar el
envío de los formularios. En caso de error evitamos el envío con `event.preventDefault()` y se muestran mensajes
específicos bajo cada campo.

En el formulario de registro se validan los siguientes datos:

- **Nombre completo:** debe tener al menos 3 caracteres.

- **RUT:** se exige el formato `12.345.678-9`. No se valida el dígito verificador, ya que el objetivo del prototipo es
controlar el formato de entrada y no implementar una verificación completa de identidad.

- **Correo electrónico:** se valida con una expresión regular simple para verificar que tenga estructura de email.

- **Rol:** el usuario debe seleccionar un tipo de miembro.

- **Carrera/programa o departamento/unidad:** el campo cambia dinámicamente según el rol seleccionado.

- **Contraseña:** debe tener al menos 8 caracteres.

- **Confirmación de contraseña:** debe coincidir con la contraseña ingresada.

En el formulario de actividades se validan:

- **Nombre de actividad:** mínimo 3 caracteres.

- **Tipo de actividad:** debe seleccionarse una categoría.

- **Descripción:** mínimo 10 caracteres.

- **Días:** debe seleccionarse al menos un día.

- **Horario:** la hora de término debe ser posterior a la hora de inicio.

- **Archivo:** debe adjuntarse al menos una foto o video.

- **Enlace:** debe comenzar con `http://` o `https://`.

Los mensajes de error se encuentran definidos en el HTML con el atributo `hidden` y se muestran u ocultan desde JS.
Para destacar los campos inválidos, agregamos dinámicamente la clase `input-error`.

En las páginas de miembros y estadísticas se usan datos estáticos definidos en JS.
Esto nos permite emular filtros, ordenamientos y gráficos sin utilizar nada desde el backend ni almacenamiento.

## Cómo ejecutar

Abrir `index.html` directamente en su navegador de preferencia. No es necesario instalar dependencias ni levantar un servidor.