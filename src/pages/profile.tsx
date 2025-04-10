import { Avatar, Box, Button, Card, Field, Heading, HStack, IconButton, Input, NativeSelect, 
    Separator, Stack, Text, Textarea } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Applicant, Availability, PreviousRoles, Role, Roles, User } from "@/types/types";
import { PasswordInput } from "@/components/ui/password-input";
import { LuPencil, LuPencilOff } from "react-icons/lu";
import Header from "@/components/Header";

// TODO: Add area for previous experience, readme, testing, application viewer
const ProfilePage: React.FC = () => {
    const { currentUser, updateUserInLocalStorage } = useAuth();
    const [isDisabled, setIsDisabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
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
        previousRoles: [] as PreviousRoles[],
    });
    // State to manage the new experience input fields
    const [newPreviousRole, setNewPreviousRole] = useState({
        id: "",
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [previousRoles, setPreviousRoles] = useState<PreviousRoles[]>(updatedUser.previousRoles);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const userApplicants = applicants.filter(applicant => applicant.userId === currentUser?.id); // Filter user's applications

    useEffect(() => {
        const storedApplications = JSON.parse(localStorage.getItem("applicants") || "[]");
        setApplicants(storedApplications);
    }, []);


    // Effect to set the updatedUser state when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setUpdatedUser({
                id: currentUser.id,
                username: currentUser.username,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                avatar: currentUser.avatar,
                email: currentUser.email,
                password: currentUser.password,
                role: currentUser.role,
                academicCredentials: currentUser.academicCredentials,
                skills: currentUser.skills,
                availability: currentUser.availability,
                previousRoles: currentUser.previousRoles,
            });
            setPreviousRoles(currentUser.previousRoles);
        }
    }, [currentUser]);
    
    // Effect to toggle the disabled state of the input fields based on isEditing
    useEffect(() => {
        if (isEditing) {
            setIsDisabled(false);
        } else if (!isEditing) {
            setIsDisabled(true);
        }
    }, [isEditing]);

    // Function to handle input changes to user profile data
    // Updates the state of the updatedUser
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    
        // Updates the state of the previousRoles
        setNewPreviousRole((prevExperience) => ({
            ...prevExperience,
            [name]: value,
        }));
    };

    // Function to handle changes to the select input for role
    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
        
    };

    // Function to handle adding a new experience
    const handleAddExperience = () => {
        // Find the last ID in the previousRoles array and increment it for the new experience
        const lastId = previousRoles.length ? Math.max(...previousRoles.map((exp) => parseInt(exp.id))): 0; // Default to 0 if no previous roles exist
        const newExp = {...newPreviousRole, id: (lastId + 1).toString(), };

        // Add the new experience to the previousRoles array
        setPreviousRoles([...previousRoles, newExp]);
        // Reset the newPreviousRole state to clear the input fields
        setNewPreviousRole({ id: "", role: "", company: "", startDate: "", endDate: "", description: "" });
    };

    // Function to handle saving the updated user data
    const handleSave = () => {
        const savedUser = { ...currentUser, ...updatedUser, previousRoles: previousRoles }; // Merge currentUser and updatedUser
        updateUserInLocalStorage(savedUser);
        setIsEditing(false);
    };

    const handleEditPreviousRole = (id: string) => {
        const previousRoleToEdit = previousRoles.find((prevRole) => prevRole.id === id);
        if (previousRoleToEdit) {
            setNewPreviousRole({
                ...previousRoleToEdit,
                endDate: previousRoleToEdit.endDate || "",
            });
            setPreviousRoles(previousRoles.filter((prevRole) => prevRole.id !== id)); // Remove it while editing
        }
    };

    return (
        <div>
            <Stack gap={8}>


                <Stack gap={4} direction={"row"} width={"90rem"} wrap="wrap">
                    <Card.Root colorPalette="yellow" flexDirection="row" width="25rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                        <Box width={"100%"}>
                            <Card.Body>
                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Profile Information</Card.Title>
                                        <Card.Description>View or change your profile information here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>First Name</Field.Label>
                                            <Input name="firstName" placeholder="First Name" value={updatedUser.firstName} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Last Name</Field.Label>
                                            <Input name="lastName" placeholder="Last Name" value={updatedUser.lastName} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Avatar</Field.Label>
                                            <Input name="avatar" placeholder="Avatar Url" value={updatedUser.avatar} onChange={handleChange}/>
                                        </Field.Root>
                                    </Stack>
                                </Stack>

                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Account Information</Card.Title>
                                        <Card.Description>View or change your account information here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Username</Field.Label>
                                            <Input name="username" placeholder="Username" value={updatedUser.username} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Email</Field.Label>
                                            <Input name="email" placeholder="Email" value={updatedUser.email} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Password</Field.Label>
                                            <PasswordInput name="password" placeholder="Password" value={updatedUser.password} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Role</Field.Label>
                                            <NativeSelect.Root onChange={handleEventChange}>
                                                <NativeSelect.Field name="role" value={updatedUser.role}>
                                                    {Roles.map((role) => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                            <Field.ErrorText>This is an error</Field.ErrorText>
                                        </Field.Root>
                                    </Stack>
                                </Stack>

                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Academic Information</Card.Title>
                                        <Card.Description>View or change your academic information here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Academic Credential</Field.Label>
                                            <Input name="academicCredentials" placeholder="Academic Credential" value={updatedUser.academicCredentials} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Skills</Field.Label>
                                            <Textarea name="skills" placeholder="Skills" value={updatedUser.skills} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Availability</Field.Label>
                                            <NativeSelect.Root onChange={handleEventChange}>
                                                <NativeSelect.Field name="availability" value={updatedUser.availability}>
                                                    {Availability.map((availability) => (
                                                        <option key={availability} value={availability}>{availability}</option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </Field.Root>
                                    </Stack>
                                </Stack>
                                
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={() => {isEditing ? handleSave() : setIsEditing(true); }}>{isEditing ? "Save" : "Edit"}</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>

                    <Card.Root colorPalette="yellow" flexDirection="row" width="35rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                        <Box width={"100%"}>
                            <Card.Body>
                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Previous Work Experience</Card.Title>
                                        <Card.Description>View, add, or edit your work experience here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Role</Field.Label>
                                            <Input name="role" placeholder="Role" value={newPreviousRole.role} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Company</Field.Label>
                                            <Input name="company" placeholder="Company" value={newPreviousRole.company} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Start Date</Field.Label>
                                            <Input type="date" name="startDate" value={newPreviousRole.startDate} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>End Date</Field.Label>
                                            <Input type="date" name="endDate" value={newPreviousRole.endDate} onChange={handleChange}/>
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Description</Field.Label>
                                            <Textarea name="description" placeholder="Description" value={newPreviousRole.description} onChange={handleChange}/>
                                        </Field.Root>

                                        <Button onClick={handleAddExperience} colorScheme="yellow" disabled={isDisabled}>
                                            {newPreviousRole.id ? "Save Experience" : "Add Experience"}
                                        </Button>
                                    </Stack>

                                    <Separator size="md" />
                                    <Stack gap={2}>
                                        {previousRoles?.map((prevRole) => (
                                            <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm">
                                                <IconButton position="absolute" right="0px" top="0px" disabled={isDisabled} aria-label="Edit" variant="ghost" colorScheme="yellow" size="sm" onClick={() => handleEditPreviousRole(prevRole.id)} >
                                                    <LuPencil />
                                                </IconButton>
                                                <Box direction="row" key={prevRole.id} p={4}>
                                                    <Text>{prevRole.role} at {prevRole.company}</Text>
                                                    <Text>{new Date(prevRole.startDate).toLocaleDateString()} - {prevRole.endDate ? new Date(prevRole.endDate).toLocaleDateString() : "Present"}</Text>
                                                    <Text>{prevRole.description}</Text>
                                                    {/* <Button disabled={isDisabled} onClick={() => handleEditPreviousRole(prevRole.id)} colorScheme="yellow">Edit</Button> */}
                                                </Box>
                                            </Card.Root>
                                        ))}
                                    </Stack>
                                    
                                </Stack>
                            </Card.Body>
                            <Card.Footer>
                            </Card.Footer>
                        </Box>
                    </Card.Root>

                    <Card.Root colorPalette="yellow" flexDirection="row" width="25rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                        <Box width={"100%"}>
                            <Card.Body>
                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Your Applications</Card.Title>
                                        <Card.Description>View your applications here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2}>
                                        {userApplicants.length === 0 ? (<Text>No applications submitted yet.</Text>) : 
                                        (userApplicants.map((app) => (
                                            <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm">
                                                <Box key={app.id} p="4" >
                                                    <Text fontWeight="bold">Course ID: {app.courseId}</Text>
                                                    <Text>Date Submitted: {new Date(app.date).toLocaleDateString()}</Text>
                                                    <Text>Availability: {app.availability.join(", ")}</Text>
                                                    <Text>Skills: {app.skills.join(", ")}</Text>
                                                    <Text>Academic Credentials: {app.academicCredentials || "None"}</Text>
                                                    <Text>Status: <strong>{app.selected ? "Selected" : "Pending"}</strong></Text>
                                                </Box>
                                            </Card.Root>
                                        ))
                                        )}
                                    </Stack>
                                </Stack>
                            </Card.Body>
                            <Card.Footer>
                            </Card.Footer>
                        </Box>
                    </Card.Root>


                </Stack>
            </Stack>
            
        </div>
    );
};

export default ProfilePage;