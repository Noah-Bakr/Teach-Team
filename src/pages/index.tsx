import { Button, HStack, ButtonGroup, VStack } from "@chakra-ui/react";
import { useState } from "react";



export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <VStack>
      <ButtonGroup size="md" colorPalette="yellow">
        <Button variant="outline" onClick={() => setLoading(!loading)}>Cancel</Button>
        <Button variant="solid" loading={loading} onClick={() => setLoading(!loading)}>Login</Button>
      </ButtonGroup>
    </VStack>
  );
}
