# 🎵 SONORA AI — The Infinite Music Studio

**SONORA AI** es una plataforma y estudio de generación musical con Inteligencia Artificial inspirada al 99% en el flujo de trabajo de **SUNO**, pero con una identidad única, un diseño visual mejorado (*Cyber-Luxe Obsidian*) y características exclusivas de producción de audio en tiempo real.

---

## ✨ Características Principales (99% Suno + Mejoras Exclusivas)

### 🎛️ 1. Estudio de Creación Dual (Create Studio)
- **Modo Simple**:
  - Caja de descripción para prompts musicales.
  - Botón **"🎲 Inspirar Prompt"** con sugerencias automáticas de alta creatividad.
  - Selector de estilos populares instantáneos (*Synthwave, Lo-Fi, Reggaeton Dembow, Cyberpunk Rock, Épico Orquestal, Deep House, Japanese City Pop, Acústico Folk*).
  - Interruptor para canciones instrumentales (sin voces).
- **Modo Personalizado (Custom Mode)**:
  - Editor lírico completo compatible con la sintaxis de Suno (`[Verse 1]`, `[Chorus]`, `[Verse 2]`, `[Bridge]`, `[Drop]`, `[Outro]`).
  - Barra de inserción rápida de etiquetas estructurales con un solo clic.
  - **✨ Letrista IA**: Generador inteligente de estrofas y coros rimados y estructurados.
  - Selector de Modelos Neuronales (`SONORA v4.2 Ultra 48kHz`, `SONORA v3.8 Fast Melodic`, `SONORA Hi-Fi Alpha`).
  - Selector de tipo de voz (*Femenina, Masculina, Dúo Vocal, Glitch / Robótica*).

### ⚡ 2. Pipeline de Generación con 2 Variaciones
- Al hacer clic en **"Crear Canción"**, se activa la barra de progreso en 5 fases de síntesis neural:
  1. *Analizando métrica lírica y armonía musical...*
  2. *Estructurando estrofas, coros y tempo BPM...*
  3. *Sintetizando voces neuronales y stems de audio...*
  4. *Masterizando a 48kHz Dolby Stereo...*
  5. *¡Generación completada!*
- **Genera 2 variaciones independientes** (Variación 1 y Variación 2) con carátulas de álbum generativas únicas, etiquetas y duraciones distintas.

### 🎧 3. Reproductor Inferior Persistente con Forma de Onda Interactiva
- Renderizado dinámico de la forma de onda de audio en `<canvas>`.
- **Seek interactivo**: haz clic en cualquier parte de la onda para desplazarte en la canción, con vista previa de tiempo al pasar el mouse.
- Controles de reproducción: *Play / Pausa, Anterior, Siguiente, Modo Aleatorio (Shuffle), Bucle (Repeat)*.
- Control de volumen maestro con botón de silencio (Mute).

### 🎚️ 4. Mezclador de Stems en Vivo (Stem Splitter Studio)
- **Separación en 4 canales aislados en tiempo real**:
  - 🎤 **Voces / Lead Melódico**
  - 🥁 **Batería & Percusión**
  - 🎸 **Línea de Bajo / Sub-808**
  - 🎹 **Armonía, Acordes & Pads**
- Control de ganancia individual (0% a 150%), botones **Mute** (silenciar pista) y **Solo** (aislar pista).

### 🎤 5. Letras Sincronizadas (Modo Karaoke)
- Panel deslizante que muestra la letra completa dividida por secciones.
- Resalta en color púrpura neón la estrofa activa según el tiempo transcurrido de la canción.
- Al hacer clic sobre cualquier estrofa, el reproductor salta directamente a ese momento musical.

### 🌌 6. Visualizador Audio-Reactivo a Pantalla Completa
- 3 modos de visualización reactivos en tiempo real con la Web Audio API:
  1. **Studio Spectrum Bars**: Ecualizador de 64 bandas con degradados duales.
  2. **Sonic Oscilloscope**: Onda continua con resplandor neón.
  3. **Cosmic Orbital Pulse**: Núcleo central pulsante que reacciona a los sub-graves rodeado de partículas en órbita.

### 📥 7. Exportación Real a WAV de Alta Fidelidad
- Botón de descarga en cada canción que sintetiza y descarga un archivo **.WAV estándar PCM de 16-bit** directamente a tu computadora sin necesidad de servidores externos.

---

## 🚀 Cómo Iniciar la Aplicación

No requiere instalaciones complejas ni dependencias externas:

### Opción A (La más rápida):
Haz doble clic sobre el archivo **`iniciar_sonora.bat`** o abre directamente **`index.html`** en cualquier navegador moderno (Google Chrome, Microsoft Edge, Brave, Firefox o Safari).

### Opción B (Servidor Local PowerShell):
Abre PowerShell en esta carpeta y ejecuta:
```powershell
powershell -ExecutionPolicy Bypass -File start_server.ps1
```
Esto abrirá automáticamente `http://localhost:3000/` en tu navegador predeterminado.

---

## 🎨 Arquitectura del Código
- `index.html`: Estructura semántica, accesible y moderna.
- `css/styles.css`: Sistema de diseño *Cyber-Luxe*, responsive y con animaciones fluidas.
- `js/tracks-data.js`: Catálogo de pistas iniciales en múltiples géneros con métricas, letras y parámetros de síntesis.
- `js/audio-engine.js`: Motor Web Audio API con síntesis procedural multi-pista, stems y exportador WAV.
- `js/visualizer.js`: Renderizadores Canvas para forma de onda interactiva, visualizador reactivo y carátulas generativas.
- `js/lyrics-engine.js`: Motor letrista IA con soporte para etiquetas de estructura (`[Verse]`, `[Chorus]`, `[Drop]`).
- `js/stem-mixer.js`: Controlador del mezclador de 4 canales.
- `js/app.js`: Orquestador de estado, interfaz de usuario y eventos.
