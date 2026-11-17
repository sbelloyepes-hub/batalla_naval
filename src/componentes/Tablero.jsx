/**
 * Tablero reutilizable con coordenadas (R7): números arriba y letras a la izquierda.
 * El contenido de cada casilla lo decide `renderCasilla(fila, columna)`,
 * que devuelve { clase, contenido }.
 *
 * Los navíos se dibujan con su PNG encima de la cuadrícula (`flota`), y la
 * vista previa al colocar uno (`previa`) se muestra como un PNG translúcido.
 */
import { TAMANO, LETRAS, NAVIOS } from "../constantes";
import { coordenada } from "../utilidades/logica";

/** PNG de un navío ocupando su rectángulo de casillas (celda 0,0 = fila 2, col 2 de la grilla). */
function Barco({ navio, posicion, previa = false }) {
  const { fila, columna, horizontal } = posicion;
  const estilo = {
    gridRow: `${fila + 2} / span ${horizontal ? 1 : navio.tamano}`,
    gridColumn: `${columna + 2} / span ${horizontal ? navio.tamano : 1}`,
    "--largo": navio.tamano,
  };
  return (
    <div
      className={`barco ${horizontal ? "horizontal" : "vertical"} ${previa ? "previa" : ""}`}
      style={estilo}
      aria-hidden="true"
    >
      <img src={navio.imagen} alt="" draggable="false" />
    </div>
  );
}

export default function Tablero({
  titulo,
  renderCasilla,
  alClickCasilla,
  alPasarSobreCasilla,
  alSalir,
  deshabilitado,
  flota = {},
  previa = null, // { navio, posicion } -> solo si es válida y cabe en el tablero
}) {
  return (
    <section className="tablero-contenedor">
      <h3>{titulo}</h3>
      <div className="tablero" onMouseLeave={alSalir}>
        <div className="etiqueta esquina" style={{ gridRow: 1, gridColumn: 1 }} />
        {Array.from({ length: TAMANO }, (_, columna) => (
          <div key={`n${columna}`} className="etiqueta" style={{ gridRow: 1, gridColumn: columna + 2 }}>
            {columna + 1}
          </div>
        ))}
        {Array.from({ length: TAMANO }, (_, fila) => (
          <div key={`l${fila}`} className="etiqueta" style={{ gridRow: fila + 2, gridColumn: 1 }}>
            {LETRAS[fila]}
          </div>
        ))}

        {/* Navíos (debajo de las casillas; los clics los reciben las casillas) */}
        {NAVIOS.filter((n) => flota[n.id]).map((n) => (
          <Barco key={n.id} navio={n} posicion={flota[n.id]} />
        ))}
        {previa && <Barco navio={previa.navio} posicion={previa.posicion} previa />}

        {Array.from({ length: TAMANO }).flatMap((_, fila) =>
          Array.from({ length: TAMANO }, (_, columna) => {
            const { clase = "", contenido = null } = renderCasilla(fila, columna);
            return (
              <button
                key={`${fila}-${columna}`}
                className={`casilla ${clase}`}
                style={{ gridRow: fila + 2, gridColumn: columna + 2 }}
                aria-label={coordenada(fila, columna)}
                disabled={deshabilitado}
                onClick={() => alClickCasilla?.(fila, columna)}
                onMouseEnter={() => alPasarSobreCasilla?.(fila, columna)}
              >
                {contenido}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
