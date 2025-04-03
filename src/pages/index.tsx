import LoginForm from "@/components/LoginForm";
import { Box, Button, Heading, Image, Skeleton, Stack, Text } from "@chakra-ui/react"

//     src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />



export default function Home() {


  return (
    <Box position="relative" height="100vh">
      <Image
        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Hero background"
        objectFit="cover"
        position="absolute"
        width="100%"
        height="100%"
        zIndex="-1"
        opacity={0.5}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        textAlign="center"
        px={4}

      >
        <Stack gap={6} maxW="lg" color="white">
          <Heading >
            Welcome to My Website!
          </Heading>
          <Text>
            Insert a brief description of your website here. This is a great place to introduce your site and its purpose.
          </Text>
          <Button colorPalette="yellow" variant="solid">
            Get Started
          </Button>
        </Stack>
      </Box>
    </Box>
      
   
  );
}
