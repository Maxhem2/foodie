import "./FallingStars.css";

const FallingStars = () => {
  return (
    <div className="stars-container">
      {/* Einzelne Sterne mit unterschiedlichen Klassen */}
      <div className="star star1"></div>
      <div className="star star2"></div>
      <div className="star star3"></div>
    </div>
  );
};

export default FallingStars;
