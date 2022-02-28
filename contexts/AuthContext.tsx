import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  AuthProvider,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../firebase/clientApp';

interface IAuthContext {
  user: any;
  login?: (type) => Promise<void>;
  logout?: () => void;
}

const initialState = {
  user: null,
};

const UserContext = createContext<IAuthContext>(initialState);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(() => user);
    }
  });

  const login = async (type?: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      let provider: AuthProvider;

      switch (type) {
        default:
          provider = new GoogleAuthProvider();
        case 'Github':
          provider = new GithubAuthProvider();
      }

      let res = await signInWithPopup(auth, provider);
      const user = res.user;
      setUser(user);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    auth
      .signOut()
      .then(() => setUser(null))
      .then(() => window.location.reload());
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

export const useAuth = () => useContext(UserContext);

export default AuthProvider;
