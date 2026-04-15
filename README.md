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
- `contacto.html`: mi información de contacto :p .

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

## Cómo ejecutar

Abrir index.html directamente en su navegador de preferencia. No es necesario instalar dependencias ni levantar un servidor.