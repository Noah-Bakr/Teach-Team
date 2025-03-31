import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, Input, Field, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { DEFAULT_USERS, User } from '@/types/user';
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"

export default function Home() {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  // Load saved users from localStorage
  useEffect(() => {
          const saved = localStorage.getItem('users');
          if (saved) {
            setUsers(JSON.parse(saved));
          }
      }, []);

  // Save users state to localStorage when it changes.
  useEffect(() => {
          localStorage.setItem('users', JSON.stringify(users));
      }, [users]);
  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === '') {
      setEmailError(true);
      return;
    } else { setEmailError(false); }
    if (password === '') {
      setPasswordError(true);
      return;
    } else { setPasswordError(false); }

    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      setLoading(true);
      setError('');
      //Todo: save user to context
      localStorage.setItem('currentUser', JSON.stringify(user)); // Save current user to localStorage (for session management)
      //TODO: figure out how to make toaster stay to dashbaord
      toaster.create({ title: "Login Successful", description: `Welcome back, ${user.firstName}!`, status: "success" });
      router.push('/dashboard');
    } else {
      setLoading(false);
      setError('Invalid email or password');
    }
  };

  return (
    /*
    * every input has a form variable. on change update variable. onlick compare to localstorage
    * if they are the same, set loading to true and redirect to /dashboard
    * if they are not the same, set loading to false and show error message
    * will turn this into a component later
    * 
    * <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Invalid Fields</Alert.Title>
                <Alert.Description>
                  Your form has some errors. Please fix them and try again.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
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
            <Button variant="solid" loading={loading} onClick={() => { handleLogin() }} >Login</Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </AbsoluteCenter>
  );
}
