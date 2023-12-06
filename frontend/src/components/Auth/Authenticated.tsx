import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type AuthenticatedProps = {
  children: ReactNode
}

export const Authenticated = (props: AuthenticatedProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login", { replace: true, state: { from: location } });
    } else {
      setIsVerified(true);
    }
  }, [auth.isAuthenticated, location, navigate]);

  if (!isVerified) {
    return null;
  }
  return <>{props.children}</>;
};
