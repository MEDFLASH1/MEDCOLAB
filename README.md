# MEDCOLAB - Aplicación de Estudio

Una aplicación de estudio con flashcards inteligentes inspirada en Brainscape, desarrollada con React y TypeScript.

## 🚀 Características

- **Sistema de Flashcards**: Crea y estudia con tarjetas de memoria
- **Dashboard Interactivo**: Gestiona tus mazos de estudio
- **Navegación Intuitiva**: Interfaz limpia y fácil de usar
- **Responsive Design**: Funciona en desktop y móvil
- **TypeScript**: Código tipado para mayor robustez

## 🛠️ Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Vite** - Herramienta de desarrollo
- **Radix UI** - Componentes de interfaz accesibles

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/MEDFLASH1/MEDCOLAB.git
cd MEDCOLAB
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de interfaz base
│   ├── common/         # Componentes comunes
│   └── ...             # Componentes principales
├── contexts/           # Contextos de React
├── hooks/              # Hooks personalizados
├── services/           # Servicios y APIs
├── types/              # Definiciones de TypeScript
├── utils/              # Utilidades
├── styles/             # Estilos globales
└── App.tsx             # Componente principal
```

## 🎯 Funcionalidades Principales

### Landing Page
- Página de bienvenida con introducción a la aplicación
- Botón para comenzar a estudiar

### Dashboard
- Vista general de todos los mazos de estudio
- Creación de nuevos mazos
- Acceso rápido a sesiones de estudio

### Creación de Mazos
- Interfaz para crear nuevos mazos de flashcards
- Gestión de tarjetas individuales

### Sistema de Estudio
- Sesiones de estudio interactivas
- Seguimiento del progreso

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura el build command: `npm run build`
3. Configura el output directory: `dist`

### Netlify
1. Conecta tu repositorio a Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**MEDFLASH1** - [GitHub](https://github.com/MEDFLASH1)

---

⭐ ¡No olvides dar una estrella al proyecto si te ha sido útil!

