import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, Input, Field } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from 'next/router';
import { DEFAULT_USERS, User } from '@/types/user';
import { PasswordInput } from "@/components/ui/password-input";

export default function Home() {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmptyInput = () => {
    if (email === '') {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (password === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

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
          <Field.Root color={"black"} invalid={emailError} required>
            <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
            <Input placeholder="john@example.com" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"} value={email} onChange={(e) => setEmail(e.target.value)}/>
            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>
          <Field.Root color={"black"} invalid={passwordError} required>
            <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
            <PasswordInput placeholder="Password" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"} value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>
          </VStack>
          <ButtonGroup size="md" colorPalette="yellow">
            <Button variant="outline" onClick={() => { setLoading(false) }} >Cancel</Button>
            <Button variant="solid" loading={loading} onClick={() => { handleEmptyInput() }} >Login</Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </AbsoluteCenter>
  );
}
