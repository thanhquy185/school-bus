import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import useCallApi from "../api/useCall";

type UserAuth = {
  accessToken: string,
  email: string,
  expiresAt: number,
  issuedAt: number,
  role: string
};

type AuthContext = {
  token: string | null,
  accountId: number | null,
  username: string | null,
  role: string | null,
  expiresAt: number | null,
  isAuthenticated: boolean,
  setAuth: (authResponse: UserAuth) => void,
  clearAuth: () => void
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [token, setToken] = useState<string>("");
  const [accountId, setAccountId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const { execute } = useCallApi();

  useEffect(() => {
    const authSessionStr = sessionStorage.getItem("CURRENT_USER");
    if (!authSessionStr) return;
    
    try {
      const authSession: UserAuth = JSON.parse(authSessionStr);
      if (authSession.expiresAt * 1000 > Date.now()) {
        setToken(authSession.accessToken);
        setExpiresAt(authSession.expiresAt);
        
        try {
          const payload: any = jwtDecode(authSession.accessToken);
          setAccountId(payload.id?.toString() || "");
          setUsername(payload.username || "");
          setRole(payload.role || "");
        } catch (decodeError) {
          console.error("Lỗi decode:", decodeError);
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      clearAuth();
    }
  }, []);

  useEffect(() => {
    if (!token || !expiresAt) return;

    const duration = expiresAt * 1000 - Date.now();

    if (duration <= 0) {
      clearAuth();
      return;
    }

    const timeOut = window.setTimeout(() => {
      clearAuth();
    }, duration);

    return () => window.clearTimeout(timeOut);
  }, [token, expiresAt]);

  // Function clear token
  const clearAuth = () => {
    setToken("");
    setAccountId(null);
    setUsername("");
    setRole("");
    setExpiresAt(0);
    sessionStorage.removeItem("CURRENT_USER");
  };

  // Function set variable
  const setAuth = (authResponse: UserAuth) => {
    setToken(authResponse.accessToken);
    setExpiresAt(authResponse.expiresAt);

    try {
      const payload: any = jwtDecode(authResponse.accessToken);
      setAccountId(payload.id);
      setUsername(payload.username);
      setRole(payload.role);
    } catch (error) {
      console.error("Lỗi:", error);
    }

    sessionStorage.setItem("CURRENT_USER", JSON.stringify(authResponse));
  };

  const value = useMemo(() => ({
    token,
    accountId,
    username,
    role,
    expiresAt,
    isAuthenticated: !!token,
    setAuth,
    clearAuth
  }), [token, expiresAt]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export { AuthProvider, useAuth };
export type { UserAuth };