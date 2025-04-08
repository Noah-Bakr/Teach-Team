import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, Link} from "@chakra-ui/react";
import { useState, useEffect, use } from "react";
import { useRouter } from 'next/router';
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { LuExternalLink } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { log } from "console";
import "../styles/PopUpForm.css";
import { Course } from "@/testData/course";
import { User } from "@/testData/user";
import { Availability, Role, Roles } from "@/testData/user";

interface ApplicantFormProps {
  closeForm: () => void;
  course: Course;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ closeForm, course }) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { open, onToggle } = useDisclosure();

  const [updatedUser, setUpdatedUser] = useState<User>({
      id: "",
      username: "",
      firstName: "",
      lastName: "",
      avatar: "",
      email: "",
      password: "",
      role: ["tutor"] as Role[],
      academicCredentials: "",
      skills: [],
      availability: ["Not Available"] as Availability[],
  });

  //Wake on show
  useEffect(() => {
      onToggle();
  }, []);

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
                      <Heading className="Header" as="h1">Apply for {course.name}</Heading>
                      <Text className="Text" as="p">Please enter your details to apply.</Text>
                      <VStack className="InputStack">
                        <Field.Root className="InputFieldRoot">
                          <Field.Label>Email</Field.Label>
                          <Input name="email" placeholder="Email" value={currentUser?.email || ''} />
                      </Field.Root>


                      <Field.Root className="InputFieldRoot" required>
                          <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                          <Input className="LoginInput" placeholder="name@example.com" variant="outline" />
                          <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>
                      <Field.Root className="InputFieldRoot" required>
                          <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                          <PasswordInput className="Input" placeholder="Password" variant={"outline"} />
                          <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>

                      <ButtonGroup className="ButtonGroup">
                          <Button className="Button" colorPalette="yellow" variant="surface" onClick={() => { setLoading(false); onToggle(); closeForm(); }} >Cancel</Button>
                          <Button className="Button" colorPalette="yellow" variant="solid" loading={loading} onClick={() => { setLoading(false); }} >Login</Button>
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

export default ApplicantForm;
