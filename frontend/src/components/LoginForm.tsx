import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, Link} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { LuExternalLink } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import "../styles/PopUpForm.css";

interface LoginFormProps {
  closeForm: () => void;
  openSignUpForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeForm, openSignUpForm }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const router = useRouter();
    const { login, loading, error } = useAuth();
    const { open, onToggle } = useDisclosure();

    //Wake on show
    useEffect(() => {
        onToggle();
    }, []);

    const handleLogin = async () => {
        // Check if email and password are empty. "return" prevents the rest of the function from executing
        if (email === '') {
            setEmailError(true);
            return;
        } else { setEmailError(false); }
        if (password === '') {
            setPasswordError(true);
            return;
        } else { setPasswordError(false); }

        const success = await login(email, password);

        if (success) {
        router.push("/dashboard");
        onToggle();
        closeForm();
        }
    };

    return (
        <>  {/* Overlay to block interaction with the rest of the page. Parent required */}
            {open && <div className="Overlay"></div>}
            <Presence className="Box"
            present={open}
            animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
            animationDuration="moderate">
                <AbsoluteCenter colorPalette={"yellow"}>
                    <Box className="Box">
                        <VStack className="FormStack" colorPalette={"yellow"}>
                            <CloseButton className="CloseButton" variant="ghost" colorPalette="black" onClick={() => { onToggle(); closeForm(); }}/>
                            <Heading className="Header" as="h1">Sign In</Heading>
                            <Text className="Text" as="p">Please enter your email and password to login.</Text>
                            <VStack className="InputStack">
                            <Field.Root className="InputFieldRoot" invalid={emailError} required>
                                <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                                <Input className="LoginInput" placeholder="name@example.com" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                <Field.ErrorText>This field is required</Field.ErrorText>
                            </Field.Root>
                            <Field.Root className="InputFieldRoot" invalid={passwordError} required>
                                <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                                <PasswordInput className="Input" placeholder="Password" variant={"outline"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <Field.ErrorText>This field is required</Field.ErrorText>
                            </Field.Root>
                            <ButtonGroup className="ButtonGroup">
                                <Button className="Button" colorPalette="yellow" variant="surface" onClick={() => { onToggle(); closeForm(); }} >Cancel</Button>
                                <Button className="Button" colorPalette="yellow" variant="solid" loading={loading} onClick={() => { handleLogin(); }} >Login</Button>
                            </ButtonGroup>
                            <Text as="p" className="TextSmall">Don&apos;t have an account?&nbsp;
                                <Link color="black" onClick={openSignUpForm}>
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
