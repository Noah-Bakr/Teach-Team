import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import {system} from "@chakra-ui/react/preset";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ChakraProvider value={system}>
            {children}
        </ChakraProvider>
    );
};

const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };