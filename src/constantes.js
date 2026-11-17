/**
 * Constantes con las reglas del juego (Acta 001).
 */
import imgAcorazado from "./assets/barcos/acorazado.png";
import imgPortaaviones from "./assets/barcos/portaaviones.png";
import imgDestructor from "./assets/barcos/destructor.png";

/** R1: tablero cuadriculado de 6x6 = 36 casillas. */
export const TAMANO = 6;

/** R7: filas con letras y columnas con números -> coordenadas (ej. B4). */
export const LETRAS = ["A", "B", "C", "D", "E", "F"];

/** R9: segundos disponibles por disparo. */
export const SEGUNDOS_TURNO = 30;

/**
 * R2: tres navíos por jugador con tamaños 4, 5 y 3.
 * `imagen`: PNG del navío, dibujado en vertical con la proa hacia arriba.
 * Para usar tus propios dibujos, reemplaza los archivos de src/assets/barcos/.
 */
export const NAVIOS = [
  { id: "acorazado", nombre: "Acorazado", tamano: 4, imagen: imgAcorazado },
  { id: "portaaviones", nombre: "Portaaviones", tamano: 5, imagen: imgPortaaviones },
  { id: "destructor", nombre: "Destructor", tamano: 3, imagen: imgDestructor },
];
