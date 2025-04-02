import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, Alert, Link } from "@chakra-ui/react";
import { useState, useEffect, use } from "react";
import { useRouter } from 'next/router';
import { DEFAULT_USERS, User } from '@/testData/user';
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { LuX, LuExternalLink } from "react-icons/lu";
import { on } from "events";
import { useAuth } from "../context/AuthContext";
import { log } from "console";

const LoginForm: React.FC = () => {
    const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
    
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, currentUser } = useAuth();

    const { open, onToggle } = useDisclosure();

  //---testing purposes---
  useEffect(() => {
    onToggle();
  }, []);

  useEffect(() => {
    if (error == "Invalid email or password") {
      toaster.create({title: error, type: "error", isClosable: true, placement: "top-end", overlap: true, duration: 5000, max: 3});
      setError("");
    }
  }, [error]);

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
      if (currentUser) {
        toaster.create({ title: "Login Successful", description: `Welcome back, ${currentUser.firstName}!`, type: "success" });
      }
      router.push("/dashboard");
      onToggle();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Presence
      present={open}
      animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
      animationDuration="moderate">
      <AbsoluteCenter>
        <Box position="relative" color={"white"} bg="white" p={4} borderRadius={5} boxShadow="lg" minWidth="300px" width="auto" maxWidth="400px" height="auto" maxHeight="400px" >
          <VStack alignItems={"center"} justifyContent={"center"} >
            <CloseButton variant="ghost" colorPalette="black" fill="black" position="absolute" top={2} right={2} onClick={() => { onToggle(); }}/>
            <Heading as="h1" color="black" textAlign={"center"}>Login</Heading>
            <Text as="p" color="black" width={"300px"} textAlign={"center"}>Please enter your email and password to login.</Text>
            <VStack gap={4} justifyContent={"center"} alignItems={"center"} width="100%">
              <Field.Root width="300px" color={"black"} invalid={emailError} required>
                <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                <Input placeholder="name@example.com" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"} value={email} onChange={(e) => setEmail(e.target.value)}/>
                <Field.ErrorText>This field is required</Field.ErrorText>
              </Field.Root>
              <Field.Root color={"black"} invalid={passwordError} required>
                <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                <PasswordInput placeholder="Password" variant={"outline"} size="md" color={"black"} focusRingColor={"yellow.500"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Field.ErrorText>This field is required</Field.ErrorText>
              </Field.Root>
              <ButtonGroup size="md" colorPalette="yellow">
                <Button variant="outline" width="100%" onClick={() => { setLoading(false); onToggle(); }} >Cancel</Button>
                <Button variant="solid" width="100%" loading={loading} onClick={() => { handleLogin(); }} >Login</Button>
              </ButtonGroup>
              <Text as="p" color="black" fontSize={"sm"} textAlign={"center"}>Don't have an account?&nbsp;
                <Link color="black" onClick={() => { router.push("/signup"); }}>
                  Sign Up <LuExternalLink />
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </AbsoluteCenter>
    </Presence>
  );
};

export default LoginForm;
