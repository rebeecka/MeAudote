import React, { useState, createContext, ReactNode, useEffect } from "react";
import { Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { LoginResponse } from "../lib/loginresponse";
import { API_URL } from "../lib/constants";

type AuthContextData = {
    isAuthenticated: boolean;
    userId: string;
    accessToken: string;
    imageProfile: string;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
};

type AuthProviderProps = {
    children: ReactNode;
};

type SignInProps = {
    email: string;
    password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [imageProfile, setImageProfile] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        async function getUser() {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const image = await SecureStore.getItemAsync('picture');
            const userIdSave = await SecureStore.getItemAsync('userId');

            if (accessToken && userIdSave) {
                setIsAuthenticated(true);
                setAccessToken(accessToken);
                setUserId(userIdSave);
                setImageProfile(`${API_URL}files/${image}`);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            }

            setLoading(false);
        }

        getUser();
    }, [])

    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true);

        try {
            const response = await api.post<LoginResponse>('/auth/login', {
                email,
                password
            });

            const { id, image = '', access_token } = response.data;

            await SecureStore.setItemAsync('accessToken', access_token);
            await SecureStore.setItemAsync('picture', image);
            await SecureStore.setItemAsync('userId', id);

            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setIsAuthenticated(true);
            setAccessToken(access_token);
            setUserId(id);
            setImageProfile(`${API_URL}files/${image}`);

            setLoadingAuth(false);
        } catch (error) {
            Alert.alert('E-mail e/ou senha inválidos');
            setLoadingAuth(false);
        }
    }

    async function signOut() {
        Alert.alert('Sair', 'Tem certeza que deseja sair?', [
            {
                text: 'Cancelar',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'Sair', onPress: async () => {
                    await SecureStore.deleteItemAsync('accessToken');
                    await SecureStore.deleteItemAsync('picture');
                    api.defaults.headers.common['Authorization'] = '';
                    setIsAuthenticated(false);
                    setImageProfile('');
                }
            },
        ]);
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userId,
            accessToken,
            imageProfile,
            signIn,
            signOut,
            loadingAuth,
            loading
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}