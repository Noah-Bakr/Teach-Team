// import { Avatar, Box, Button, Card, Collapsible, Field, Heading, HStack, IconButton, Input, NativeSelect, 
//     Separator, Stack, Text, Textarea } from "@chakra-ui/react";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
// import { Applicant, Availability, PreviousRoles, Role, Roles, User } from "@/types/types";
// import { PasswordInput } from "@/components/ui/password-input";
// import { LuPencil, LuPencilOff, LuPlus } from "react-icons/lu";
// import { fetchUserById, updateUser } from "@/services/userApi";
// import { getCurrentUser } from "@/services/api";

import { Avatar, Box, Button, Card, Field, Input, NativeSelect, Separator, Stack, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserUI } from "@/types/userTypes";
import { authApi } from "@/services/api";
import { fetchUserById, updateUser } from "@/services/userService";
import { Roles } from "@/types/roleTypes";


const ProfilePage: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<UserUI | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<UserUI>({
        id: 0,
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        avatar: null,
        role: "candidate",
        skills: [],
        courses: [],
        previousRoles: [],
        academicCredentials: [],
    });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // // State to manage the new experience input fields
    // const [previousRoles, setPreviousRoles] = useState<PreviousRoles[]>(updatedUser.previousRoles || []);
    // const [newPreviousRole, setNewPreviousRole] = useState({
    //     previous_role_id: 0,
    //     previous_role: "",
    //     company: "",
    //     start_date: "",
    //     end_date: "",
    //     description: "",
    // });

    // Fetch current user ID from /auth/me and then fetch user data from /user/:id
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authResponse = await authApi.getCurrentUser();
                const userId = authResponse.user.user_id;

                const userData = await fetchUserById(Number(userId));

                const mappedUser: UserUI = {
                    id: userData.id,
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    avatar: userData.avatar || null,
                    role: userData.role || "candidate",
                    skills: userData.skills || [],
                    courses: userData.courses || [],
                    previousRoles: userData.previousRoles || [],
                    academicCredentials: userData.academicCredentials || [],
                };

                setCurrentUser(mappedUser);
                setUpdatedUser(mappedUser);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    
    // Effect to toggle the disabled state of the input fields based on isEditing
    useEffect(() => {
        setIsDisabled(!isEditing);
    }, [isEditing]);

    // Function to handle input changes to user profile data
    // Updates the state of the updatedUser
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
        setHasUnsavedChanges(true);
    };

    // Function to handle changes to the new experience input fields
    // IS seperate from handleChange to avoid confusion with role state
    // const handlePreviousRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setNewPreviousRole((prevExperience) => ({
    //         ...prevExperience,
    //         [name]: value,
    //     }));
    //     setHasUnsavedChanges(true);
    // };

    // Function to handle changes to the select input for role
    const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
        setHasUnsavedChanges(true);
    };

    // Function to handle adding a new experience
    // const handleAddExperience = () => {
    //     const lastId = previousRoles.length ? Math.max(...previousRoles.map((exp) => exp.previous_role_id)) : 0;
    //     const newExp = { ...newPreviousRole, previous_role_id: lastId + 1 };

    //     setPreviousRoles([...previousRoles, newExp]);
    //     setNewPreviousRole({
    //         previous_role_id: 0,
    //         previous_role: "",
    //         company: "",
    //         start_date: "",
    //         end_date: "",
    //         description: "",
    //     });
    // };

    // Function to handle saving the updated user data
    // const handleSave = async () => {
    //     try {
    //         const savedUser = { ...updatedUser, previousRoles: previousRoles };
    //         await updateUser(savedUser.user_id, savedUser);
    //         setIsEditing(false);
    //         setHasUnsavedChanges(false);
    //     } catch (error) {
    //         console.error("Error saving user data:", error);
    //     }
    // };

    const handleSave = async () => {
        try {
            await updateUser(updatedUser.id, updatedUser);
            setIsEditing(false);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };

    // const handleEditPreviousRole = (id: number) => {
    //     const previousRoleToEdit = previousRoles.find((prevRole) => prevRole.previous_role_id === id);
    //     if (previousRoleToEdit) {
    //         setNewPreviousRole(previousRoleToEdit);
    //         setPreviousRoles(previousRoles.filter((prevRole) => prevRole.previous_role_id !== id));
    //     }
    // };

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
                                            <Input name="firstName" placeholder="First Name" value={updatedUser.firstName} onChange={handleChange} />
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Last Name</Field.Label>
                                            <Input name="lastName" placeholder="Last Name" value={updatedUser.lastName} onChange={handleChange} />
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Avatar</Field.Label>
                                            <Input name="avatar" placeholder="Avatar URL" value={updatedUser.avatar || ""} onChange={handleChange} />
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

                                        {/* <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Password</Field.Label>
                                            <PasswordInput disabled={isDisabled} name="password" placeholder="Password" value={updatedUser.password} onChange={handleChange}/>
                                        </Field.Root> */}

                                        <Field.Root orientation="horizontal" disabled>
                                            <Field.Label>Role</Field.Label>
                                            <NativeSelect.Root onChange={handleEventChange} disabled>
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

                                {updatedUser.role === "candidate" && (
                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Academic Information</Card.Title>
                                        <Card.Description>View or change your academic information here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Academic Credentials</Field.Label>
                                            <Textarea name="academicCredentials" placeholder="Academic Credentials" value={updatedUser.academicCredentials?.join(", ") || ""} onChange={handleChange} />
                                        </Field.Root>

                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Skills</Field.Label>
                                            <Textarea name="skills" placeholder="Skills" value={updatedUser.skills?.join(", ") || ""} onChange={handleChange} />
                                        </Field.Root>

                                        {/* <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Field.Label>Availability</Field.Label>
                                            <NativeSelect.Root onChange={handleEventChange}>
                                                <NativeSelect.Field name="availability" value={updatedUser.availability}>
                                                    {Availability.map((availability) => (
                                                        <option key={availability} value={availability}>{availability}</option>
                                                    ))}
                                                </NativeSelect.Field>
                                                <NativeSelect.Indicator />
                                            </NativeSelect.Root>
                                        </Field.Root> */}
                                    </Stack>
                                </Stack>)}
                                
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={() => {isEditing ? handleSave() : setIsEditing(true); }}>{isEditing ? "Save" : "Edit"}</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>

                    {/* {updatedUser.role.includes("tutor") && (
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
                                                <Input name="role" placeholder="Role" value={newPreviousRole.role} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal" disabled={isDisabled}>
                                                <Field.Label>Company</Field.Label>
                                                <Input name="company" placeholder="Company" value={newPreviousRole.company} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal" disabled={isDisabled}>
                                                <Field.Label>Start Date</Field.Label>
                                                <Input type="date" name="startDate" value={newPreviousRole.startDate} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal" disabled={isDisabled}>
                                                <Field.Label>End Date</Field.Label>
                                                <Input type="date" name="endDate" value={newPreviousRole.endDate} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal" disabled={isDisabled}>
                                                <Field.Label>Description</Field.Label>
                                                <Textarea name="description" placeholder="Description" value={newPreviousRole.description} onChange={handlePreviousRoleChange}/>
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
                    )}

                    {updatedUser.role.includes("tutor") && (
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

                                                    {app.previousRoles && app.previousRoles.length > 0 && (
                                                    <>
                                                    <Text mt={2} fontWeight="bold">Submitted Work Experience:</Text>
                                                    {app.previousRoles.map((role) => (
                                                        <Box key={role.id} mt={2} p={2} borderWidth="1px" borderRadius="md">
                                                            <Collapsible.Root>
                                                                <Collapsible.Trigger justifyContent="space-between" width={"100%"}>
                                                                    <HStack width={"100%"} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                                                        <Text><strong>{role.company}</strong></Text>
                                                                        <LuPlus />
                                                                    </HStack>
                                                                </Collapsible.Trigger>
                                                                <Collapsible.Content>
                                                                    <Separator size="sm" marginBottom={2} marginTop={2}/>
                                                                    <Text><strong>Role:</strong> {role.role}</Text>
                                                                    <Text><strong>Company:</strong> {role.company}</Text>
                                                                    <Text><strong>Period:</strong> {new Date(role.startDate).toLocaleDateString()} - {role.endDate ? new Date(role.endDate).toLocaleDateString() : "Present"}</Text>
                                                                    <Text><strong>Description:</strong> {role.description}</Text>
                                                                </Collapsible.Content>
                                                            </Collapsible.Root>
                                                        </Box>
                                                    ))}
                                                    </>
                                                )}
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
                    </Card.Root>)} */}

                </Stack>
            </Stack>
            
        </div>
    );
};

export default ProfilePage;