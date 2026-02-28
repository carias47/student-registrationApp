# Student App — Frontend

Frontend del sistema de gestión de estudiantes construido con **Angular 19** y **Tailwind CSS + DaisyUI**.

Se conecta a una API REST en .NET. Permite listar, registrar, editar y eliminar estudiantes, y consultar compañeros de clase por materia.

---

## Requerimientos funcionales

| #   | Requerimiento                                                                       | Implementación                                                                                         |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | CRUD completo de registro de estudiantes en línea                                   | Listado con búsqueda/paginación, formulario de creación y edición, eliminación con confirmación modal  |
| 2   | El estudiante se adhiere a un programa de créditos                                  | Cada inscripción acumula créditos según las materias seleccionadas                                     |
| 3   | Existen 10 materias disponibles                                                     | Las materias se cargan dinámicamente desde el API (`GET /Subjects`)                                    |
| 4   | Cada materia equivale a 3 créditos                                                  | Los créditos de las materias inscritas vienen del backend                                              |
| 5   | El estudiante solo puede seleccionar 3 materias                                     | Validado y restringido en la UI mediante `onSubjectToggle`                                             |
| 6   | Hay 5 profesores que dictan 2 materias cada uno                                     | Restricción gestionada por el backend al registrar                                                     |
| 7   | El estudiante no puede tener clases con el mismo profesor                           | Validación de conflicto de profesor delegada al backend                                                |
| 8   | Cada estudiante puede ver los registros de otros estudiantes en línea               | Vista de listado paginado y buscable accesible para todos                                              |
| 9   | El estudiante puede ver solo el nombre de los compañeros que compartirán cada clase | Sección "Compañeros" muestra únicamente nombres agrupados por materia (`GET /students/:id/classmates`) |

---

## Requisitos previos

- Node.js 20+
- Angular CLI 19: `npm install -g @angular/cli`
- El backend debe estar corriendo en `http://localhost:5160`

---

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Levantar en desarrollo
npm start
# → http://localhost:4200

# Build de producción
npm run build
```

---

## Variables de entorno

| Archivo                                       | Uso                                                       |
| --------------------------------------------- | --------------------------------------------------------- |
| `src/environments/environment.ts`             | Producción — reemplazar `baseUrl` con la URL real del API |
| `src/environments/environment.development.ts` | Desarrollo — apunta a `http://localhost:5160/api`         |

Angular reemplaza automáticamente el archivo de entorno según la configuración de build (`development` / `production`).

---

## Estructura del proyecto

```
src/app/
├── core/
│   └── services/
│       ├── student.service.ts     # CRUD de estudiantes + caché en memoria
│       ├── pagination.service.ts  # Página activa derivada del query param ?page
│       └── ui.service.ts          # Toast de notificaciones global
│
├── features/
│   └── students/
│       ├── pages/
│       │   ├── student-list/      # Listado con búsqueda, paginación y compañeros
│       │   └── student-register/  # Página de creación y edición (ruta compartida)
│       └── components/
│           ├── students-form/     # Formulario reactivo crear/editar
│           └── classmates/        # Compañeros de clase por materia
│
└── shared/
    ├── components/
    │   └── pagination/            # Componente de paginación reutilizable
    └── interfaces/
        └── student.interface.ts   # Tipos: StudentResponse, StudentCreate, PagedResult…
```

---

## Rutas

| URL                  | Descripción                 |
| -------------------- | --------------------------- |
| `/students`          | Listado de estudiantes      |
| `/students/register` | Registrar nuevo estudiante  |
| `/students/edit/:id` | Editar estudiante existente |

---

## Stack técnico

| Tecnología   | Versión | Uso                    |
| ------------ | ------- | ---------------------- |
| Angular      | 19      | Framework principal    |
| TypeScript   | 5.7     | Lenguaje               |
| Tailwind CSS | 4       | Estilos utilitarios    |
| DaisyUI      | 5       | Componentes UI         |
| RxJS         | 7.8     | Manejo de streams HTTP |

### Patrones Angular utilizados

- **Standalone components** — sin NgModules
- **Signals + `rxResource`** — estado reactivo y carga de datos declarativa
- **Lazy loading** — la feature `students` se carga bajo demanda
- **`NonNullableFormBuilder`** — formularios sin valores nulos implícitos
- **Caché en memoria** — `StudentService` cachea respuestas paginadas por clave `pageSize-pageNumber-query`
