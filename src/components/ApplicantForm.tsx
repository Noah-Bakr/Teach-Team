import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, Link,
  NativeSelect} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "../context/AuthContext";
import { log } from "console";
import "../styles/PopUpForm.css";
import { Course, Availability, User } from "@/types/types";

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

  const [formData, setFormData] = useState<Omit<User, 'password' | 'username' | 'avatar' | 'role'>>({
    id: currentUser?.id || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    academicCredentials: currentUser?.academicCredentials || "",
    skills: currentUser?.skills || [],
    availability: currentUser?.availability || ["Not Available"],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  };

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

                      <Field.Root className="InputFieldRoot" required>
                        <Field.Label>First Name<Field.RequiredIndicator /></Field.Label>
                        <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}/>
                        <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>

                      <Field.Root className="InputFieldRoot">
                        <Field.Label>Last Name<Field.RequiredIndicator /></Field.Label>
                        <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange}/>
                        <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>

                      <Field.Root className="InputFieldRoot">
                        <Field.Label>Email<Field.RequiredIndicator /></Field.Label>
                        <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange}/>
                        <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>

                      <Field.Root className="InputFieldRoot">
                        <Field.Label>Academic Credentials<Field.RequiredIndicator /></Field.Label>
                        <Input name="academicCredentials" placeholder="Academic Credential" value={formData.academicCredentials} onChange={handleChange}/>
                        <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>

                      <Field.Root className="InputFieldRoot">
                        <Field.Label>Availability</Field.Label>
                        <NativeSelect.Root onChange={handleEventChange}>
                            <NativeSelect.Field name="availability" value={formData.availability}>
                                {Availability.map((availability) => (
                                    <option key={availability} value={availability}>{availability}</option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>

                      <Field.Root className="InputFieldRoot">
                        <Field.Label>Skills</Field.Label>
                        <Input name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange}/>
                      </Field.Root>


                      <ButtonGroup className="ButtonGroup">
                          <Button className="Button" colorPalette="yellow" variant="surface" onClick={() => { setLoading(false); onToggle(); closeForm(); }} >Cancel</Button>
                          <Button className="Button" colorPalette="yellow" variant="solid" loading={loading} 
                            onClick={() => { setLoading(false);toaster.create({title: "Application Submitted", description: `You have successfully applied for ${course.name}.`, 
                              type: "success", duration: 5000,}); closeForm(); }} >Submit Application</Button>
                      </ButtonGroup>
                      </VStack>
                  </VStack>
              </Box>
          </AbsoluteCenter>
      </Presence>
    </>
  );
};

export default ApplicantForm;
