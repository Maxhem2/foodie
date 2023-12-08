import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Typdefinition für die Props des Authenticated-Komponenten
type AuthenticatedProps = {
  children: ReactNode;
};

// Authenticated-Komponente, die sicherstellt, dass der Benutzer authentifiziert ist
export const Authenticated = (props: AuthenticatedProps) => {
  // Authentifizierungshook verwenden
  const auth = useAuth();
  // Navigation-Hook verwenden
  const navigate = useNavigate();
  // Location-Hook verwenden, um den aktuellen Pfad zu erhalten
  const location = useLocation();
  // Zustandsvariable für die Überprüfung, ob der Benutzer authentifiziert ist
  const [isVerified, setIsVerified] = useState(false);

  // Effekt wird beim Rendern der Komponente aufgerufen
  useEffect(() => {
    // Überprüfen, ob der Benutzer nicht authentifiziert ist
    if (!auth.isAuthenticated) {
      // Den Benutzer zur Login-Seite weiterleiten
      navigate("/login", { replace: true, state: { from: location } });
    } else {
      // Benutzer ist authentifiziert, Markierung setzen
      setIsVerified(true);
    }
  }, [auth.isAuthenticated, location, navigate]);

  // Wenn die Überprüfung noch nicht abgeschlossen ist, null zurückgeben
  if (!isVerified) {
    return null;
  }
  return <>{props.children}</>;
};
