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
import {initializeApp, getApps} from "firebase/app";

// Initialize Firebase app if not already initialized
let firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp;
if (!getApps().length && firebaseConfig.apiKey) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
  } catch (error: any) {
    console.error("Firebase initialization error", error.message);
  }
}

const auth = firebaseApp ? getAuth(firebaseApp) : null;

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
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (auth) {
        await signInWithPopup(auth, provider);
      } else {
        throw new Error("Firebase auth is not initialized.");
      }
    } catch (error) {
      console.error("Google sign-in error", error);
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw new Error("Firebase auth is not initialized.");
      }
    } catch (error) {
      console.error("Email sign-in error", error);
      throw error;
    }
  };

  const createUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
      if (auth) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        throw new Error("Firebase auth is not initialized.");
      }
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  };

  const signOutFunc = async () => {
    try {
      if (auth) {
        await signOut(auth);
      } else {
        throw new Error("Firebase auth is not initialized.");
      }
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
  const authContext = useAuth();
  return authContext.user;
};

    