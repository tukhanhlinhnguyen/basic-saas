import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/authentication';
const backendUrl = process.env.REACT_APP_BACKEND_URL;
// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER'
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username') || '';
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken, username);

          //const response = await axios.get('/api/account/my-account');
          //const { user } = response.data;

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: null
            }
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${backendUrl}/api/auth/local`, {
      identifier: email,
      password: password
    });
    const { jwt, user } = response.data;
    setSession(jwt, user.username);
    dispatch({
      type: Types.Login,
      payload: {
        user
      }
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post(`${backendUrl}/api/auth/local/register`, {
      username: `${firstName} ${lastName}`,
      email: email,
      password: password
    });
    const { accessToken, user } = response.data;

    setSession(accessToken, user.username);

    dispatch({
      type: Types.Register,
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null, '');
    dispatch({ type: Types.Logout });
  };

  const resetPassword = async (email: string) => {
    return axios
      .post(`${backendUrl}/api/auth/forgot-password`, {
        email: email // user's email
      })
      .then((response) => {
        console.log('Your user received an email');
        return response;
      })
      .catch((error) => {
        console.log('An error occurred:', error.response);
        return error;
      });
  };

  const updatePassword = (code: string, password: string, passwordConfirmation: string) => {
    return axios
      .post(`${backendUrl}/api/auth/reset-password`, {
        code: code, // code contained in the reset link
        password: password,
        passwordConfirmation: passwordConfirmation
      })
      .then((response) => {
        console.log("Your user's password has been reset.");
        return response;
      })
      .catch((error) => {
        console.log('An error occurred:', error.response);
        return error;
      });
  };

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
