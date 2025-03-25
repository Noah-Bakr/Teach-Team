import { Button, HStack, ButtonGroup } from "@chakra-ui/react"

export default function Home() {
  return (
    <ButtonGroup gap='4'>
      <Button colorScheme='whiteAlpha'>WhiteAlpha</Button>
      <Button colorScheme='blackAlpha'>BlackAlpha</Button>
    </ButtonGroup>
  );
}
