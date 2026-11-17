/**
 * Pantalla final (R10): mensaje para el ganador y para el perdedor.
 */
export default function FinJuego({ resultado, alReiniciar }) {
  const perdedor = 1 - resultado.ganador;
  return (
    <div className="panel centrado">
      <h2>¡Fin del juego!</h2>
      <p className="ayuda">El Jugador {resultado.ganador + 1} hundió el {resultado.nombreNavio} enemigo.</p>
      <div className="resultado victoria">🏆 Jugador {resultado.ganador + 1}: ¡Has ganado!</div>
      <div className="resultado derrota">💀 Jugador {perdedor + 1}: Has perdido.</div>
      <button className="btn principal" onClick={alReiniciar}>Jugar de nuevo</button>
    </div>
  );
}
