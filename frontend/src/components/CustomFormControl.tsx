import React from 'react';
import { Box, Text } from '@chakra-ui/react';

// Custom Form Notifications for Validation
interface CustomFormControlProps {
    error?: string;
    children: React.ReactNode;
}

const CustomFormControl: React.FC<CustomFormControlProps> = ({ error, children }) => (
    <Box>
        {children}
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
    </Box>
);

export default CustomFormControl;