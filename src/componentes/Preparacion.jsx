/**
 * Fase de preparación (R11): el jugador organiza sus navíos antes de la batalla.
 */
import { useState } from "react";
import { NAVIOS } from "../constantes";
import { indice, casillasNavio, ocupadasPor, esValida, flotaAleatoria } from "../utilidades/logica";
import Tablero from "./Tablero";

export default function Preparacion({ jugador, alConfirmar }) {
  const [flota, setFlota] = useState({}); // navíos ya colocados
  const [seleccionado, setSeleccionado] = useState(NAVIOS[0].id); // navío a colocar
  const [horizontal, setHorizontal] = useState(true); // orientación actual
  const [sobre, setSobre] = useState(null); // casilla bajo el cursor
  const [error, setError] = useState("");

  const navio = NAVIOS.find((n) => n.id === seleccionado);
  const ocupadas = ocupadasPor(flota);
  const todosColocados = Object.keys(flota).length === NAVIOS.length;

  // Vista previa del navío seleccionado bajo el cursor (verde = válido, naranja = no)
  let casillasPrevia = [];
  let previaValida = false;
  if (navio && sobre) {
    const posicion = { fila: sobre[0], columna: sobre[1], horizontal };
    casillasPrevia = casillasNavio(navio.tamano, posicion);
    previaValida = esValida(navio, posicion, flota);
  }

  /** Recoge un navío ya colocado para volver a ubicarlo. */
  const recoger = (id) => {
    const { [id]: _quitado, ...resto } = flota;
    setFlota(resto);
    setSeleccionado(id);
    setError("");
  };

  /** Clic en una casilla: coloca el navío seleccionado o recoge uno existente. */
  const manejarClick = (fila, columna) => {
    if (!navio) {
      const id = ocupadas[indice(fila, columna)];
      if (id) recoger(id);
      return;
    }
    const posicion = { fila, columna, horizontal };
    if (!esValida(navio, posicion, flota)) {
      setError("No se puede colocar ahí: se sale del tablero o choca con otro navío.");
      return;
    }
    setFlota({ ...flota, [navio.id]: posicion });
    setError("");
    const siguiente = NAVIOS.find((n) => n.id !== navio.id && !flota[n.id]);
    setSeleccionado(siguiente ? siguiente.id : null);
  };

  const renderCasilla = (fila, columna) => {
    if (casillasPrevia.some(([f, c]) => f === fila && c === columna))
      return { clase: previaValida ? "previa-ok" : "previa-mala" };
    if (indice(fila, columna) in ocupadas) return { clase: "navio" };
    return {};
  };

  return (
    <div className="panel">
      <header className="pildora">
        <h2>Jugador {jugador + 1}: organiza tus navíos</h2>
        <p>
          Elige un navío, define su orientación y haz clic en la casilla donde
          empieza. Haz clic en un navío colocado para moverlo.
        </p>
      </header>

      <div className="disposicion-preparacion">
        <Tablero
          titulo="Tu tablero"
          renderCasilla={renderCasilla}
          flota={flota}
          previa={navio && sobre && previaValida ? { navio, posicion: { fila: sobre[0], columna: sobre[1], horizontal } } : null}
          alClickCasilla={manejarClick}
          alPasarSobreCasilla={(fila, columna) => setSobre([fila, columna])}
          alSalir={() => setSobre(null)}
        />

        <div className="controles">
          {NAVIOS.map((n) => (
            <button
              key={n.id}
              className={`btn btn-navio ${seleccionado === n.id ? "activo" : ""}`}
              onClick={() => (flota[n.id] ? recoger(n.id) : setSeleccionado(n.id))}
            >
              {n.nombre} ({n.tamano}) {flota[n.id] ? "✓" : ""}
            </button>
          ))}
          <button className="btn" onClick={() => setHorizontal((h) => !h)}>
            Orientación: {horizontal ? "Horizontal ↔" : "Vertical ↕"}
          </button>
          <button
            className="btn"
            onClick={() => {
              setFlota(flotaAleatoria());
              setSeleccionado(null);
              setError("");
            }}
          >
            🎲 Aleatorio
          </button>
          <button
            className="btn"
            onClick={() => {
              setFlota({});
              setSeleccionado(NAVIOS[0].id);
            }}
          >
            Limpiar
          </button>
          <button className="btn principal" disabled={!todosColocados} onClick={() => alConfirmar(flota)}>
            Confirmar flota
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
