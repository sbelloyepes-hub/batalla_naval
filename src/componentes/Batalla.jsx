/**
 * Fase de batalla: tablero enemigo para disparar, tu flota y el temporizador (R9).
 */
import { useState, useEffect, useRef } from "react";
import { SEGUNDOS_TURNO } from "../constantes";
import { indice, ocupadasPor } from "../utilidades/logica";
import Tablero from "./Tablero";

export default function Batalla({ atacante, jugadores, mensaje, alDisparar, alAgotarTiempo, disparosEnTurno }) {
  const enemigo = jugadores[1 - atacante];
  const yo = jugadores[atacante];
  const [tiempoRestante, setTiempoRestante] = useState(SEGUNDOS_TURNO);

  // Guardamos la última versión del callback para evitar cierres obsoletos.
  const agotarRef = useRef(alAgotarTiempo);
  agotarRef.current = alAgotarTiempo;

  // R9: el reloj se reinicia al empezar el turno y tras cada impacto
  // (cambia `disparosEnTurno`), porque el jugador sigue disparando.
  useEffect(() => {
    setTiempoRestante(SEGUNDOS_TURNO);
    const id = setInterval(() => setTiempoRestante((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [disparosEnTurno]);

  // Al llegar a 0 el jugador pierde el turno.
  useEffect(() => {
    if (tiempoRestante <= 0) agotarRef.current();
  }, [tiempoRestante]);

  // Tablero enemigo: solo ves tus disparos (X = agua, 💥 = impacto). R12
  const renderEnemigo = (fila, columna) => {
    const disparo = enemigo.disparos[indice(fila, columna)];
    if (disparo === "impacto") return { clase: "impacto disparada", contenido: "💥" };
    if (disparo === "agua") return { clase: "agua disparada", contenido: "X" };
    return {};
  };

  // Tu tablero: tus navíos y los disparos que has recibido.
  const misNavios = ocupadasPor(yo.flota);
  const renderMio = (fila, columna) => {
    const i = indice(fila, columna);
    const disparo = yo.disparos[i];
    const base = i in misNavios ? "navio" : "";
    if (disparo === "impacto") return { clase: `${base} impacto`, contenido: "💥" };
    if (disparo === "agua") return { clase: "agua", contenido: "X" };
    return { clase: base };
  };

  return (
    <div className="panel">
      <div className="estado">
        <h2>Turno del Jugador {atacante + 1}</h2>
        <span className={`temporizador ${tiempoRestante <= 10 ? "alerta" : ""}`}>
          ⏱ {Math.max(tiempoRestante, 0)} s
        </span>
      </div>
      <div className={`mensaje ${mensaje?.tipo ?? ""}`}>
        {mensaje?.texto ?? "Elige una casilla del tablero enemigo."}
      </div>

      <div className="disposicion-batalla">
        <Tablero titulo="Tablero enemigo (dispara aquí)" renderCasilla={renderEnemigo} alClickCasilla={alDisparar} />
        <Tablero titulo="Tu flota" renderCasilla={renderMio} flota={yo.flota} deshabilitado />
      </div>
    </div>
  );
}
