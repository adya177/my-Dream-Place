import { useState, useEffect } from "react";
import { useAuth } from "../../context/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setChecking(true);
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/api/user-auth`,
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );
        if (isCurrent) setOk(res.data.ok);
      } catch (error) {
        console.error("Authorization check failed:", error.message);
        if (isCurrent) setOk(false);
      } finally {
        if (isCurrent) setChecking(false);
      }
    };
    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
      setChecking(false);
    }
    return () => {
      isCurrent = false;
    };
  }, [auth?.token]);

  if (checking) return <Spinner />;
  return ok ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
