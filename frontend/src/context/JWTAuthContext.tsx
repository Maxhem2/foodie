import { createContext, useEffect, useReducer, useRef } from "react";
import axiosInstance from "../services/axios";
import { validateToken } from "../utils/jwt";
import { resetSession, setSession } from "../utils/session";
import { User } from "types";

type State = {
  isAuthenticated: boolean,
  isInitialized: boolean,
  user: User | null
}

type InitializeAction = { type: 'INITIALIZE'; payload: { isAuthenticated: boolean; user: User | null } }
type LoginAction = { type: 'LOGIN'; payload: { user: User | null } }
type LogoutAction = { type: 'LOGOUT' }

type Action = InitializeAction | LoginAction | LogoutAction

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

export const AuthContext = createContext({
  ...initialState,
  login: (email: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
});

const handlers = {
  INITIALIZE: (state: State, action: InitializeAction) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: State, action: LoginAction) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state: State, action: Action) => {
  const handler = handlers[action.type] as (state: State, action: Action) => State;
  return handler ? handler(state, action) : state;
};

export const AuthProvider = (props: any) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && validateToken(accessToken)) {
          setSession(accessToken);

          const response = await axiosInstance.get("/users/me");
          const { data: user } = response;
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    initialize();
    isMounted.current = true;
  }, []);

  const getTokens = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      setSession(response.data.access_token, response.data.refresh_token);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await getTokens(email, password);
      const response = await axiosInstance.get("/users/me");
      const { data: user } = response;
      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const logout = () => {
    resetSession();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: login,
        logout: (async () => logout()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
