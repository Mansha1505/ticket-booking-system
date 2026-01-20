import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState("user");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Sync with backend to get role
                try {
                    const token = await user.getIdToken();
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    // Ideally we call /api/auth/sync or /api/auth/me here
                    // For now, let's assume valid token means we are good, 
                    // but we need to fetch the ROLE from our backend or custom claims.
                    // We will do a quick fetch to 'me'

                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const { data } = await axios.post(`${apiUrl}/auth/sync`, { token }); // quick sync

                    setCurrentUser({ ...user, ...data }); // merge firebase user with mongo user
                    setUserRole(data.role);

                } catch (error) {
                    console.error("Auth Sync Error", error);
                    // Fallback
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
                setUserRole("user");
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
