import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, 
  Checkbox, CheckboxGroup, Link} from "@chakra-ui/react";
import { useState, useEffect, use } from "react";
import { useRouter } from 'next/router';
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { LuExternalLink } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { log } from "console";
import "../styles/PopUpForm.css";

interface LoginFormProps {
  closeForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ closeForm }) => {
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

    //Wake on show
    useEffect(() => {
        onToggle();
    }, []);

    useEffect(() => {
        if (error == "Invalid email or password") {
        toaster.create({title: error, type: "error", duration: 5000});
        setError("");
        }
    }, [error]);

    // Password strength calculation
    // This function calculates the password strength based on the number of validations passed
    const incrementStrength = () => {
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

        if (passwordStrength !== 4) {
            toaster.create({ title: "Password Strength", description: "Password is weak. Please use a stronger password.", type: "warning", duration: 5000 });
            return;
        }

        const success = login(email, password);
        if (success) {
            if (currentUser) {
                toaster.create({ title: "Sign In Successful", description: `Welcome back, ${currentUser?.firstName || "User"}!`, type: "success", duration: 5000 });
            }
            // router.push("/dashboard");
            onToggle();
            closeForm();
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <>  {/* Overlay to block interaction with the rest of the page. Parent required */}
            {open && <div className="Overlay"></div>}
            <Presence className="Box"
            present={open}
            animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
            animationDuration="moderate">
                <AbsoluteCenter>
                    <Box className="Box">
                        <VStack className="FormStack">
                            <CloseButton className="CloseButton" variant="ghost" colorPalette="black" onClick={() => { onToggle(); closeForm(); }}/>
                            <Heading className="Header" as="h1">Login</Heading>
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
                            <PasswordStrengthMeter className="PasswordStrengthMeter" value={passwordStrength} />
                            {/* <CheckboxGroup className="LoginInputFieldRoot">
                            {[
                                { label: "Contains an uppercase letter", passed: hasUpperCase },
                                { label: "Contains a lowercase letter", passed: hasLowerCase },
                                { label: "Contains a number", passed: hasNumber },
                                { label: "Contains a special character", passed: hasSpecialChar },
                                { label: "Has a length between 8 and 100 characters", passed: hasCorrectLength }
                            ].map((validation, index) => (
                                <Checkbox.Root key={index} value={validation.label} isChecked={validation.passed}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>{validation.label}</Checkbox.Label>
                                </Checkbox.Root>
                            ))}
                            </CheckboxGroup> */}
                            <ButtonGroup className="ButtonGroup">
                                <Button className="Button" colorPalette="yellow" variant="surface" onClick={() => { setLoading(false); onToggle(); closeForm(); }} >Cancel</Button>
                                <Button className="Button" colorPalette="yellow" variant="solid" loading={loading} onClick={() => { handleLogin(); }} >Login</Button>
                            </ButtonGroup>
                            <Text as="p" className="TextSmall">Don't have an account?&nbsp;
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
