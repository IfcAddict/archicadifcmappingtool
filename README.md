# Archicad IfcMappingTool

Conversor de Mapeo de Tipos IFC para Archicad

Esta herramienta permite convertir archivos de mapeo de tipos IFC utilizados en Archicad entre formato `.xml` y `.csv`, facilitando su edición, revisión y reutilización en flujos de trabajo openBIM.

## 🧰 Funcionalidades

- ✅ Conversión bidireccional entre archivos `.xml` y `.csv`.
- ✅ Selección del esquema IFC deseado (IFC2x3 o IFC4) para la salida.
- ✅ Previsualización automática del archivo convertido al cargarlo.
- ✅ Interfaz simple, moderna y usable directamente desde el navegador.
- ✅ Despliegue en GitHub Pages, sin necesidad de instalación.

## 🚀 Uso

1. Sube uno o varios archivos `.xml` o `.csv`.
2. En el caso de archivos `.csv`, selecciona el esquema de salida deseado (IFC4 o IFC2x3).
3. Visualiza una previsualización del archivo convertido.
4. Pulsa "Convertir" para descargar el archivo transformado.

## 🛠️ Desarrollo

Proyecto desarrollado con **React + Vite**.

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Desplegar a GitHub Pages
npm run deploy
````

## 🌐 Acceso

Puedes probar la aplicación directamente en:
👉 [https://ifcaddict.github.io/archicadifcmappingtool](https://ifcaddict.github.io/archicadifcmappingtool)

## 📁 Estructura del proyecto

```
src/
│
├── components/
│   ├── FileUploader.jsx
│   ├── ConversionForm.jsx
│   ├── PreviewTabs.jsx
│   └── FileContent.jsx
│
├── converters.js    # Lógica de conversión entre formatos
├── App.jsx          # Componente principal
└── main.jsx         # Punto de entrada
```

## 🧑‍💻 Contribución

Las aportaciones son bienvenidas. Puedes abrir un issue o un pull request para sugerir mejoras, detectar errores o proponer nuevas funcionalidades.

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.