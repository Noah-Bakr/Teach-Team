import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, Input, Field, defineStyle } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <AbsoluteCenter>
      <Box position="relative" color={"white"} bg="white" p={4} borderRadius="md">
        <VStack>
          <VStack gap={4}>
            <Input placeholder="Email" variant={"outline"} size="md" color={"black"} />
            <Input placeholder="Password" type="password" variant={"outline"} size="md"/>
          </VStack>
          <ButtonGroup size="md" colorPalette="yellow">
            <Button variant="outline" onClick={() => setLoading(!loading)}>Cancel</Button>
            <Button variant="solid" loading={loading} onClick={() => setLoading(!loading)}>Login</Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </AbsoluteCenter>
  );
}
