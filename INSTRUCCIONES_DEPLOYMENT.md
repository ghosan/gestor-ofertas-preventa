# 🚀 Instrucciones para Desplegar la Aplicación

## 📋 **Resumen del Proceso**
Vamos a crear una aplicación web completa usando:
- **GitHub** - Para almacenar el código
- **Vercel** - Para publicar la aplicación web
- **Supabase** - Para la base de datos

---

## **PASO 1: Configurar Supabase (Base de Datos)**

### 1.1 Crear cuenta en Supabase
1. Ve a https://supabase.com
2. Haz clic en **"Start your project"**
3. Regístrate con tu email o GitHub
4. Haz clic en **"New Project"**

### 1.2 Configurar el proyecto
1. **Nombre del proyecto**: `gestor-ofertas-preventa`
2. **Contraseña de la base de datos**: Crea una contraseña segura (guárdala)
3. **Región**: Elige la más cercana a ti
4. Haz clic en **"Create new project"**
5. **Espera 2-3 minutos** mientras se crea la base de datos

### 1.3 Configurar la base de datos
1. En el panel de Supabase, ve a **"SQL Editor"** (ícono de </>)
2. Haz clic en **"New query"**
3. Copia y pega todo el contenido del archivo `database/schema.sql`
4. Haz clic en **"Run"** para ejecutar el script
5. Deberías ver el mensaje "Success. No rows returned"

### 1.4 Obtener las credenciales
1. Ve a **"Settings"** → **"API"**
2. Copia estos valores (los necesitarás después):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## **PASO 2: Configurar GitHub**

### 2.1 Crear repositorio en GitHub
1. Ve a https://github.com
2. Haz clic en **"New repository"** (botón verde)
3. **Nombre**: `gestor-ofertas-preventa`
4. **Descripción**: `Aplicación web para gestionar ofertas de preventa`
5. **Visibilidad**: Público
6. **NO marques** "Add a README file"
7. Haz clic en **"Create repository"**

### 2.2 Subir el código
1. En la página del repositorio, verás instrucciones
2. Haz clic en **"uploading an existing file"**
3. Arrastra todos los archivos del proyecto a la página
4. Escribe un mensaje de commit: `"Initial commit - Gestor de Ofertas"`
5. Haz clic en **"Commit changes"**

---

## **PASO 3: Configurar Vercel (Publicación Web)**

### 3.1 Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"**
3. **Importante**: Elige **"Continue with GitHub"**
4. Autoriza a Vercel a acceder a tu GitHub

### 3.2 Importar el proyecto
1. En el dashboard de Vercel, haz clic en **"New Project"**
2. Busca y selecciona `gestor-ofertas-preventa`
3. Haz clic en **"Import"**

### 3.3 Configurar variables de entorno
1. En la página de configuración del proyecto, ve a **"Environment Variables"**
2. Agrega estas variables:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: La URL que copiaste de Supabase
   - **Environment**: Production, Preview, Development
3. Agrega la segunda variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: La clave anónima que copiaste de Supabase
   - **Environment**: Production, Preview, Development
4. Haz clic en **"Save"**

### 3.4 Desplegar la aplicación
1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras se construye y despliega
3. ¡Listo! Tu aplicación estará disponible en una URL como: `https://gestor-ofertas-preventa.vercel.app`

---

## **PASO 4: Verificar que Todo Funciona**

### 4.1 Probar la aplicación
1. Abre la URL de tu aplicación en el navegador
2. Deberías ver las tarjetas con KPIs y la tabla de ofertas
3. Prueba crear una nueva oferta
4. Prueba la búsqueda
5. Prueba eliminar ofertas

### 4.2 Verificar la base de datos
1. Ve a Supabase → **"Table Editor"**
2. Deberías ver la tabla `offers` con datos
3. Las ofertas que crees en la web aparecerán aquí

---

## **🔄 Actualizaciones Futuras**

### Para actualizar la aplicación:
1. **Edita los archivos** en GitHub (directamente en el navegador)
2. **Vercel se actualiza automáticamente** en 1-2 minutos
3. **No necesitas hacer nada más**

### Para agregar más datos:
1. Ve a Supabase → **"Table Editor"**
2. Haz clic en **"Insert"** → **"Insert row"**
3. Completa los campos y guarda

---

## **🆘 Solución de Problemas**

### Error: "Cannot read properties of undefined (reading 'toLocaleString')"
**✅ SOLUCIONADO** - Este error ya está corregido en el código. Si aparece:
1. Recarga la página (F5)
2. Verifica que estés usando la versión más reciente del código

### Si la aplicación no carga:
1. Verifica que las variables de entorno estén correctas en Vercel
2. Revisa la consola del navegador (F12) para errores
3. Verifica que la base de datos esté configurada correctamente

### Si no aparecen datos:
1. Ve a Supabase → **"Table Editor"** y verifica que hay datos
2. Revisa que las políticas de seguridad estén configuradas
3. Verifica que las credenciales sean correctas

### Si hay errores de conexión:
1. Verifica que la URL de Supabase sea correcta
2. Verifica que la clave anónima sea correcta
3. Asegúrate de que el proyecto de Supabase esté activo

### Si las fechas aparecen como "-":
- Esto es normal cuando no hay fechas configuradas
- Las fechas se mostrarán correctamente cuando agregues ofertas con fechas válidas

---

## **📞 Soporte**

Si tienes problemas:
1. Revisa los logs en Vercel (Dashboard → Functions → View Function Logs)
2. Revisa los logs en Supabase (Dashboard → Logs)
3. Verifica la consola del navegador (F12 → Console)

¡Tu aplicación estará funcionando en menos de 30 minutos siguiendo estos pasos! 🎉
