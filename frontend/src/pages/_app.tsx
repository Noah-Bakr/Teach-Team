import * as React from 'react';
import type { AppProps } from "next/app";
import { Container } from '@chakra-ui/react';
import { Provider } from '@/components/ui/provider';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import '../styles/Header.css';
import '../styles/Footer.css';
import '../styles/Lecturer.css';
import '../styles/Navbar.css';
import '../styles/drawerStyles.css';

export default function App({ Component, pageProps }: AppProps) {
    return(
    <AuthProvider>
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
    </AuthProvider>
    ); 
}
