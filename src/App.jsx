/**
 * BATALLA NAVAL — React + JavaScript + HTML + CSS  (Acta 001, R14)
 *
 * Componente raíz: controla las fases, los turnos y las reglas del juego.
 * Juego 1 vs 1 en un mismo dispositivo; entre turnos aparece una pantalla de
 * relevo para que el rival no vea el tablero del otro.
 *
 * Fases (estado `fase`):
 *   preparacion -> el jugador en turno organiza sus navíos        (R11)
 *   relevo      -> pantalla "pasa el dispositivo"
 *   batalla     -> fase de disparos con temporizador              (R6, R9)
 *   fin         -> mensajes de ganador / perdedor                 (R10)
 */
import { useState } from "react";
import "./App.css";
import { NAVIOS } from "./constantes";
import { coordenada, indice, casillasNavio, ocupadasPor, jugadorVacio } from "./utilidades/logica";
import Preparacion from "./componentes/Preparacion";
import Relevo from "./componentes/Relevo";
import Batalla from "./componentes/Batalla";
import FinJuego from "./componentes/FinJuego";

export default function App() {
  const [fase, setFase] = useState("preparacion"); // preparacion | relevo | batalla | fin
  const [actual, setActual] = useState(0); // jugador que actúa (0 o 1) — R8
  const [jugadores, setJugadores] = useState([jugadorVacio(), jugadorVacio()]);
  const [relevo, setRelevo] = useState(null); // { hacia, siguiente } para la pantalla de relevo
  const [eventos, setEventos] = useState([]); // disparos del turno actual
  const [informe, setInforme] = useState([]); // resumen del turno anterior (para el rival)
  const [mensaje, setMensaje] = useState(null); // { texto, tipo } de impacto / agua
  const [bloqueado, setBloqueado] = useState(false); // bloquea clics tras fallar
  const [resultado, setResultado] = useState(null); // { ganador, nombreNavio }

  /** Guarda la flota del jugador actual y pasa a la pantalla de relevo. */
  const confirmarFlota = (flota) => {
    setJugadores((lista) => lista.map((j, i) => (i === actual ? { ...j, flota } : j)));
    setRelevo(actual === 0 ? { hacia: 1, siguiente: "preparacion" } : { hacia: 0, siguiente: "batalla" });
    setFase("relevo");
  };

  /** El jugador entrante pulsa "Estoy listo". */
  const relevoListo = () => {
    setActual(relevo.hacia);
    if (relevo.siguiente === "batalla") {
      setEventos([]);
      setMensaje(null);
      setBloqueado(false);
    }
    setFase(relevo.siguiente);
  };

  /** Termina el turno y cede el control al rival. */
  const pasarTurno = (eventosDelTurno) => {
    setInforme(eventosDelTurno);
    setRelevo({ hacia: 1 - actual, siguiente: "batalla" });
    setFase("relevo");
  };

  /** Procesa un disparo del jugador actual contra el rival. */
  const disparar = (fila, columna) => {
    if (bloqueado) return;
    const defensor = 1 - actual;
    const i = indice(fila, columna);

    // R12: una casilla ya disparada (X o impacto) no se puede repetir.
    if (jugadores[defensor].disparos[i]) return;

    const idNavioImpactado = ocupadasPor(jugadores[defensor].flota)[i];
    const impacto = Boolean(idNavioImpactado);

    // Registrar el disparo en el tablero del defensor
    const disparos = jugadores[defensor].disparos.slice();
    disparos[i] = impacto ? "impacto" : "agua";
    setJugadores(jugadores.map((j, k) => (k === defensor ? { ...j, disparos } : j)));

    const nuevosEventos = [...eventos, { coordenada: coordenada(fila, columna), impacto }];
    setEventos(nuevosEventos);

    if (impacto) {
      // R3: si el navío quedó completamente impactado, el juego termina.
      const navio = NAVIOS.find((n) => n.id === idNavioImpactado);
      const hundido = casillasNavio(navio.tamano, jugadores[defensor].flota[navio.id]).every(
        ([f, c]) => disparos[indice(f, c)] === "impacto"
      );
      if (hundido) {
        setResultado({ ganador: actual, nombreNavio: navio.nombre });
        setFase("fin");
        return;
      }
      // R6 + R13: acierto -> sigue su turno y ve "¡Has impactado!".
      setMensaje({ texto: "💥 ¡Has impactado! Sigue disparando.", tipo: "impacto" });
    } else {
      // R6: fallo -> turno del otro jugador (tras una breve pausa para ver la X).
      setMensaje({ texto: "Agua... pierdes el turno.", tipo: "agua" });
      setBloqueado(true);
      setTimeout(() => pasarTurno(nuevosEventos), 1200);
    }
  };

  /** R9: se acabó el tiempo -> se pierde el turno. */
  const tiempoAgotado = () => {
    if (bloqueado) return;
    setBloqueado(true);
    pasarTurno([...eventos, { tiempoAgotado: true }]);
  };

  /** Reinicia todo el juego. */
  const reiniciar = () => {
    setJugadores([jugadorVacio(), jugadorVacio()]);
    setActual(0);
    setEventos([]);
    setInforme([]);
    setMensaje(null);
    setBloqueado(false);
    setResultado(null);
    setFase("preparacion");
  };

  return (
    <main className="app">
      <h1>Batalla Naval</h1>
      {fase === "preparacion" && <Preparacion key={actual} jugador={actual} alConfirmar={confirmarFlota} />}
      {fase === "relevo" && <Relevo {...relevo} informe={informe} alEstarListo={relevoListo} />}
      {fase === "batalla" && (
        <Batalla
          atacante={actual}
          jugadores={jugadores}
          mensaje={mensaje}
          alDisparar={disparar}
          alAgotarTiempo={tiempoAgotado}
          disparosEnTurno={eventos.length}
        />
      )}
      {fase === "fin" && <FinJuego resultado={resultado} alReiniciar={reiniciar} />}
    </main>
  );
}
