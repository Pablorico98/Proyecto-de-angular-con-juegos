# 🎮 Sala de Juegos (SPA con Angular & Supabase)

Aplicación web interactiva desarrollada como una **Single Page Application (SPA)** que reúne 4 juegos multitemáticos, un chat global en tiempo real, tabla de resultados e integración con APIs externas y servicios de autenticación.

🔗 **Demo en vivo:** [https://pablo-ignacio-rico-tp-1-prog-4-2026.vercel.app/](https://pablo-ignacio-rico-tp-1-prog-4-2026.vercel.app/)

---

## 🛠️ Stack Tecnológico

* **Frontend:** Angular 19+ (TypeScript, HTML5, CSS3)
* **Backend as a Service (BaaS):** Supabase (Autenticación de usuarios, Base de datos y Chat en tiempo real)
* **Despliegue:** Vercel Continuous Deployment
* **APIs Externas:** Consumo de APIs públicas para preguntas de cultura general (Preguntados) y datos de GitHub
* **Rutas & Seguridad:** Angular Router con Guards personalizados (`authGuard`, `noAuthGuard`)

---

## 🎲 Minijuegos Incluidos

1. 🔤 **Ahorcado:** Juego clásico de adivinanza de palabras con límite de intentos y lógica de puntuación.
2. 🃏 **Mayor o Menor:** Predicción numérica de cartas continuas.
3. ❓ **Preguntados:** Juego de trivias interactivo con consumo de preguntas dinámicas vía servicio HTTP.
4. 🎴 **E-Card:** Juego de estrategia de cartas frente a la CPU.

---

## ✨ Características Técnicas Destacadas

* **Autenticación Completa:** Registro e inicio de sesión de usuarios con persistencia mediante Supabase Auth.
* **Protección de Rutas:** Implementation de `CanActivate` guards para restringir el acceso a la sala de juegos y secciones privadas únicamente a usuarios autenticados.
* **Chat Global en Tiempo Real:** Servicio de mensajería compartida para interacción entre usuarios.
* **Tabla de Resultados:** Registro persistente de partidas, puntajes y fechas por jugador.
* **Componentes Modulares & Modales:** Notificaciones personalizadas mediante el componente reusable `modal-aviso` y diseño de cards reactivas.

---

## 📁 Estructura del Proyecto


src/app/
├── auth/          # Módulos de Login, Registro y Guards de navegación
├── components/    # Componentes reutilizables (Card, Chat global, Modal Aviso)
├── juegos/        # Módulos e interfaces de Ahorcado, E-Card, Mayor-Menor, Preguntados
├── pages/         # Vistas principales (Bienvenida, Sobre Mí, Resultados)
└── services/      # Servicios HTTP, conexión a Supabase, Github API y lógica de juegos



💻 Instalación y Ejecución Local
Clonar el repositorio:

Bash
git clone [https://github.com/Pablorico98/proyecto-de-angular-con-juegos.git](https://github.com/Pablorico98/proyecto-de-angular-con-juegos.git)
cd proyecto-de-angular-con-juegos
Instalar dependencias:

Bash
npm install
Configurar Variables de Entorno:

Modifica src/environments/environment.ts con tus credenciales de proyecto en Supabase (supabaseUrl y supabaseKey).

Ejecutar servidor de desarrollo:

Bash
ng serve
Navega a http://localhost:4200/ en tu navegador.

👨‍💻 Autor
Pablo Ignacio Rico — Técnico Universitario en Programación (UTN-FRA)

LinkedIn | GitHub


