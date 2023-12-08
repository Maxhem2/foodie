// Importieren der Styles für die FallingStars-Komponente
import "./FallingStars.css";

// FallingStars-Komponente, die fallende Sterne darstellt
const FallingStars = () => {
  return (
    // Container für die Sterne mit entsprechenden Klassen
    <div className="stars-container">
      {/* Einzelne Sterne mit unterschiedlichen Klassen */}
      <div className="star star1"></div>
      <div className="star star2"></div>
      <div className="star star3"></div>
    </div>
  );
};

// Exportieren der FallingStars-Komponente für die Verwendung in anderen Dateien
export default FallingStars;
