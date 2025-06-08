import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, Input, 
    Field, Heading, Text, CloseButton, Presence, useDisclosure, Checkbox,
    } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/router';
import { PasswordInput, PasswordStrengthMeter } from "./ui/password-input";
import { toaster } from "./ui/toaster"
import { useAuth } from "@/context/AuthContext";
import styles from "../styles/PopUpForm.module.css";

interface SignUpFormProps {
    closeForm: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ closeForm }) => {
    // State variables for email, password, and their validation
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordError, setPasswordError] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState(false);

    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState(false);

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [signUpError, setSignUpError] = useState("");

    const router = useRouter();
    const { signUp, loading, error } = useAuth();
    const { open, onToggle } = useDisclosure();

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCorrectLength = password.length >= 8 && password.length <= 100;

    const validations = useMemo(() => {
        return [
            hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasCorrectLength
        ];
    }, [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasCorrectLength]);

    useEffect(() => {
        if (!open) {
            onToggle();
        }
    }, [onToggle, open]);

    const totalValidations = validations.length;

    // Show error message if there is an error (frontend - SignUp)
    useEffect(() => {
        if (signUpError !== "") {
        toaster.create({title: signUpError, type: "error", duration: 5000});
        }
    }, [signUpError]);

    useEffect(() => {
        if (error && error.trim() !== "") {
            toaster.create({ title: error, type: "error", duration: 5000 });
        }
    }, [error]);    

    // Password strength calculation
    // This function calculates the password strength based on the number of validations passed
    const incrementStrength = useMemo(() => {
        return () => {
            const passedValidations = validations.filter(validation => validation).length;
            const strengthPercentage = (passedValidations / totalValidations) * 4;
            setPasswordStrength(Math.round(strengthPercentage));
        };
    }, [validations, totalValidations]);

    //Password validation
    useEffect(() => {
        incrementStrength();
    }, [password, incrementStrength]);

    const handleSignUp = async () => {
        // Check if email and password are empty. "return" prevents the rest of the function from executing
        if (firstName === '') {
            setFirstNameError(true);
            return;
        } else { setFirstNameError(false); }

        if (lastName === '') {
            setLastNameError(true);
            return;
        } else { setLastNameError(false); }

        if (username === '') {
            setUsernameError(true);
            return;
        } else { setUsernameError(false); }

        if (email === '') {
            setEmailError(true);
            return;
        } else { setEmailError(false); }

        if (password === '') {
            setPasswordError(true);
            return;
        } else { setPasswordError(false); }

        if (confirmPassword === '') {
            setConfirmPasswordError(true);
            return;
        } else { setConfirmPasswordError(false); }

        if (password !== confirmPassword) {
            setSignUpError("Passwords do not match");
            return;
        } else { setSignUpError(""); }

        if (passwordStrength !== 4) {
            toaster.create({ title: "Password Strength", description: "Password is weak. Please use a stronger password.", type: "warning", duration: 5000 });
            return;
        }

        const success = await signUp(firstName, lastName, username, email, password);
        
        if (success) {
            router.push("/dashboard");
            onToggle();
            closeForm();
        }
    };

    return (
        <>  {/* Overlay to block interaction with the rest of the page. Parent required */}
            {open && <div className={styles.Overlay}></div>}
            <Presence className={styles.Box}
            present={open}
            animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
            animationDuration="moderate">
                <AbsoluteCenter colorPalette={"yellow"}>
                    <Box className={styles.Box} scrollbar="hidden" scrollBehavior="smooth" maxH="700px" overflowY="auto">
                        <VStack className={styles.FormStack} colorPalette={"yellow"}>
                            <CloseButton className={styles.CloseButton} variant="ghost" colorPalette="black" onClick={() => { onToggle(); closeForm(); }}/>
                            <Heading className={styles.Header} as="h1">Sign Up</Heading>
                            <Text className={styles.Text} as="p">Please enter your details to create an account.</Text>
                            <VStack className={styles.InputStack}>
                                <Field.Root className={styles.InputFieldRoot} invalid={firstNameError} required>
                                    <Field.Label>First Name <Field.RequiredIndicator /></Field.Label>
                                    <Input className={styles.LoginInput} placeholder="John" variant="outline" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                </Field.Root>

                                <Field.Root className={styles.InputFieldRoot} invalid={lastNameError} required>
                                    <Field.Label>Last Name <Field.RequiredIndicator /></Field.Label>
                                    <Input className={styles.LoginInput} placeholder="Doe" variant="outline" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                </Field.Root>

                                <Field.Root className={styles.InputFieldRoot} invalid={usernameError} required>
                                    <Field.Label>Username <Field.RequiredIndicator /></Field.Label>
                                    <Input className={styles.LoginInput} placeholder="johndoe" variant="outline" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                </Field.Root>

                                <Field.Root className={styles.InputFieldRoot} invalid={emailError} required>
                                    <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                                    <Input className={styles.LoginInput} placeholder="name@example.com" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                </Field.Root>

                                <Field.Root className={styles.InputFieldRoot} invalid={passwordError} required>
                                    <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                                    <PasswordInput className={styles.Input} placeholder="Password" variant={"outline"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                </Field.Root>
                                <PasswordStrengthMeter className={styles.PasswordStrengthMeter} value={passwordStrength} />

                                <VStack className={styles.CheckboxStack}>
                                {[
                                    { label: "Contains an uppercase letter", passed: hasUpperCase },
                                    { label: "Contains a lowercase letter", passed: hasLowerCase },
                                    { label: "Contains a number", passed: hasNumber },
                                    { label: "Contains a special character", passed: hasSpecialChar },
                                    { label: "Has a length between 8 and 100 characters", passed: hasCorrectLength }
                                ].map((validation, index) => (
                                    <Checkbox.Root className={styles.CheckboxStack} key={index} value={validation.label} checked={validation.passed} readOnly>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                        <Checkbox.Label>{validation.label}</Checkbox.Label>
                                    </Checkbox.Root>
                                ))}
                                </VStack>

                                <Field.Root className={styles.InputFieldRoot} invalid={confirmPasswordError} required>
                                    <Field.Label>Confirm Password <Field.RequiredIndicator /></Field.Label>
                                    <PasswordInput className={styles.Input} placeholder="Password" variant={"outline"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                </Field.Root>
                                
                                <ButtonGroup className={styles.ButtonGroup}>
                                    <Button className={styles.Button} colorPalette="yellow" variant="surface" onClick={() => { onToggle(); closeForm(); }} >Cancel</Button>
                                    <Button className={styles.Button} colorPalette="yellow" variant="solid" loading={loading} onClick={() => { handleSignUp(); }} >Sign Up</Button>
                                </ButtonGroup>
                            </VStack>
                        </VStack>
                    </Box>
                </AbsoluteCenter>
            </Presence>
        </>
    );
};

export default SignUpForm;
