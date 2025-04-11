
import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export const CreamCard: React.FC<BoxProps> = ({ children, ...props }) => {
    return (
        <Box
            bg="rgba(0, 0, 0, 0.8)"
            color="#FFFFFF"
            p={4}
            borderRadius="md"
            boxShadow="md"
            {...props}
        >
            {children}
        </Box>
    );
};
