'use client';

import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {initializeApp} from "firebase/app";
import { firebaseConfig } from './firebaseConfig';

try {
  initializeApp(firebaseConfig);
} catch (e: any) {
  // Ignore error if app is already initialized
  if (e.code !== 'app/duplicate-app') {
    console.error("Firebase initialization error", e);
  }
}

const auth = getAuth();

interface AuthContextProps {
  user: any;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error", error);
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email sign-in error", error);
      throw error;
    }
  };

  const createUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  };

  const signOutFunc = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error", error);
      throw error;
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    signInWithGoogle,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut: signOutFunc,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useUser = () => {
  const auth = useAuth();
  return auth.user;
};
