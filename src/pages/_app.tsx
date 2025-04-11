import * as React from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from '@/components/ui/provider';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from "../context/AuthContext";
import DataInitialiser from "@/components/DataInitialiser";

export default function App({ Component, pageProps }: AppProps) {
    return(
    <AuthProvider>
        <DataInitialiser>
            <Provider>
                <Header />
                <main className="main-content">
                    <Toaster />
                    <Component {...pageProps} />
                </main>
                <Footer />
            </Provider>
        </DataInitialiser>
    </AuthProvider>
    
    ); 
}
