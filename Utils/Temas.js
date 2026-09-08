// ─────────────────────────────────────────────────────────────
//  PALETA BASE — navigation
// ─────────────────────────────────────────────────────────────
const navigation_estilos = {
  color_fondo: {
    op1:  '#62af8f',  // verde menta medio
    op2:  '#13161f',  // negro azulado
    op3:  '#3AB884',  // verde esmeralda
    op4:  '#57DCA3',  // verde menta claro
    op5:  '#D4956A',  // terracota
    op6:  '#E8B84B',  // ámbar dorado
    op7:  '#6DBF8A',  // verde salvia
    op8:  '#5B9CF6',  // azul cielo
    op9:  '#7B68EE',  // violeta medio
    op10: '#38C9B0',  // turquesa
    op11: '#C47A3A',  // ocre/marrón cálido
    op12: '#2A7A5A',  // verde bosque
    op13: '#9B59B6',  // púrpura
    op14: '#3D6B9E',  // azul acero
    op15: '#E05C5C',  // rojo coral
    op16: '#3A8A5A',  // verde menta oscuro
  },
  color_texto: {
    op1: '#ffffff',   // blanco — para fondos oscuros/saturados
    op2: '#3AB884',   // verde esmeralda — para fondos muy oscuros
    op3: '#3a2a00',   // marrón oscuro — para cards ámbar/terracota claras
    op4: '#1A4A35',   // verde oscuro — para cards verdes claras
  },
}

// ─────────────────────────────────────────────────────────────
//  PALETA BASE — pantallas y componentes
// ─────────────────────────────────────────────────────────────
const screen_componente_estilos = {
  color_fondo: {
    op1: '#F5F4F9',  // gris lavanda muy claro  (claro)
    op2: '#13161f',  // negro azulado           (oscuro neutro)
    op3: '#1c1a17',  // negro cálido            (oscuro cálido)
    op4: '#141b2d',  // azul muy oscuro         (oscuro azulado)
    op5: '#FAF7F0',  // crema/hueso             (claro cálido)
    op6: '#EDEEF2',  // gris frío claro         (claro frío)
  },
  textos: {
    color_texto: {
      op1: '#ffffff',   // blanco — fondos oscuros neutros
      op2: '#e41e1e',   // rojo
      op3: '#F5D0B5',   // durazno claro — fondos oscuros cálidos
      op4: '#B8D4FF',   // azul pálido — fondos oscuros azulados
      op5: '#3A2A1A',   // marrón muy oscuro — fondo crema
      op6: '#1A2A3A',   // azul muy oscuro — fondo grisáceo
    },
    color_texto_subtitulo: {
      op1: '#ffffff',
      op2: '#e41e1e',
      op3: '#F5D0B5',
      op4: '#B8D4FF',
      op5: '#3A2A1A',
      op6: '#1A2A3A',
      op7: 'gray',
      op8: '#8a8fa8',   // gris azulado — para fondos oscuros
    },
    color_texto_importante: {
      op1: '#ffffff',
      op2: '#e41e1e',
      op3: '#F5D0B5',
      op4: '#B8D4FF',
      op5: '#3A2A1A',
      op6: '#1A2A3A',
      op7: '#3AB884',   // verde esmeralda — acento principal
    },
  },
  cards: {
    color_fondo_cards: {
      op1: '#F5F4F9',  // gris lavanda  (claro)
      op2: '#13161f',  // negro azulado (oscuro neutro)
      op3: '#1c1a17',  // negro cálido  (oscuro cálido)
      op4: '#141b2d',  // azul oscuro   (oscuro azulado)
      op5: '#FAF7F0',  // crema         (claro cálido)
      op6: '#EDEEF2',  // gris frío     (claro frío)
      op7: '#1e2336',  // azul medianoche — un paso más claro que op4
      op8: '#DDDEE6',  // gris frío medio — un paso más oscuro que op6, para cards sobre fondo grisáceo
      op9: '#ebe7dd',  // crema         (claro cálido)
      op10:'#3D6B9E'
    },
    color_borde_cards: {
      // oscuros neutros — card #1e2336, borde que destaque sin gritar
      op1:  '#c9a84c',  // dorado suave       — acento cálido clásico
      op2:  '#3AB884',  // verde esmeralda     — eco del nav esmeralda
      op3:  '#57DCA3',  // verde menta claro   — eco del nav menta claro
      // oscuros cálidos — card #1c1a17, borde que acompañe la calidez
      op4:  '#D4956A',  // terracota           — eco del nav terracota
      op5:  '#E8B84B',  // ámbar               — eco del nav ámbar
      op6:  '#6DBF8A',  // verde salvia        — eco del nav salvia
      // oscuros azulados — card #141b2d / #1e2336, borde frío
      op7:  '#5B9CF6',  // azul cielo          — eco del nav azul cielo
      op8:  '#7B68EE',  // violeta             — eco del nav violeta
      op9:  '#38C9B0',  // turquesa            — eco del nav turquesa
      // claros cálidos — card #FAF7F0, borde sutil y cálido
      op10: '#C47A3A',  // ocre medio          — delimita sin romper calidez
      op11: '#2A7A5A',  // verde bosque oscuro — contraste elegante sobre crema
      op12: '#9B59B6',  // púrpura             — acento sobre crema
      // claros fríos — card #EDEEF2, borde discreto
      op13: '#3D6B9E',  // azul acero          — sutil sobre gris claro
      op14: '#C0392B',  // coral oscurecido    — más contenido que el nav
      op15: '#3A8A5A',  // verde menta oscuro  — eco del nav
    },
  },
  botones: {
    // fondo: un escalón más claro que el fondo de pantalla
    // para dar jerarquía visual sin romper la paleta del tema
    color_fondo_botones: {
      // oscuros neutros — pantalla #13161f
      op1: '#1e2336',  // azul medianoche — coherente con color_fondo_cards.op7
      op2: '#252a3a',  // gris azulado medio — más visible
      // oscuros cálidos — pantalla #1c1a17
      op3: '#2a2520',  // marrón oscuro suavizado
      op4: '#332c24',  // marrón medio — más visible
      // oscuros azulados — pantalla #141b2d
      op5: '#1e2a42',  // azul oscuro suavizado
      op6: '#243452',  // azul medio — más visible
      // claros cálidos — pantalla #FAF7F0
      op7: '#EDE8DF',  // crema oscurecida — sutil
      op8: '#E0D8CC',  // beige medio — más definido
      // claros fríos — pantalla #EDEEF2
      op9:  '#E0E1E8', // gris lavanda suave
      op10: '#D4D6DE', // gris medio — más visible
    },
    // borde: sigue el color de acento del nav del tema
    color_borde_botones: {
      op1:  '#3AB884',  // verde esmeralda     — temas 1, 2, 3
      op2:  '#57DCA3',  // verde menta claro   — tema 2
      op3:  '#62af8f',  // verde menta medio   — tema 1
      op4:  '#D4956A',  // terracota           — tema 4
      op5:  '#E8B84B',  // ámbar               — tema 5
      op6:  '#6DBF8A',  // verde salvia        — tema 6
      op7:  '#5B9CF6',  // azul cielo          — tema 7
      op8:  '#7B68EE',  // violeta             — tema 8
      op9:  '#38C9B0',  // turquesa            — tema 9
      op10: '#C47A3A',  // ocre                — tema 10
      op11: '#2A7A5A',  // verde bosque        — tema 11
      op12: '#9B59B6',  // púrpura             — tema 12
      op13: '#3D6B9E',  // azul acero          — tema 13
      op14: '#E05C5C',  // rojo coral          — tema 14
      op15: '#3A8A5A',  // verde menta oscuro  — tema 15
    },
  },
}


// ─────────────────────────────────────────────────────────────
//  TEMAS
//
//  Grupos por tipo de fondo de pantalla:
//    tema_1  – tema_3  → fondo oscuro neutro    (#13161f)
//    tema_4  – tema_6  → fondo oscuro cálido    (#1c1a17)
//    tema_7  – tema_9  → fondo oscuro azulado   (#141b2d)
//    tema_10 – tema_12 → fondo claro crema      (#FAF7F0)
//    tema_13 – tema_15 → fondo claro grisáceo   (#EDEEF2)
// ─────────────────────────────────────────────────────────────
export const colores_temas = {

  // ── OSCURO NEUTRO ────────────────────────────────────────────

  // tema_1: oscuro neutro + nav verde menta medio
  tema_1: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op1,   // #62af8f
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op2,
      color_texto:            screen_componente_estilos.textos.color_texto.op1,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op8,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op7,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op1,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op3,  // menta medio
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op7,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op1,      // dorado
    },
  },

  // tema_2: oscuro neutro + nav verde menta claro  ← ACTIVO ORIGINAL
  tema_2: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op4,   // #57DCA3
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op2,
      color_texto:            screen_componente_estilos.textos.color_texto.op1,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op8,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op7,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op1,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op2,  // menta claro
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op7,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op3,      // menta claro
    },
  },

  // tema_3: oscuro neutro + nav verde esmeralda
  tema_3: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op3,   // #3AB884
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op2,
      color_texto:            screen_componente_estilos.textos.color_texto.op1,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op8,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op7,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op1,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op1,  // esmeralda
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op7,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op2,      // esmeralda
    },
  },

  // ── OSCURO CÁLIDO ────────────────────────────────────────────

  // tema_4: oscuro cálido + nav terracota
  tema_4: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op5,   // #D4956A
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op3,
      color_texto:            screen_componente_estilos.textos.color_texto.op3,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op3,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op3,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op3,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op4,  // terracota
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op3,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op4,      // terracota
    },
  },

  // tema_5: oscuro cálido + nav ámbar dorado
  tema_5: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op6,   // #E8B84B
      color_texto:  navigation_estilos.color_texto.op3,   // marrón oscuro
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op3,
      color_texto:            screen_componente_estilos.textos.color_texto.op3,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op3,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op3,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op4,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op5,  // ámbar
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op3,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op5,      // ámbar
    },
  },

  // tema_6: oscuro cálido + nav verde salvia
  tema_6: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op7,   // #6DBF8A
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op3,
      color_texto:            screen_componente_estilos.textos.color_texto.op3,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op3,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op3,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op3,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op6,  // salvia
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op3,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op6,      // salvia
    },
  },

  // ── OSCURO AZULADO ───────────────────────────────────────────

  // tema_7: oscuro azulado + nav azul cielo
  tema_7: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op8,   // #5B9CF6
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op4,
      color_texto:            screen_componente_estilos.textos.color_texto.op4,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op4,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op4,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op5,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op7,  // azul cielo
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op7,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op7,      // azul cielo
    },
  },

  // tema_8: oscuro azulado + nav violeta
  tema_8: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op9,   // #7B68EE
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op4,
      color_texto:            screen_componente_estilos.textos.color_texto.op4,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op4,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op4,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op6,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op8,  // violeta
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op7,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op8,      // violeta
    },
  },

  // tema_9: oscuro azulado + nav turquesa
  tema_9: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op10,  // #38C9B0
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op4,
      color_texto:            screen_componente_estilos.textos.color_texto.op1,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op4,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op4,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op5,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op9,  // turquesa
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op7,
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op9,      // turquesa
    },
  },

  // ── CLARO CREMA ──────────────────────────────────────────────

  // tema_10: claro crema + nav ocre
  tema_10: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op11,  // #C47A3A
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op5,
      color_texto:            screen_componente_estilos.textos.color_texto.op5,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op5,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op5,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op7,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op10, // ocre
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op1,      // #F5F4F9 gris lavanda — diferenciado del crema
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op10,     // ocre medio
    },
  },

  // tema_11: claro crema + nav verde bosque
  tema_11: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op12,  // #2A7A5A
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op5,
      color_texto:            screen_componente_estilos.textos.color_texto.op5,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op5,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op5,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op8,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op11, // verde bosque
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op1,      // #F5F4F9 gris lavanda — diferenciado del crema
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op11,     // verde bosque
    },
  },

  // tema_12: claro crema + nav púrpura
  tema_12: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op13,  // #9B59B6
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
        color_fondo:            screen_componente_estilos.color_fondo.op5,
        color_texto:            screen_componente_estilos.textos.color_texto.op5,
        color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op5,
        color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op5,
        color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op7,
        color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op12, // púrpura
        color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op9,      // #F5F4F9 gris lavanda — diferenciado del crema
        color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op12,
    },
  },

  // ── CLARO GRISÁCEO ───────────────────────────────────────────

  // tema_13: claro grisáceo + nav azul acero
  tema_13: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op14,  // #3D6B9E
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op6,
      color_texto:            screen_componente_estilos.textos.color_texto.op6,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op6,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op6,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op9,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op13, // azul acero
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op8,      // #DDDEE6 gris frío medio — diferenciado del grisáceo
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op13,     // azul acero
    },
  },

  // tema_14: claro grisáceo + nav rojo coral
  tema_14: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op15,  // #E05C5C
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op6,
      color_texto:            screen_componente_estilos.textos.color_texto.op6,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op6,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op6,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op10,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op14, // rojo coral
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op8,      // #DDDEE6 gris frío medio — diferenciado del grisáceo
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op14,     // coral oscurecido
    },
  },

  // tema_15: claro grisáceo + nav verde menta oscuro
  tema_15: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op16,  // #3A8A5A
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
      color_fondo:            screen_componente_estilos.color_fondo.op6,
      color_texto:            screen_componente_estilos.textos.color_texto.op6,
      color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op6,
      color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op6,
      color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op9,
      color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op15, // verde menta oscuro
      color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op8,      // #DDDEE6 gris frío medio — diferenciado del grisáceo
      color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op15,     // verde menta oscuro
    },
  },
  // tema_16: crema claro + nav verde menta claro (tema 2 sobre base tema 11)
tema_16: {
  navigation_estilos: {
    color_fondo:  navigation_estilos.color_fondo.op4,   // #57DCA3 verde menta claro
    color_texto:  navigation_estilos.color_texto.op1,
  },
  screen_componente_estilos: {
    color_fondo:            screen_componente_estilos.color_fondo.op5,          // #FDFBF5 crema muy claro
    color_texto:            screen_componente_estilos.textos.color_texto.op5,
    color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op5,
    color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op5,
    color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op8,
    color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op2,  // menta claro
    color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op9,     // #F5F4F9 gris lavanda — diferenciado del crema
    color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op3,     // menta claro #57DCA3
  },
},

tema_17: {
    navigation_estilos: {
      color_fondo:  navigation_estilos.color_fondo.op14, 
      color_texto:  navigation_estilos.color_texto.op1,
    },
    screen_componente_estilos: {
        color_fondo:            screen_componente_estilos.color_fondo.op5,
        color_texto:            screen_componente_estilos.textos.color_texto.op5,
        color_texto_subtitulo:  screen_componente_estilos.textos.color_texto_subtitulo.op5,
        color_texto_importante: screen_componente_estilos.textos.color_texto_importante.op5,
        color_fondo_botones:    screen_componente_estilos.botones.color_fondo_botones.op7,
        color_borde_botones:    screen_componente_estilos.botones.color_borde_botones.op13, 
        color_fondo_cards:      screen_componente_estilos.cards.color_fondo_cards.op9,   
        color_borde_cards:      screen_componente_estilos.cards.color_borde_cards.op13,
    },
  },
}


// ─────────────────────────────────────────────────────────────
//  TEMA ACTIVO — cambiá solo esta línea para cambiar el tema
// ─────────────────────────────────────────────────────────────
// export const tema_colores_activo = colores_temas.tema_17

// preferidos: 2,14,12,16,10