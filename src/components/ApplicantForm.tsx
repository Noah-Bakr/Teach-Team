import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure, Link,
  NativeSelect,
  HStack,
  Checkbox} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "../context/AuthContext";
import { log } from "console";
import "../styles/PopUpForm.css";
import { Course, Availability, User } from "@/types/types";
import { Tooltip } from "./ui/tooltip";

interface ApplicantFormProps {
  closeForm: () => void;
  course: Course;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ closeForm, course }) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsChecked, setTermsChecked] = useState(false)

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

  // Save the application to local storage
  const saveApplicationToLocalStorage = () => {
    const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]");

    // Create a new application with previous form data and other data to parse
    const newApplication = {
      ...formData,
      courseId: course.id,
      date: new Date().toISOString(), // Add a timestamp for the application
    };

    // Append the new application to the existing applications
    const updatedApplications = [...existingApplications, newApplication];
    
    // Save updated applications list back to localStorage
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const handleSubmit = () => {
    setLoading(true);
    saveApplicationToLocalStorage();
    toaster.create({title: "Application Submitted", description: `You have successfully applied for ${course.name}.`, type: "success", duration: 5000,});
    closeForm();
    setLoading(false);
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
                      <Heading className="Header" as="h1">Apply for {course.name}</Heading>
                      <Text className="Text" as="p">Please enter your details to apply.</Text>
                      <VStack className="InputStack" colorPalette={"yellow"}>
                      {/* <Tooltip content="These details must be changed in the profile page"> */}
                        <Field.Root className="InputFieldRoot" disabled>
                          <Field.Label>First Name<Field.RequiredIndicator /></Field.Label>
                          <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}/>
                          <Field.ErrorText>This field is required</Field.ErrorText>
                        </Field.Root>

                        <Field.Root className="InputFieldRoot" disabled>
                          <Field.Label>Last Name<Field.RequiredIndicator /></Field.Label>
                          <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange}/>

                          <Field.ErrorText>This field is required</Field.ErrorText>
                        </Field.Root>

                        <Field.Root className="InputFieldRoot" disabled>
                          <Field.Label>Email<Field.RequiredIndicator /></Field.Label>
                          <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange}/>
                          <Field.ErrorText>This field is required</Field.ErrorText>
                        </Field.Root>
                      {/* </Tooltip> */}
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

                        <Field.Root className="InputFieldRoot" colorPalette={"yellow"}>
                        <Field.Label></Field.Label>
                          <Checkbox.Root className="InputFieldRoot" variant="solid" checked={termsChecked} onCheckedChange={(e) => setTermsChecked(!!e.checked)}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
                          </Checkbox.Root>
                        </Field.Root>

                        <ButtonGroup className="ButtonGroup">
                            <Button className="Button" colorPalette="yellow" variant="surface" onClick={() => { setLoading(false); onToggle(); closeForm(); }} >Cancel</Button>
                            <Button disabled={!termsChecked} className="Button" colorPalette="yellow" variant="solid" loading={loading} 
                              onClick={() => { setLoading(false); handleSubmit(); }} >Submit Application</Button>
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
