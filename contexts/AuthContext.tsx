import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { createContext, useContext, useState } from 'react';

import { auth } from '../firebase/clientApp';

interface IAuthContext {
  user: any;
  login?: (type) => Promise<void>;
  logout?: () => void;
}

const initialState = {
  user: null,
};

const provider = new GoogleAuthProvider();

const providerGithub = new GithubAuthProvider();

const UserContext = createContext<IAuthContext>(initialState);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  const login = async (type) => {
    try {
      let res = await signInWithPopup(auth, provider);
      let credential = GoogleAuthProvider.credentialFromResult(res);

      if (type === 'Github') {
        res = await signInWithPopup(auth, providerGithub);
        credential = GithubAuthProvider.credentialFromResult(res);
      }

      const token = credential?.accessToken;
      const user = res.user;

      console.log('USER --->', user);

      setUser(user);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

export const useAuth = () => useContext(UserContext);

export default AuthProvider;
