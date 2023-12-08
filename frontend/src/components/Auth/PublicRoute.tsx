import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type PublicRouteProps = {
  children: ReactNode;
};

// PublicRoute-Komponente, die sicherstellt, dass die Route nur für nicht authentifizierte Benutzer zugänglich ist
export const PublicRoute = (props: PublicRouteProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/", { replace: true, state: { from: location } });
    } else {
      setIsVerified(true);
    }
  }, [auth.isAuthenticated, location, navigate]);

  if (!isVerified) {
    return null;
  }
  return <>{props.children}</>;
};
