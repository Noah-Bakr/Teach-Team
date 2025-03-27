import * as React from 'react'
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from '@/components/ui/provider';
import Header from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {
  return(
    <Provider>
        <Header />
        <Component {...pageProps} />
    </Provider>
    ); 
}
