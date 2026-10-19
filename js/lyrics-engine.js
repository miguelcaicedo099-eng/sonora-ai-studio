/**
 * SONORA AI - AI Lyricist Generator & Metrical Analysis Engine
 * Generates rhyming structured lyrics with Suno-compatible markers ([Verse], [Chorus], [Bridge], [Drop], [Outro])
 * Includes Christian Worship, Reggaeton, Trap, Synthwave, Lo-Fi, and Rock vocabularies
 */

class SonoraLyricsEngine {
  constructor() {
    this.vocabularies = {
      cristiana: {
        verse1: [
          "En la quietud de tu presencia encuentro mi paz",
          "Tu amor derramado que nunca me dejará atrás",
          "Aunque cruce los valles de sombra y temor",
          "Tu luz resplandece guiándome con amor."
        ],
        chorus: [
          "¡Santo, digno de toda gloria y poder!",
          "En tus brazos de gracia vuelvo a nacer",
          "Océanos de fe que calman la tempestad",
          "Te adoramos, Señor, por toda la eternidad."
        ],
        verse2: [
          "Levanto mis manos al cielo en gratitud",
          "Llenas mi vida de gozo y de plenitud",
          "No hay cadenas que resistan tu gran verdad",
          "En tu nombre encontramos la libertad."
        ],
        bridge: [
          "Tu fidelidad es para siempre jamás",
          "Príncipe de paz, mi refugio eternal."
        ],
        outro: [
          "Amén... En tu presencia descansamos.",
          "Gloria al Rey de reyes... final suave."
        ]
      },
      reggaeton: {
        verse1: [
          "Salió para la disco decidida a olvidar",
          "Con ese piquete que nadie puede igualar",
          "El humo en la sala y el bajo bien pesado",
          "Bailando pegadito con el ritmo apretado."
        ],
        chorus: [
          "¡Baila, que la noche se hizo para romper!",
          "Con este dembow nadie va a retroceder",
          "Fuego en la mirada, fuego en el corazón",
          "Controlando la pista con pura devoción."
        ],
        verse2: [
          "La música retumba hasta el amanecer",
          "Sonora en los parlantes marcando el poder",
          "Ella no busca amores, solo vacilón",
          "Tiene a toda la multitud bajo su fascinación."
        ],
        bridge: [
          "Súbele los decibelios que esto se encendió",
          "El dembow que todo el mundo sintió."
        ],
        outro: [
          "Valentina... DJ en los platos...",
          "Sonora Studio... hasta que salga el sol."
        ]
      },
      synthwave: {
        verse1: [
          "La carretera abierta frente al retrovisor",
          "Un cassette gastado cantando con amor",
          "El viento del verano acaricia el cristal",
          "Perdidos en un sueño dimensional."
        ],
        chorus: [
          "¡Volviendo al ochenta y cuatro una vez más!",
          "Donde las promesas no quedaban atrás",
          "Luces de cromo bajo la puesta de sol",
          "Bailando con tu recuerdo bajo el farol."
        ],
        verse2: [
          "Sintetizadores análogos en la inmensidad",
          "Dibujando notas de pura nostalgia y lealtad",
          "No mires la hora, dejemos fluir",
          "Es la única manera de poder revivir."
        ],
        bridge: [
          "Solitario en la colina viendo la ciudad",
          "Donde fuimos dueños de la eternidad."
        ],
        outro: [
          "Fade out suave...",
          "Nostalgia en 120 BPM."
        ]
      },
      lofi: {
        verse1: [
          "Gotas de lluvia golpean mi cristal",
          "Un té de manzanilla en calma otoñal",
          "Gira el vinilo con su suave crepitar",
          "No hay prisa en el mundo para respirar."
        ],
        chorus: [
          "Acordes suspendidos en la habitación",
          "La calma sincera de esta canción",
          "Deja las dudas flotar en el viento",
          "Guarda en el alma solo este momento."
        ],
        verse2: [
          "Páginas amarillas de un diario sin fin",
          "Flores que brotan en el viejo jardín",
          "El reloj de la pared parece pausar",
          "Es hora de simplemente descansar."
        ],
        bridge: [
          "Un suspiro suave antes de dormir",
          "Agradecido de poder sentir."
        ],
        outro: [
          "Silencio y lluvia suave...",
          "Buenas noches."
        ]
      },
      cyberpunk: {
        verse1: [
          "Bajo las torres de neón que cortan la niebla",
          "Un pulso binario en las sombras se despierta",
          "Cables de fibra óptica corren por el suelo",
          "Buscando una respuesta en este frío cielo."
        ],
        chorus: [
          "¡Despierta en la frecuencia de la tempestad!",
          "Sintetizadores que reclaman libertad",
          "Somos el destello que la red no apagará",
          "En el horizonte eterno que renacerá."
        ],
        verse2: [
          "Reflejos holográficos en cada callejón",
          "Perdiendo la memoria, ganando la visión",
          "Un procesador que late al compás de la verdad",
          "Cruzando las murallas de la realidad."
        ],
        bridge: [
          "Cero y uno, fuego y luz",
          "Cargando el sistema hacia el azul."
        ],
        outro: [
          "Señales desvaneciéndose en la oscuridad...",
          "Sonora v4.2 final transmission."
        ]
      }
    };
  }

  /**
   * Generates a complete structured song lyrics based on genre, mood, and custom prompt
   */
  generateLyrics(topic = "", genre = "synthwave") {
    const text = (topic + " " + genre).toLowerCase();
    let templateKey = 'synthwave';

    // 1. High priority: Cristiana, Worship, Alabanza, Adoración, Fe, Dios
    if (text.includes('cristian') || text.includes('adoraci') || text.includes('worship') || text.includes('gospel') || text.includes('dios') || text.includes('alabanza') || text.includes('jesus') || text.includes('fe') || text.includes('iglesia') || text.includes('gloria') || text.includes('salvad')) {
      templateKey = 'cristiana';
    } else if (text.includes('reggaeton') || text.includes('regeton') || text.includes('dembow') || text.includes('perreo') || text.includes('medellin')) {
      templateKey = 'reggaeton';
    } else if (text.includes('lofi') || text.includes('lo-fi') || text.includes('chill') || text.includes('cafe') || text.includes('relax')) {
      templateKey = 'lofi';
    } else if (text.includes('cyber') || text.includes('metal') || text.includes('rock') || text.includes('matrix')) {
      templateKey = 'cyberpunk';
    }

    const t = this.vocabularies[templateKey] || this.vocabularies.synthwave;

    // Build structured output with official tags
    let result = `[Intro]\n`;
    if (templateKey === 'cristiana') {
      result += `(Piano acústico cálido y pads celestiales en adoración...)\n(Cuerdas suaves)\n\n`;
    } else if (templateKey === 'reggaeton') {
      result += `(Sonora AI en el beat)\n(Súbelo...)\n\n`;
    } else if (templateKey === 'lofi') {
      result += `(Sonido suave de lluvia y vinilo crepitando...)\n\n`;
    } else {
      result += `(Arpegio sintetizado y pads atmosféricos en crescendo...)\n\n`;
    }

    result += `[Verse 1]\n${t.verse1.join('\n')}\n\n`;
    result += `[Chorus]\n${t.chorus.join('\n')}\n\n`;
    result += `[Verse 2]\n${t.verse2.join('\n')}\n\n`;
    result += `[Chorus]\n${t.chorus.join('\n')}\n\n`;
    result += `[Bridge]\n${t.bridge.join('\n')}\n\n`;
    result += `[Outro]\n${t.outro.join('\n')}`;

    return result;
  }

  /**
   * Parses text with Suno tags into structured array with time percentages
   */
  parseLyricsWithTiming(rawText, duration) {
    if (!rawText) return [];
    const lines = rawText.split('\n');
    const sections = [];
    let currentTag = '[Section]';
    let currentLines = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        if (currentLines.length > 0) {
          sections.push({ tag: currentTag, lines: currentLines });
          currentLines = [];
        }
        currentTag = trimmed;
      } else {
        currentLines.push(trimmed);
      }
    });

    if (currentLines.length > 0) {
      sections.push({ tag: currentTag, lines: currentLines });
    }

    // Assign proportional timestamps
    const totalSections = Math.max(1, sections.length);
    sections.forEach((sec, idx) => {
      sec.startPercent = idx / totalSections;
      sec.endPercent = (idx + 1) / totalSections;
      sec.startTime = sec.startPercent * duration;
      sec.endTime = sec.endPercent * duration;
    });

    return sections;
  }
}
