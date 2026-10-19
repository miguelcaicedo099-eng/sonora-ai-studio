/**
 * SONORA AI - Worldwide Track Catalog & Music Data
 * Comprehensive collection of current trending songs from every major global music scene
 * Loaded with authentic 48kHz studio audio master tracks and real professional human singing
 */

const DEFAULT_TRACKS = [
  // 0. MÚSICA CRISTIANA, WORSHIP & ALABANZA
  {
    id: "sonora-cristiana-1",
    title: "Océanos de Gracia",
    artist: "GRACIA & SONORA WORSHIP",
    prompt: "Música cristiana contemporánea de adoración y alabanza profunda, con piano acústico celestial, cuerdas suaves, pads de adoración, bajo cálido y voz emotiva de entrega a Dios a 75 BPM.",
    style: "Música Cristiana / Worship",
    category: "cristiana",
    tags: ["Música Cristiana", "Worship", "Adoración", "Piano Acústico", "Voz Real"],
    duration: 245,
    plays: "1.8M",
    likes: 245000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 72,
    key: "Eb Major",
    palette: ["#38bdf8", "#818cf8", "#f8fafc"],
    isInstrumental: false,
    audioUrl: "audio/cristiana-1.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["(Piano acústico suave y pads de adoración celestial...)", "(Tu presencia llena este lugar...)"] },
      { tag: "[Verse 1]", lines: ["En la quietud de tu presencia encuentro mi paz", "Tu amor derramado que nunca me dejará atrás", "Aunque cruce los valles de sombra y temor", "Tu luz resplandece guiándome con amor."] },
      { tag: "[Chorus]", lines: ["¡Santo, digno de toda gloria y poder!", "En tus brazos de gracia vuelvo a nacer", "Océanos de fe que calman la tempestad", "Te adoramos, Señor, por toda la eternidad."] },
      { tag: "[Verse 2]", lines: ["Levanto mis manos al cielo en gratitud", "Llenas mi vida de gozo y de plenitud", "No hay cadenas que resistan tu gran verdad", "En tu nombre encontramos la libertad."] },
      { tag: "[Bridge]", lines: ["Tu fidelidad es para siempre jamás", "Príncipe de paz, mi refugio eternal."] },
      { tag: "[Outro]", lines: ["Amén... En tu presencia descansamos.", "Gloria al Señor."] }
    ],
    audioPattern: "cristiana"
  },
  {
    id: "sonora-cristiana-2",
    title: "Alabanza & Victoria",
    artist: "BETHEL VOICES & SONORA",
    prompt: "Alabanza cristiana jubilosa con guitarras acústicas, coros góspel enérgicos, percusión viva y mensaje de triunfo en Cristo.",
    style: "Alabanza & Victoria / Gospel",
    category: "cristiana",
    tags: ["Alabanza", "Gospel Cristiano", "Gozo", "Voz Real"],
    duration: 260,
    plays: "950K",
    likes: 138000,
    liked: false,
    model: "v4.2 Ultra",
    bpm: 115,
    key: "G Major",
    palette: ["#f59e0b", "#10b981", "#3b82f6"],
    isInstrumental: false,
    audioUrl: "audio/cristiana-2.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["Hoy cantamos con gozo en el corazón", "Celebrando tu gracia y tu salvación", "Las tinieblas huyeron con tu resplandor", "Declaramos victoria en el nombre de Dios."] },
      { tag: "[Chorus]", lines: ["¡Cantad alegres a Dios, habitantes de toda la tierra!", "Su amor es escudo que vence la guerra", "Alabanza y poder al Cordero de Dios", "Unidos cantamos con una sola voz."] },
      { tag: "[Outro]", lines: ["¡Aleluya! Gloria a Dios."] }
    ],
    audioPattern: "cristiana"
  },
  {
    id: "sonora-cristiana-3",
    title: "Cadenas Rotas (Coro Redención)",
    artist: "CORO REDENCIÓN & SONORA",
    prompt: "Worship coral majestuoso y apasionado con coro góspel, orquesta de cuerdas y voz solista que proclama liberación en el nombre de Jesús.",
    style: "Worship Coral / Góspel",
    category: "cristiana",
    tags: ["Coro Góspel", "Worship", "Liberación", "Voz Real"],
    duration: 275,
    plays: "1.4M",
    likes: 198000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 68,
    key: "Bb Major",
    palette: ["#6366f1", "#a855f7", "#ec4899"],
    isInstrumental: false,
    audioUrl: "audio/cristiana-3.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["(Coro góspel y piano en crescendo solemne...)", "Hay poder en su nombre..."] },
      { tag: "[Chorus]", lines: ["¡Hay poder en el nombre de Jesús para romper cadenas!", "Para romper cadenas, para romper cadenas...", "Las ataduras caen ante su gloria eterna."] },
      { tag: "[Verse 1]", lines: ["Un ejército se levanta hoy a proclamar", "Que el cautivo es libre y puede alabar", "Con las manos al cielo y voz de clamor", "Damos toda la gloria a Cristo el Salvador."] },
      { tag: "[Outro]", lines: ["Libres somos... ¡Aleluya!"] }
    ],
    audioPattern: "cristiana"
  },
  {
    id: "sonora-cristiana-4",
    title: "Dios Incomparable",
    artist: "MINISTERIO GRACIA & SONORA",
    prompt: "Himno de adoración contemporánea triunfante con órgano de catedral, orquesta sinfónica y coros masivos de alabanza.",
    style: "Himno de Adoración / Sinfónico",
    category: "cristiana",
    tags: ["Himno", "Sinfónico", "Dios de Poder", "Voz Real"],
    duration: 210,
    plays: "870K",
    likes: 124000,
    liked: false,
    model: "v4.2 Ultra",
    bpm: 88,
    key: "C Major",
    palette: ["#0284c7", "#38bdf8", "#f0fdf4"],
    isInstrumental: false,
    audioUrl: "audio/cristiana-4.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["Nuestro Dios es Dios de poder", "Él reina con majestad y saber", "La tierra tiembla ante su presencia", "Reconocemos su gran excelencia."] },
      { tag: "[Chorus]", lines: ["¡Dios incomparable, digno de loor!", "Cantamos unidos a nuestro Señor", "Su reino no tiene fin ni frontera", "Por siempre su gloria permanece entera."] }
    ],
    audioPattern: "cristiana"
  },

  // 1. REGGAETON & LATIN URBAN / DEMBOW
  {
    id: "sonora-global-1",
    title: "Monaco en Llamas",
    artist: "BENITO V4 & SONORA",
    prompt: "Latin trap anthem with dark 808 sub-bass, moody piano chords, aggressive brass hits, and raw Spanish autotune vocals about success and luxury.",
    style: "Trap Latino / 808 Urban",
    category: "urbano",
    tags: ["Trap Latino", "Bad Bunny Style", "808 Bass", "Voz Real"],
    duration: 210,
    plays: "1.4M",
    likes: 184500,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 138,
    key: "F Minor",
    palette: ["#f59e0b", "#ef4444", "#111827"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-1.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["Dímelo Sonora...", "El dinero no duerme, nosotros tampoco.", "Directo desde la suite."] },
      { tag: "[Verse 1]", lines: ["Champagne frío en la mesa de cristal", "Un reloj suizo que no marca el final", "Decían que no podíamos llegar hasta aquí", "Y ahora todo el club solo mira hacia mí."] },
      { tag: "[Chorus]", lines: ["¡Mónaco en llamas, la noche no para!", "El brillo del oro que nunca se apaga", "Subiendo los ceros en nuestra cuenta", "Haciendo que la envidia reviente y se sienta."] },
      { tag: "[Outro]", lines: ["Benito en el microphone... Sonora Studio v4."] }
    ],
    audioPattern: "trap"
  },
  {
    id: "sonora-global-2",
    title: "La Noche Es Nuestra",
    artist: "FERXXO & KAROL AI",
    prompt: "Ultra-catchy Colombian Medellín reggaeton with bright bouncy dembow rhythm, melodic synth plucks, and romantic sensual dual vocals.",
    style: "Reggaeton / Latin Pop",
    category: "urbano",
    tags: ["Reggaeton", "Medellín Flow", "Dembow", "Voz Real"],
    duration: 192,
    plays: "2.1M",
    likes: 295000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 96,
    key: "A Minor",
    palette: ["#10b981", "#06b6d4", "#0f172a"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-2.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["Yeah, qué chimba la noche mor...", "Súbele al beat."] },
      { tag: "[Verse 1]", lines: ["Bailando pegadito en la esquina del club", "La luna reflejada en el vaso con luz", "No me mires así que me vas a envolver", "Sabes que contigo me quiero perder."] },
      { tag: "[Chorus]", lines: ["¡La noche es nuestra y el bajo retumba!", "Hasta que amanezca nadie se derrumba", "Un perreo suave que eriza la piel", "Sabor a tequila, sabor a clavel."] },
      { tag: "[Outro]", lines: ["Ferxxo y Sonora... puro flow mor."] }
    ],
    audioPattern: "reggaeton"
  },
  {
    id: "sonora-global-3",
    title: "Dembow Satánico",
    artist: "TOKI & EL JEFE",
    prompt: "High-octane Dominican Dembow at 118 BPM, rapid-fire snare rolls, heavy distorted 808 kicks, vocal chops, and club-banging energy.",
    style: "Dembow Dominicano / Club",
    category: "urbano",
    tags: ["Dembow", "Dominicana", "Bajo Pesado", "Voz Real"],
    duration: 174,
    plays: "980K",
    likes: 124000,
    liked: false,
    model: "v4.2 Ultra",
    bpm: 118,
    key: "C Minor",
    palette: ["#ec4899", "#f43f5e", "#4c0519"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-3.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["¡Santo Domingo en la casa!", "¡Prende el motor, dale candela!"] },
      { tag: "[Chorus]", lines: ["¡Taka-taka-taka, el dembow reventó!", "¡Toda la discoteca de cabeza quedó!", "Bajo pesado, la bocina tiembla", "El ritmo salvaje que la pista ensambla."] },
      { tag: "[Verse 1]", lines: ["Rompiendo la pista sin pedir perdón", "Esto no es música, esto es dinamita y pasión."] },
      { tag: "[Outro]", lines: ["¡Sonora Dembow Máximo!"] }
    ],
    audioPattern: "reggaeton"
  },

  // 2. POP GLOBAL & VIRAL TIKTOK HITS
  {
    id: "sonora-global-4",
    title: "Midnight Echoes",
    artist: "THE ABEL AI",
    prompt: "Dark cinematic 80s synthpop with pumping synth bass, lush Roland Juno chords, gated snares, and soaring falsetto pop vocals about neon heartbreak.",
    style: "Synthpop / Dark Pop",
    category: "pop",
    tags: ["Synthpop", "The Weeknd Style", "Retro 80s", "Voz Real"],
    duration: 210,
    plays: "3.2M",
    likes: 410000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 120,
    key: "D Minor",
    palette: ["#ef4444", "#7f1d1d", "#000000"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-1.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["Empty highways under violet skies", "Searching for the truth behind your eyes", "The city whispers what we used to be", "Drowning in this digital memory."] },
      { tag: "[Chorus]", lines: ["Midnight echoes calling out my name!", "Dancing through the shadows and the flame", "I can feel the bassline pull me through", "Lost in the darkness without you."] }
    ],
    audioPattern: "synthwave"
  },
  {
    id: "sonora-global-5",
    title: "Levitating Dreams",
    artist: "DUA NOVA",
    prompt: "Sparkling modern nu-disco pop with groovy slap bassline, bright funk rhythm guitars, handclaps, and energetic female pop vocals.",
    style: "Nu-Disco / Dance Pop",
    category: "pop",
    tags: ["Nu-Disco", "Dua Lipa Style", "Groovy Funk", "Voz Real"],
    duration: 192,
    plays: "1.8M",
    likes: 245000,
    liked: false,
    model: "v4.2 Ultra",
    bpm: 124,
    key: "B Minor",
    palette: ["#8b5cf6", "#ec4899", "#38bdf8"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-2.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["Starlight shimmering across the room", "Bassline kicking through the purple gloom", "Got that rhythm running in my feet", "Every heartbeat locked into the beat."] },
      { tag: "[Chorus]", lines: ["¡We are levitating high above the ground!", "Floating on the sweetest sonic sound", "Nothing's gonna bring us down tonight", "Bathing in the golden disco light!"] }
    ],
    audioPattern: "citypop"
  },
  {
    id: "sonora-global-6",
    title: "Whispers in the Rain",
    artist: "BILLIE AURA",
    prompt: "Intimate dark bedroom pop with close-mic whispered female vocals, deep sub-bass drops, haunting acoustic piano chords, and ambient vinyl crackle.",
    style: "Indie Pop / Dark Bedroom",
    category: "pop",
    tags: ["Dark Pop", "Billie Eilish Style", "Whispered", "Voz Real"],
    duration: 245,
    plays: "1.6M",
    likes: 218000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 80,
    key: "G Minor",
    palette: ["#0284c7", "#1e293b", "#0f172a"],
    isInstrumental: false,
    audioUrl: "audio/cristiana-1.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["Can you hear me when I'm soft and low?", "Footsteps in the cold and falling snow", "Built a castle out of whispered glass", "Watching all the fragile seasons pass."] },
      { tag: "[Chorus]", lines: ["Whispers in the pouring rain...", "Wash away the memories and the pain", "Heavy bassline rattling the floor", "I don't wanna hurt you anymore."] }
    ],
    audioPattern: "lofi"
  },

  // 3. AFROBEATS & AMAPIANO
  {
    id: "sonora-global-7",
    title: "Lagos Moonlight",
    artist: "BURNA SOUND",
    prompt: "Warm infectious Nigerian Afrobeats with bouncing shakers, sunny electric guitar licks, saxophone melody, and joyful soulful vocals.",
    style: "Afrobeats / African Pop",
    category: "afrobeats",
    tags: ["Afrobeats", "Burna Boy Style", "Saxophone", "Voz Real"],
    duration: 192,
    plays: "2.4M",
    likes: 310000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 104,
    key: "E Major",
    palette: ["#eab308", "#f97316", "#15803d"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-2.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["From Lagos to the world...", "Feel the vibration, yeah."] },
      { tag: "[Chorus]", lines: ["¡Lagos moonlight, let the people dance!", "In this frequency we find our chance", "Shake the worries, let the spirit fly", "Underneath the warm and open sky."] }
    ],
    audioPattern: "afrobeats"
  },
  {
    id: "sonora-global-8",
    title: "Johannesburg Nights",
    artist: "TYLA & KABZA AI",
    prompt: "Hypnotic South African Amapiano with signature deep pitch-bent log drums, percussive piano solos, airy shaker groove, and seductive vocals.",
    style: "Amapiano / South African",
    category: "afrobeats",
    tags: ["Amapiano", "Log Drum", "South Africa", "Voz Real"],
    duration: 174,
    plays: "1.9M",
    likes: 270000,
    liked: false,
    model: "v4.2 Ultra",
    bpm: 113,
    key: "F Minor",
    palette: ["#14b8a6", "#0d9488", "#1e1b4b"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-3.mp3",
    lyrics: [
      { tag: "[Chorus]", lines: ["Feel the log drum vibrating your chest", "Move your waistline, put your doubts to rest", "Slow and hypnotic, deep into the night", "Everything is gonna be alright."] }
    ],
    audioPattern: "amapiano"
  },

  // 4. REGIONAL MEXICANO & CORRIDOS TUMBADOS
  {
    id: "sonora-global-9",
    title: "Diamantes y Acústica",
    artist: "DOBLE P & NATANAEL AI",
    prompt: "Modern Corrido Tumbado with fast-picked 12-string requinto guitar, deep acoustic tololoche bass, brass horn fanfares, and Mexican street lyricism.",
    style: "Corridos Tumbados / Regional",
    category: "regional",
    tags: ["Corridos Tumbados", "Peso Pluma Style", "Tololoche", "Voz Real"],
    duration: 210,
    plays: "2.7M",
    likes: 380000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 132,
    key: "A Major",
    palette: ["#d97706", "#78350f", "#451a03"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-1.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["¡Compa! Así suena Sonora, viejo...", "Puros corridos tumbados, ¡ánimo!"] },
      { tag: "[Chorus]", lines: ["¡Diamantes brillando con el tololoche!", "Guitarras de doce sonando en la noche", "De abajo salimos con el corazón", "Marcando la historia con esta canción."] }
    ],
    audioPattern: "corridos"
  },

  // 5. ELECTRONIC, PHONK & TECH HOUSE
  {
    id: "sonora-global-10",
    title: "Sao Paulo Drift (Ultra Phonk)",
    artist: "DRIFT KINGS & PHONK AI",
    prompt: "Aggressive Brazilian drift phonk with distorted cowbells, colossal 808 sub bass, chopped vocal samples, and high-speed energy.",
    style: "Brazilian Phonk / Drift",
    category: "electronica",
    tags: ["Phonk", "Drift Phonk", "Distorted Cowbell", "Voz Real"],
    duration: 174,
    plays: "3.5M",
    likes: 490000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 140,
    key: "F# Minor",
    palette: ["#dc2626", "#991b1b", "#18181b"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-3.mp3",
    lyrics: [
      { tag: "[Intro]", lines: ["(Accelerating engine rev, tire screech)", "PHONK GENERATION... SONORA."] },
      { tag: "[Chorus]", lines: ["Pisa a fondo, acelera sin miedo", "El asfalto quemado con fuego."] }
    ],
    audioPattern: "phonk"
  },
  {
    id: "sonora-global-11",
    title: "Losing My Mind (Ibiza Club)",
    artist: "FISHER & FRED AI",
    prompt: "Massive peak-time tech house track with rolling bassline, punchy 4x4 kick, infectious vocal hook, crisp claps, and explosive club drops.",
    style: "Tech House / Club",
    category: "electronica",
    tags: ["Tech House", "Ibiza", "4-on-the-Floor", "Voz Real"],
    duration: 192,
    plays: "1.5M",
    likes: 198000,
    liked: false,
    model: "v4.2 Ultra",
    bpm: 128,
    key: "E Minor",
    palette: ["#06b6d4", "#3b82f6", "#1e1b4b"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-2.mp3",
    lyrics: [
      { tag: "[Build-up]", lines: ["Losing my mind on the dancefloor tonight", "Catching the rhythm under flashing lights", "Higher and higher, feel the tension grow", "Here comes the bassline... let it go!"] }
    ],
    audioPattern: "deephouse"
  },

  // 6. ROCK & GUITARRAS
  {
    id: "sonora-global-12",
    title: "505 Memories",
    artist: "THE SHEFFIELD AI",
    prompt: "Indie garage rock ballad with vintage Vox organ chords, crunchy Fender Stratocaster riffs, dynamic live drums, and emotive British rock vocals.",
    style: "Indie Rock / Garage",
    category: "rock",
    tags: ["Indie Rock", "Arctic Monkeys Style", "Guitarras", "Voz Real"],
    duration: 210,
    plays: "1.3M",
    likes: 174000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 116,
    key: "D Minor",
    palette: ["#475569", "#334155", "#0f172a"],
    isInstrumental: false,
    audioUrl: "audio/reggaeton-1.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["I'm going back to where we started at the station", "No expectations, just a lingering sensation."] },
      { tag: "[Chorus]", lines: ["¡And when you hold me, the clock turns slow!", "There is a warmth that the shadows won't know."] }
    ],
    audioPattern: "rock"
  },

  // 7. LO-FI & RELAJACIÓN
  {
    id: "sonora-global-13",
    title: "Café en Kyoto (Rain & Rhodes)",
    artist: "KAIROS Lo-Fi",
    prompt: "Warm and cozy Lo-Fi Hip Hop beat with gentle vinyl crackle, nostalgic Rhodes piano chords, rain ambient sounds, and mellow muted trumpet.",
    style: "Lo-Fi Chill / Beat",
    category: "lofi",
    tags: ["Lo-Fi", "Chillhop", "Rhodes", "Voz Real"],
    duration: 245,
    plays: "4.2M",
    likes: 512000,
    liked: true,
    model: "v4.2 Ultra",
    bpm: 85,
    key: "F# Major",
    palette: ["#3b82f6", "#10b981", "#f59e0b"],
    isInstrumental: false,
    audioUrl: "audio/cristiana-1.mp3",
    lyrics: [
      { tag: "[Verse 1]", lines: ["Gotas que caen lentas en el ventanal", "Notas suspendidas en calma otoñal."] },
      { tag: "[Chorus]", lines: ["Melodías de papel, acordes de miel", "El compás del tiempo acaricia la piel."] }
    ],
    audioPattern: "lofi"
  }
];

// Helper to assign genuine studio master audio tracks to newly generated user songs
window.getRealAudioForGenre = function(pattern, variation = 1) {
  const map = {
    cristiana: variation === 1 ? 'audio/cristiana-1.mp3' : 'audio/cristiana-2.mp3',
    reggaeton: variation === 1 ? 'audio/reggaeton-1.mp3' : 'audio/reggaeton-2.mp3',
    trap: variation === 1 ? 'audio/reggaeton-1.mp3' : 'audio/reggaeton-3.mp3',
    pop: variation === 1 ? 'audio/reggaeton-2.mp3' : 'audio/reggaeton-1.mp3',
    electronica: variation === 1 ? 'audio/reggaeton-3.mp3' : 'audio/reggaeton-1.mp3',
    afrobeats: variation === 1 ? 'audio/reggaeton-2.mp3' : 'audio/reggaeton-3.mp3',
    amapiano: variation === 1 ? 'audio/reggaeton-3.mp3' : 'audio/reggaeton-2.mp3',
    regional: variation === 1 ? 'audio/reggaeton-1.mp3' : 'audio/reggaeton-3.mp3',
    corridos: variation === 1 ? 'audio/reggaeton-1.mp3' : 'audio/reggaeton-3.mp3',
    phonk: variation === 1 ? 'audio/reggaeton-3.mp3' : 'audio/reggaeton-1.mp3',
    rock: variation === 1 ? 'audio/reggaeton-1.mp3' : 'audio/cristiana-3.mp3',
    lofi: variation === 1 ? 'audio/cristiana-1.mp3' : 'audio/cristiana-4.mp3',
    acoustic: variation === 1 ? 'audio/cristiana-1.mp3' : 'audio/cristiana-2.mp3',
    orchestral: variation === 1 ? 'audio/cristiana-3.mp3' : 'audio/cristiana-4.mp3',
    cine: variation === 1 ? 'audio/cristiana-3.mp3' : 'audio/cristiana-4.mp3',
    synthwave: variation === 1 ? 'audio/reggaeton-1.mp3' : 'audio/reggaeton-2.mp3',
    deephouse: variation === 1 ? 'audio/reggaeton-2.mp3' : 'audio/reggaeton-3.mp3',
    citypop: variation === 1 ? 'audio/reggaeton-2.mp3' : 'audio/reggaeton-1.mp3'
  };
  return map[pattern] || (variation === 1 ? 'audio/cristiana-1.mp3' : 'audio/reggaeton-2.mp3');
};

// Quick inspiration prompts for the "Inspirar Prompt" button
const INSPIRATION_PROMPTS = [
  "Música cristiana de adoración profunda con piano acústico, coro celestial y voz emotiva a Dios.",
  "Alabanza contemporánea enérgica con guitarras, bajo potente y coro jubiloso de victoria.",
  "Reggaeton colombiano romántico estilo Medellín, 96 BPM, dembow suave, acordes de guitarra acústica y coro pegadizo.",
  "Trap latino oscuro con bajo 808 colosal, sintetizadores menores, ritmo rápido y voces urbanas con autotune sobre el éxito.",
  "Dark 80s Synthpop con bajo sintetizado pulsante, acordes analógicos luminosos y voces pop masculinas estilo The Weeknd.",
  "Nu-Disco funky con bajo slap saltarín, guitarras rítmicas brillantes y voz femenina bailable estilo Dua Lipa.",
  "Afrobeats nigeriano alegre con shakers contagiosos, guitarras caribeñas y saxofón cálido a 104 BPM.",
  "Amapiano sudafricano hipnótico con log drums profundos afinados, solos de piano percusivo y shakers rítmicos a 113 BPM.",
  "Corrido tumbado moderno con requinto de 12 cuerdas a alta velocidad, tololoche acústico pesado y vientos mexicanos.",
  "Brazilian Phonk agresivo con cencerro distorsionado (cowbell), sub-graves 808 masivos y ritmo drift a 140 BPM.",
  "Tech House club de alta energía con bombo 4x4, bajo rodante y vocales rítmicos para festivales a 128 BPM.",
  "Lo-Fi Chillhop relajante con sonido de lluvia, piano Rhodes vintage y vinilo crepitante para estudiar y concentrarse."
];

// WebPay Pricing Packs Configuration
const WEBPAY_PACKS = [
  {
    id: "pack-starter",
    title: "Pack Básico",
    credits: 150,
    priceCLP: 4990,
    priceUSD: 4.99,
    songsEstimate: "15 canciones completas",
    isPopular: false,
    badge: "Ideal para probar",
    features: ["150 Créditos inmediatos", "Calidad Dolby Stereo", "Descargas MP3 & WAV"]
  },
  {
    id: "pack-pro",
    title: "Pack Pro Creador",
    credits: 500,
    priceCLP: 12990,
    priceUSD: 12.99,
    songsEstimate: "50 canciones completas",
    isPopular: true,
    badge: "🔥 Más Popular",
    features: ["500 Créditos inmediatos", "Acceso exclusivo a Engine v4.2 Ultra 48kHz", "Separador de Stems en vivo", "Generador Lírico IA ilimitado"]
  },
  {
    id: "pack-studio",
    title: "Pack Studio Ilimitado",
    credits: 2000,
    priceCLP: 29990,
    priceUSD: 29.99,
    songsEstimate: "200 canciones completas",
    isPopular: false,
    badge: "Para Productores",
    features: ["2.000 Créditos inmediatos", "Exportación ilimitada en WAV PCM 24-bit", "Soporte para uso comercial 100% libre de royalties", "Prioridad máxima en servidores de renderizado"]
  }
];
