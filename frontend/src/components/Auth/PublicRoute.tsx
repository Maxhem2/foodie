// Importieren der benötigten React-Module und Hooks
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Definition der Props für die PublicRoute-Komponente
type PublicRouteProps = {
  children: ReactNode;
};

// PublicRoute-Komponente, die sicherstellt, dass die Route nur für nicht authentifizierte Benutzer zugänglich ist
export const PublicRoute = (props: PublicRouteProps) => {
  // Authentifizierungs-Hook verwenden
  const auth = useAuth();
  // Navigation-Hook verwenden
  const navigate = useNavigate();
  // Location-Hook verwenden, um den aktuellen Pfad zu erhalten
  const location = useLocation();
  // Zustandsvariable für die Überprüfung, ob der Benutzer authentifiziert ist
  const [isVerified, setIsVerified] = useState(false);

  // Effekt wird beim Rendern der Komponente aufgerufen
  useEffect(() => {
    // Überprüfen, ob der Benutzer authentifiziert ist
    if (auth.isAuthenticated) {
      // Benutzer ist authentifiziert, zur Startseite weiterleiten
      navigate("/", { replace: true, state: { from: location } });
    } else {
      // Benutzer ist nicht authentifiziert, Markierung setzen
      setIsVerified(true);
    }
  }, [auth.isAuthenticated, location, navigate]);

  // Wenn die Überprüfung noch nicht abgeschlossen ist, null zurückgeben
  if (!isVerified) {
    return null;
  }
  // Andernfalls die Kinderkomponenten rendern
  return <>{props.children}</>;
};
