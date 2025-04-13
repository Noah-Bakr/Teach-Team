import * as React from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Container } from '@chakra-ui/react';
import { Provider } from '@/components/ui/provider';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from "@/context/AuthContext";
import DataInitialiser from "@/components/DataInitialiser";

export default function App({ Component, pageProps }: AppProps) {
    return(
    <AuthProvider>
        <DataInitialiser>
            <Provider>
                <Header />
                <Container maxW="1400px" py={2} px={2}>
                <main className="main-content">
                    <Toaster />
                    <Component {...pageProps} />
                </main>
                </Container>
                <Footer />
            </Provider>
        </DataInitialiser>
    </AuthProvider>
    
    ); 
}
