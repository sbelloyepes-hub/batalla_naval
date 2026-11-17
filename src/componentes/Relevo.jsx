/**
 * Pantalla de relevo: oculta los tableros mientras se pasa el dispositivo.
 * Si viene de un turno de batalla, informa al jugador entrante qué le hizo
 * su rival (R13: "¡Fuiste impactado!").
 */
export default function Relevo({ hacia, siguiente, informe, alEstarListo }) {
  return (
    <div className="panel centrado">
      <h2>Turno del Jugador {hacia + 1}</h2>
      <p className="ayuda">Pasa el dispositivo al Jugador {hacia + 1}. ¡El rival no debe mirar!</p>

      {siguiente === "batalla" && informe.length > 0 && (
        <ul className="informe">
          {informe.map((evento, i) => (
            <li key={i} className={evento.impacto ? "impacto" : ""}>
              {evento.tiempoAgotado
                ? "Tu oponente perdió su turno por tiempo agotado."
                : evento.impacto
                ? `💥 ¡Fuiste impactado! (${evento.coordenada})`
                : `Tu oponente disparó a ${evento.coordenada} y falló.`}
            </li>
          ))}
        </ul>
      )}

      <button className="btn principal" onClick={alEstarListo}>Estoy listo</button>
    </div>
  );
}
