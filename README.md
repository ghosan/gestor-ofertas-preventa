# Gestor de Ofertas de Preventa

Una aplicación web moderna para gestionar y hacer seguimiento de ofertas comerciales, desarrollada con React + Vite + TailwindCSS.

## 🚀 Características

- **Dashboard con KPIs**: Visualización de total de ofertas y ofertas ganadas
- **Búsqueda avanzada**: Filtrado por número de oferta, cliente o descripción
- **Gestión completa**: Crear, editar y eliminar ofertas
- **Importación de datos**: Cargar ofertas desde archivos Excel (.xlsx) o CSV
- **Alertas visuales**: Filas que parpadean cuando quedan ≤3 días para la entrega
- **Código de colores**: 
  - KO: texto rojo
  - OK: texto verde  
  - NO GO: texto negro
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla

## 📋 Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
   ```bash
   # Si tienes git instalado
   git clone <url-del-repositorio>
   cd gestor-ofertas-preventa
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   - La aplicación estará disponible en `http://localhost:5173`
   - Se abrirá automáticamente en tu navegador predeterminado

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── KpiCard.jsx          # Tarjetas de KPIs
│   ├── OffersTable.jsx      # Tabla principal de ofertas
│   ├── SearchBar.jsx        # Barra de búsqueda
│   └── Toolbar.jsx          # Barra de herramientas
├── data/
│   └── offers.json          # Datos de ejemplo
├── App.jsx                  # Componente principal
├── main.jsx                 # Punto de entrada
└── index.css                # Estilos globales
```

## 📊 Formato de Datos

### Archivo offers.json
```json
{
  "id": 1,
  "numeroOferta": "OF-2024-001",
  "descripcion": "Descripción de la oferta",
  "cliente": "Nombre del cliente",
  "clienteFinal": "Cliente final",
  "enviadoPor": "Vendedor responsable",
  "fechaRecepcion": "2024-01-15",
  "fechaEntrega": "2024-02-15",
  "estado": "EN PROCESO",
  "resultado": "OK",
  "ingresosEstimados": 45000
}
```

### Archivos Excel/CSV
Para cargar datos desde Excel o CSV, las columnas deben tener estos nombres:
- Nº Oferta (o numeroOferta)
- Descripción (o descripcion)
- Cliente (o cliente)
- Cliente Final (o clienteFinal)
- Enviado por (o enviadoPor)
- Fecha Recepción (o fechaRecepcion)
- Fecha Entrega (o fechaEntrega)
- Estado (o estado)
- Resultado (o resultado)
- Ingresos (o ingresosEstimados)

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js`:
- Azul principal: `blue-500`, `blue-600`, `blue-700`
- Verde para éxito: `green-500`, `green-600`
- Rojo para error: `red-500`, `red-600`
- Amarillo para alertas: `yellow-100`, `yellow-200`

### Animaciones
La animación de parpadeo se puede modificar en `src/index.css`:
```css
@keyframes blink {
  0%, 50% { background-color: #fef3c7; }
  51%, 100% { background-color: #fde68a; }
}
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite
3. El despliegue se realizará automáticamente

### Otras plataformas
```bash
# Construir para producción
npm run build

# Los archivos estarán en la carpeta 'dist'
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter de código

## 📝 Notas Importantes

- La aplicación es de **acceso público** (sin autenticación)
- Los datos se almacenan en el estado local del navegador
- Para persistencia de datos, considera integrar una base de datos
- La funcionalidad "Crear Carpeta" es un placeholder sin implementar

## 🆘 Solución de Problemas

### Error de dependencias
```bash
# Limpia la caché y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Puerto ocupado
Si el puerto 5173 está ocupado, Vite usará automáticamente el siguiente disponible.

### Problemas con archivos Excel
Asegúrate de que el archivo Excel tenga la primera fila como encabezados y que los nombres de las columnas coincidan con los esperados.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, revisa:
1. La consola del navegador para errores
2. Los logs de la terminal donde ejecutas `npm run dev`
3. Verifica que todas las dependencias estén instaladas correctamente
