import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    /*
    * every input has a form variable. on change update variable. onlick compare to localstorage
    * if they are the same, set loading to true and redirect to /dashboard
    * if they are not the same, set loading to false and show error message
    * will turn this into a component later
    */

    <AbsoluteCenter>
      <Box position="relative" color={"white"} bg="white" p={4} borderRadius="md">
        <VStack>
          <VStack gap={4}>
            <Input placeholder="Email" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"}/>
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
