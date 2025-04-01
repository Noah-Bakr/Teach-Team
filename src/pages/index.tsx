import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, Input, Field, IconButton, Heading, Text, CloseButton, Presence, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { DEFAULT_USERS, User } from '@/testData/user';
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { LuX } from "react-icons/lu";
import { on } from "events";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, currentUser } = useAuth();

  const [loginVisibility, setLoginVisibility] = useState("");

  // Load saved users from localStorage
  useEffect(() => {
    setLoginVisibility("open");
    onToggle();
  }, []);

  const handleLogin = () => {
    // Check if email and password are empty. "return" prevents the rest of the function from executing
    if (email === '') {
      setEmailError(true);
      return;
    } else { setEmailError(false); }
    if (password === '') {
      setPasswordError(true);
      return;
    } else { setPasswordError(false); }

    setError("");

    const success = login(email, password);
    if (success) {
      //TODO: figure out how to make toaster stay to dashbaord
      if (currentUser) {
        toaster.create({ title: "Login Successful", description: `Welcome back, ${currentUser.firstName}!`, status: "success" });
      }
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  const { open, onToggle } = useDisclosure()

  return (
    <Presence
      present={open}
      animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
      animationDuration="moderate">
      <AbsoluteCenter>
        <Box position="relative" color={"white"} bg="white" p={4} borderRadius={5} boxShadow="lg" minWidth="300px" width="auto" maxWidth="400px" height="auto" maxHeight="400px" >
          <VStack alignItems={"center"} justifyContent={"center"} >
            <CloseButton variant="ghost" colorPalette="yellow" position="absolute" top={2} right={2} fillOpacity={"0"} onClick={() => { onToggle(); }}/>
            <Heading as="h1" color="black" textAlign={"center"}>Login</Heading>
            <Text as="p" color="black" width={"300px"} textAlign={"center"}>Please enter your email and password to login.</Text>
            <VStack gap={4}>
              {/* <IconButton color="black" variant="ghost" position="absolute" top={2} right={2} onClick={() => { setLoginVisibility("closed") }} >
                <LuX />
              </IconButton> */}
              <Field.Root width="300px" color={"black"} invalid={emailError} required>
                <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                <Input placeholder="john@example.com" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"} value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Field.ErrorText>This field is required</Field.ErrorText>
              </Field.Root>
              <Field.Root color={"black"} invalid={passwordError} required>
                <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                <PasswordInput placeholder="Password" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Field.ErrorText>This field is required</Field.ErrorText>
              </Field.Root>
              <ButtonGroup size="md" colorPalette="yellow">
                <Button variant="outline" width="145" onClick={() => { setLoading(false); onToggle(); }} >Cancel</Button>
                <Button variant="solid" width="145" loading={loading} onClick={() => { handleLogin(); }} >Login</Button>
              </ButtonGroup>
            </VStack>
          </VStack>
        </Box>
      </AbsoluteCenter>
    </Presence>
  );
}
