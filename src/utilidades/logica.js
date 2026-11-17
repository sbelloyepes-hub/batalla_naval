/**
 * Funciones puras de la lógica del juego (no dependen de React).
 */
import { TAMANO, LETRAS, NAVIOS } from "../constantes";

/** Nombre legible de una casilla, p. ej. (1, 3) -> "B4". */
export const coordenada = (fila, columna) => `${LETRAS[fila]}${columna + 1}`;

/** Índice plano (0..35) de una casilla. */
export const indice = (fila, columna) => fila * TAMANO + columna;

/**
 * Casillas que ocupa un navío.
 * R4: solo horizontal o vertical (sin diagonales).
 * @param {number} tamano  largo del navío
 * @param {{fila:number, columna:number, horizontal:boolean}} posicion
 * @returns {Array<[number, number]>} lista de [fila, columna]
 */
export function casillasNavio(tamano, posicion) {
  return Array.from({ length: tamano }, (_, i) =>
    posicion.horizontal
      ? [posicion.fila, posicion.columna + i]
      : [posicion.fila + i, posicion.columna]
  );
}

/**
 * Mapa { índiceCasilla: idNavío } con las casillas ocupadas por una flota.
 * @param {object} flota        { idNavío: posición }
 * @param {string} [ignorarId]  navío que se omite (el que se está moviendo)
 */
export function ocupadasPor(flota, ignorarId) {
  const mapa = {};
  NAVIOS.forEach((navio) => {
    if (navio.id === ignorarId || !flota[navio.id]) return;
    casillasNavio(navio.tamano, flota[navio.id]).forEach(([fila, columna]) => {
      mapa[indice(fila, columna)] = navio.id;
    });
  });
  return mapa;
}

/**
 * Una posición es válida si todo el navío queda dentro del tablero y no
 * comparte casilla con otro navío (R5: misma línea sí, misma casilla no).
 */
export function esValida(navio, posicion, flota) {
  const ocupadas = ocupadasPor(flota, navio.id);
  return casillasNavio(navio.tamano, posicion).every(
    ([fila, columna]) =>
      fila >= 0 && fila < TAMANO &&
      columna >= 0 && columna < TAMANO &&
      !(indice(fila, columna) in ocupadas)
  );
}

/** Genera una flota aleatoria válida (botón "Aleatorio"). */
export function flotaAleatoria() {
  const flota = {};
  const azar = (n) => Math.floor(Math.random() * n);
  NAVIOS.forEach((navio) => {
    let posicion;
    do {
      posicion = { fila: azar(TAMANO), columna: azar(TAMANO), horizontal: Math.random() < 0.5 };
    } while (!esValida(navio, posicion, flota));
    flota[navio.id] = posicion;
  });
  return flota;
}

/** Estado inicial de un jugador: flota vacía y sin disparos recibidos. */
export const jugadorVacio = () => ({
  flota: {}, // { idNavío: {fila, columna, horizontal} }
  disparos: Array(TAMANO * TAMANO).fill(null), // disparos RECIBIDOS: null | "impacto" | "agua"
});
