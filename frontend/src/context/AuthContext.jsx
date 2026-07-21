import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // MongoDB user document (has role, wishlist, etc.)
  const [loading, setLoading] = useState(true);

  const syncProfile = async (name, role) => {
    const { data } = await api.post("/auth/sync", { name, role });
    setProfile(data.user);
    return data.user;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const { data } = await api.get("/auth/me");
          setProfile(data.user);
        } catch {
          // profile not yet synced (first login) — sync will happen from signup/login calls
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async ({ name, email, password, role }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await syncProfile(name, role);
    toast.success(`Welcome to ShopSmart AI, ${name}! 🎉`);
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    await syncProfile();
    toast.success("Welcome back! 👋");
  };

  const loginWithGoogle = async (role = "customer") => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncProfile(cred.user.displayName, role);
    toast.success("Signed in with Google 🎉");
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    toast.success("Signed out — see you soon!");
  };

  const value = {
    firebaseUser,
    profile,
    loading,
    isAuthenticated: !!firebaseUser,
    role: profile?.role || "customer",
    register,
    login,
    loginWithGoogle,
    logout,
    refreshProfile: async () => {
      const { data } = await api.get("/auth/me");
      setProfile(data.user);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
