"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { logout as apiLogout } from "@/api/auth";
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/config";

interface User {
  id: number;
  name: string;
  username: string | null;
  email: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  firebaseUser: FirebaseUser | null;
  setAuthenticated: (auth: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isFirebaseAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  firebaseUser: null,
  setAuthenticated: () => {},
  setUser: () => {},
  logout: async () => {},
  signInWithGoogle: async () => {},
  isFirebaseAuth: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFirebaseAuth, setIsFirebaseAuth] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setAuthenticated(true);
      const storedUser = Cookies.get("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data from cookies:", error);
          Cookies.remove("user");
          setUser(null);
        }
      }
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setAuthenticated(true);
        setIsFirebaseAuth(true);

        // Convert Firebase user to your user format
        const formattedUser: User = {
          id: parseInt(user.uid) || 0,
          name: user.displayName || "User",
          username: user.email,
          email: user.email || "",
          avatar: user.photoURL || "",
        };

        setUser(formattedUser);
        Cookies.set("user", JSON.stringify(formattedUser), { expires: 7 });

        // You can also get the Firebase ID token and store it
        user.getIdToken().then((token) => {
          Cookies.set("firebase_token", token, { expires: 7 });
        });
      } else {
        // User is signed out
        setFirebaseUser(null);
        if (isFirebaseAuth) {
          setAuthenticated(false);
          setUser(null);
          Cookies.remove("user");
          Cookies.remove("firebase_token");
        }
      }
    });

    return () => unsubscribe();
  }, [isFirebaseAuth]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful:", result.user);
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") {
        throw new Error("POPUP_CLOSED");
      } else if (firebaseError.code === "auth/cancelled-popup-request") {
        throw new Error("POPUP_CANCELLED");
      } else if (firebaseError.code === "auth/popup-blocked") {
        console.error("Popup was blocked by the browser");
        throw new Error(
          "Popup was blocked. Please allow popups for this site and try again."
        );
      } else {
        console.error("Google sign-in error:", error);
        throw error;
      }
    }
  };

  const logout = async (): Promise<void> => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      if (isFirebaseAuth) {
        // Firebase logout
        await firebaseSignOut(auth);
        setIsFirebaseAuth(false);
      } else {
        // Backend logout
        await apiLogout();
      }
    } catch (error) {
      console.error(
        "Logout API call failed, but proceeding with client-side logout:",
        error
      );
    } finally {
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("firebase_token");
      setAuthenticated(false);
      setUser(null);
      setFirebaseUser(null);
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        firebaseUser,
        setAuthenticated,
        setUser,
        logout,
        signInWithGoogle,
        isFirebaseAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
