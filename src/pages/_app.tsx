import * as React from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from '@/components/ui/provider';
import { Toaster, toaster } from "@/components/ui/toaster"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>
        <Provider>
            <Header />
            <main className="main-content">
                <Toaster />
                <Component {...pageProps} />
            </main>
            <Footer />
        </Provider>
    </AuthProvider>
    
    ); 
}
