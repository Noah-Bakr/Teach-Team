import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, Alert, Link } from "@chakra-ui/react";
import { useState, useEffect, use } from "react";
import { useRouter } from 'next/router';
import { DEFAULT_USERS, User } from '@/testData/user';
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { LuX, LuExternalLink } from "react-icons/lu";
import { on } from "events";
import { useAuth } from "../context/AuthContext";
import { log } from "console";
import "../styles/LoginForm.css";

interface LoginFormProps {
  closeForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeForm }) => {
    const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const router = useRouter();
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

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasCorrectLength = password.length >= 8 && password.length <= 100;
//   const hasNoCommonWords = !/(password|123456|qwerty|abc123|letmein|welcome|iloveyou)/i.test(password); //Will change to check to database
//   const hasNoEmail = !email || !password.includes(email.split("@")[0]);
//   const hasNoUsername = !password.includes(currentUser?.username || "");
//   const hasNoFirstName = !password.includes(currentUser?.firstName || "");
//   const hasNoLastName = !password.includes(currentUser?.lastName || "");

  const validations = [
    hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasCorrectLength 
    //, hasNoCommonWords, hasNoEmail, hasNoUsername, hasNoFirstName, hasNoLastName
  ];

  const totalValidations = validations.length;


  const incrementStrength = () => {
    // let passwordStrength = 0;

    // validations.forEach((validation) => {
    //     if (validation) passwordStrength++;
    // });

    const passedValidations = validations.filter(validation => validation).length;

    const strengthPercentage = (passedValidations / totalValidations) * 4;
    setPasswordStrength(Math.round(strengthPercentage));
    console.log("Password strength: ", strengthPercentage);
    };

  //Password validation
  useEffect(() => {
    incrementStrength();
  }, [password]);

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

    // const success = login(email, password); //uncomment in A2

    //for A1, check email exists and password is strong
    const success = users.some((user) => user.email === email && passwordStrength === 4);
    if (success) {
      if (currentUser) {
        toaster.create({ title: "Login Successful", description: `Welcome back, ${currentUser.firstName}!`, type: "success" });
      }
      router.push("/dashboard");
      onToggle();
      closeForm();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>  {/* Overlay to block interaction with the rest of the page. Parent required */}
        {open && <div className="LoginOverlay"></div>}
        <Presence className="LoginContainer"
        present={open}
        animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
        animationDuration="moderate">
            <AbsoluteCenter>
                <Box className="LoginContainer">
                    <VStack className="LoginFormStack">
                        <CloseButton className="CloseButton" variant="ghost" colorPalette="black" onClick={() => { onToggle(); closeForm(); }}/>
                        <Heading className="LoginHeader" as="h1">Login</Heading>
                        <Text className="LoginText" as="p">Please enter your email and password to login.</Text>
                        <VStack className="LoginInputStack">
                        <Field.Root className="LoginInputFieldRoot" invalid={emailError} required>
                            <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                            <Input className="LoginInput" placeholder="name@example.com" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <Field.ErrorText>This field is required</Field.ErrorText>
                        </Field.Root>
                        <Field.Root className="LoginInputFieldRoot" invalid={passwordError} required>
                            <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                            <PasswordInput className="LoginInput" placeholder="Password" variant={"outline"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <Field.ErrorText>This field is required</Field.ErrorText>
                        </Field.Root>
                        <PasswordStrengthMeter className="LoginInputFieldRoot" value={passwordStrength} />
                        <ButtonGroup className="LoginButtonGroup">
                            <Button className="LoginButton" colorPalette="yellow" variant="surface" onClick={() => { setLoading(false); onToggle(); closeForm(); }} >Cancel</Button>
                            <Button className="LoginButton" colorPalette="yellow" variant="solid" loading={loading} onClick={() => { handleLogin(); }} >Login</Button>
                        </ButtonGroup>
                        <Text as="p" className="LoginTextSmall">Don't have an account?&nbsp;
                            <Link color="black" onClick={() => { router.push("/signup"); }}>
                            Sign Up <LuExternalLink />
                            </Link>
                        </Text>
                        </VStack>
                    </VStack>
                </Box>
            </AbsoluteCenter>
        </Presence>
    </>
  );
};

export default LoginForm;
