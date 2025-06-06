import { Box, Button, Card, Field, Input, NativeSelect, Separator, Stack, Textarea, Text, IconButton, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserUI } from "@/types/userTypes";
import { updateUser } from "@/services/userService";
import { Roles } from "@/types/roleTypes";
import { getCurrentUser } from "@/services/authService";
import { mapBackendUserToUI } from "@/services/mappers/authMapper"
import { deletePreviousRole, fetchAllPreviousRoles, updatePreviousRole } from "@/services/previousRoleService";
import { fetchAllApplications } from "@/services/applicationService";
import { PreviousRoleUI } from "@/types/previousRoleTypes";
import { ApplicationUI } from "@/types/applicationTypes";
import { LuPencil, LuPencilOff, LuTrash2 } from "react-icons/lu";
import { createPreviousRole } from "@/services/previousRoleService";
import { toaster } from "@/components/ui/toaster";

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
        createdAt: "",
    });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [previousRoles, setPreviousRoles] = useState<PreviousRoleUI[]>([]);
    const [userApplicants, setUserApplicants] = useState<ApplicationUI[]>([]);
    const [isExperienceLoading, setExperienceIsLoading] = useState(false);

    const [experienceRoleError, setExperienceRoleError] = useState(false);
    const [experienceCompanyError, setExperienceCompanyError] = useState(false);
    const [experienceStartDateError, setExperienceStartDateError] = useState(false);

    const [editingPreviousRoleId, setEditingPreviousRoleId] = useState<number | null>(null);
    const [editPreviousRole, setEditPreviousRole] = useState<PreviousRoleUI | null>(null);

    // // State to manage the new experience input fields
    // const [previousRoles, setPreviousRoles] = useState<PreviousRoles[]>(updatedUser.previousRoles || []);
    const [newPreviousRole, setNewPreviousRole] = useState<PreviousRoleUI>({
        id: 0,
        userId: 0,
        role: "",
        company: "",
        startDate: "",
        endDate: "" ,
        description: "",
    });

    // Fetch current user ID from /auth/me and then fetch user data from /user/:id
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                const user: UserUI = mapBackendUserToUI(response);
                setCurrentUser(user);
                setUpdatedUser(user);

                const allPreviousRoles = await fetchAllPreviousRoles();
                setPreviousRoles(allPreviousRoles.filter(role => role.userId === user.id));
                
                const allApps = await fetchAllApplications();
                setUserApplicants(allApps.filter(app => app.user?.id === user.id));

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
    const handlePreviousRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPreviousRole((prev) => ({
            ...prev,
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
        setHasUnsavedChanges(true);
    };

    // Function to handle adding a new experience
    const handleAddExperience = async () => {
        if (newPreviousRole.role === '' || !newPreviousRole.role) {
            setExperienceRoleError(true);
            return;
        } else { setExperienceRoleError(false); }
        if (newPreviousRole.company === '' || !newPreviousRole.company) {
            setExperienceCompanyError(true);
            return;
        } else { setExperienceCompanyError(false); }
        if (newPreviousRole.startDate === '' || !newPreviousRole.startDate) {
            setExperienceStartDateError(true);
            return;
        } else { setExperienceStartDateError(false); }

        try {
            setExperienceIsLoading(true);
            const roleToCreate = {
                previous_role: newPreviousRole.role,
                company: newPreviousRole.company,
                start_date: newPreviousRole.startDate,
                end_date: newPreviousRole.endDate || null,
                description: newPreviousRole.description,
                user_id: updatedUser.id,
            };
            const createdRole = await createPreviousRole(roleToCreate);
            setPreviousRoles((prev) => [...prev, createdRole]);
            setNewPreviousRole({
                id: 0,
                userId: 0,
                role: "",
                company: "",
                startDate: "",
                endDate: "",
                description: "",
            });
            setExperienceIsLoading(false);
            toaster.create({
                title: "Success",
                description: `${roleToCreate.previous_role} at ${roleToCreate.company} added successfully.`,
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            console.error("Error adding previous role:", error);
            toaster.create({
                title: "Error",
                description: "Failed to add previous experience.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const handleEditPreviousRole = (id: number) => {
        if (editingPreviousRoleId === id) {
            handleUpdateExperience();
        } else {
            const role = previousRoles.find((r) => r.id === id);
            if (role) {
                setEditPreviousRole(role);
                setEditingPreviousRoleId(id);
                setIsEditing(true);
                setIsDisabled(false);
            }
        }
    };

    const handleEditPreviousRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditPreviousRole((prev) => prev ? { ...prev, [name]: value } : prev);
    };

    const handleUpdateExperience = async () => {
        if (!editingPreviousRoleId || !editPreviousRole) return;
        try {
            setExperienceIsLoading(true);
            const payload = {
                previous_role: editPreviousRole.role,
                company: editPreviousRole.company,
                start_date: editPreviousRole.startDate,
                end_date: editPreviousRole.endDate || null,
                description: editPreviousRole.description,
            };
            const updatedRole = await updatePreviousRole(editingPreviousRoleId, payload);
            setPreviousRoles((prev) =>
                prev.map((role) => (role.id === editingPreviousRoleId ? updatedRole : role))
            );

            setEditPreviousRole(null);
            setEditingPreviousRoleId(null);
            setIsEditing(false);
            setIsDisabled(true);
            setExperienceIsLoading(false);

            toaster.create({
                title: "Experience Updated",
                description: "Your previous experience has been updated.",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            setExperienceIsLoading(false);
            toaster.create({
                title: "Error",
                description: "Failed to update previous experience.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const handleSave = async () => {
        try {
            // only sends the data that API expects
            const payload = {
                username: updatedUser.username,
                email: updatedUser.email,
                first_name: updatedUser.firstName,
                last_name: updatedUser.lastName,
                avatar: updatedUser.avatar,
                // role_id: updatedUser.role,
                // TODO: handle password change
            };

            await updateUser(updatedUser.id, payload);

            setIsEditing(false);
            setIsDisabled(true);
            setHasUnsavedChanges(false);
            toaster.create({
                title: "Profile Updated",
                description: "Your profile has been updated.",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            console.error("Error saving user data:", error);
            toaster.create({
                title: "Error",
                description: "Failed to update profile.",
                type: "error",
                duration: 5000,
            });
        }
    };

    // Helper to format date as dd-mm-yyyy
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDeletePreviousRole = async (id: number) => {
        try {
            await deletePreviousRole(id);
            setPreviousRoles((prev) => prev.filter((role) => role.id !== id));
            toaster.create({
                title: "Deleted",
                description: "Previous role deleted successfully.",
                type: "success",
                duration: 4000,
            });
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Failed to delete previous role.",
                type: "error",
                duration: 4000,
            });
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
                                    {/* {currentUser?.createdAt && ( */}
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Account created: {formatDate(currentUser?.createdAt)}
                                        </Text>
                                    {/* // )} */}
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
                                <Button onClick={() => {isEditing ? handleSave() : setIsEditing(true); setIsDisabled(false);}}>{isEditing ? "Save" : "Edit"}</Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>

                    {/* {previousRoles.length > 0 && (
                        <Card.Root colorPalette="yellow" flexDirection="row" width="35rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                            <Box width={"100%"}>
                                <Card.Body>
                                    <Stack gap={2}>
                                        <Stack gap={0}>
                                            <Card.Title mb="2">Previous Work Experience</Card.Title>
                                            <Card.Description>View, add, or edit your work experience here.</Card.Description>
                                        </Stack>
                                        <Separator size="md" />
                                        <Stack gap={2}>
                                            {previousRoles.map((prevRole) => (
                                                <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm" key={prevRole.id}>
                                                    <Box direction="row" p={4}>
                                                        <Text>{prevRole.role} at {prevRole.company}</Text>
                                                        <Text>{new Date(prevRole.startDate).toLocaleDateString()} - {prevRole.endDate ? new Date(prevRole.endDate).toLocaleDateString() : "Present"}</Text>
                                                        <Text>{prevRole.description}</Text>
                                                    </Box>
                                                </Card.Root>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </Card.Body>
                                <Card.Footer />
                            </Box>
                        </Card.Root>)} */}

                    {updatedUser.role.includes("candidate") && (
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
                                            <Field.Root orientation="horizontal" invalid={experienceRoleError} required>
                                                <Field.Label>Role <Field.RequiredIndicator /></Field.Label>
                                                <Input name="role" placeholder="Role" value={newPreviousRole.role} onChange={handlePreviousRoleChange}/>
                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal" invalid={experienceCompanyError} required>
                                                <Field.Label>Company <Field.RequiredIndicator /></Field.Label>
                                                <Input name="company" placeholder="Company" value={newPreviousRole.company} onChange={handlePreviousRoleChange}/>
                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal" invalid={experienceStartDateError} required>
                                                <Field.Label>Start Date <Field.RequiredIndicator /></Field.Label>
                                                <Input type="date" name="startDate" value={newPreviousRole.startDate} onChange={handlePreviousRoleChange}/>
                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal">
                                                <Field.Label>End Date</Field.Label>
                                                <Input type="date" name="endDate" value={newPreviousRole.endDate || ""} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Field.Root orientation="horizontal">
                                                <Field.Label>Description</Field.Label>
                                                <Textarea name="description" placeholder="Description" value={newPreviousRole.description || ""} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Button onClick={handleAddExperience} colorScheme="yellow" loading={isExperienceLoading}>
                                                {newPreviousRole.id ? "Save Experience" : "Add Experience"}
                                            </Button>
                                        </Stack>

                                        <Separator size="md" />
                                        <Stack gap={2}>
                                            {previousRoles?.map((prevRole) => (
                                                <Card.Root key={prevRole.id} colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm">
                                                    <HStack p={2} justify="flex-end">
                                                        <IconButton position="absolute" right="0px" top="0px" aria-label="Edit" variant="ghost" colorScheme="yellow" size="sm" onClick={() => handleEditPreviousRole(prevRole.id)} disabled={isExperienceLoading} >
                                                            {editingPreviousRoleId === prevRole.id ? <LuPencilOff /> : <LuPencil />}
                                                        </IconButton>
                                                        <IconButton position="absolute" right="40px" top="0px" aria-label="Delete" variant="ghost" colorScheme="yellow" size="sm" onClick={() => handleDeletePreviousRole(prevRole.id)} disabled={isExperienceLoading} >
                                                            <LuTrash2 />
                                                        </IconButton>
                                                    </HStack>
                                                    <Box direction="row" key={prevRole.id} p={4}>
                                                        {editingPreviousRoleId === prevRole.id && editPreviousRole ? (
                                                        <Stack gap={2} padding={4}>
                                                            <Input
                                                                name="role"
                                                                placeholder="Role"
                                                                value={editPreviousRole.role}
                                                                onChange={handleEditPreviousRoleChange}
                                                            />
                                                            <Input
                                                                name="company"
                                                                placeholder="Company"
                                                                value={editPreviousRole.company}
                                                                onChange={handleEditPreviousRoleChange}
                                                            />
                                                            <Input
                                                                type="date"
                                                                name="startDate"
                                                                value={editPreviousRole.startDate}
                                                                onChange={handleEditPreviousRoleChange}
                                                            />
                                                            <Input
                                                                type="date"
                                                                name="endDate"
                                                                value={editPreviousRole.endDate || ""}
                                                                onChange={handleEditPreviousRoleChange}
                                                            />
                                                            <Textarea
                                                                name="description"
                                                                placeholder="Description"
                                                                value={editPreviousRole.description || ""}
                                                                onChange={handleEditPreviousRoleChange}
                                                            />
                                                        </Stack>
                                                    ) : (
                                                        <>
                                                            <Text>{prevRole.role} at {prevRole.company}</Text>
                                                            <Text>{new Date(prevRole.startDate).toLocaleDateString()} - {prevRole.endDate ? new Date(prevRole.endDate).toLocaleDateString() : "Present"}</Text>
                                                            <Text>{prevRole.description}</Text>
                                                        </>
                                                    )}
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

                    {updatedUser.role.includes("candidate") && (
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
                                                    <Text fontWeight="bold">{app.course.name}</Text>
                                                    <Text>Course ID: {app.course.code}</Text>
                                                    <Text>Date Submitted: {new Date(app.appliedAt).toLocaleDateString()}</Text>
                                                    <Text>Availability: {app.availability}</Text>
                                                    {/* <Text>Skills: {app.skills.join(", ")}</Text> No aplication skills in db */}
                                                    {/* <Text>
                                                        Academic Credentials: {
                                                            Array.isArray(app.user.academicCredentials)
                                                                ? app.user.academicCredentials.join(", ")
                                                                : (app.user.academicCredentials || "None")
                                                        }
                                                    </Text> */}
                                                    <Text>Status: <strong>{app.status}</strong></Text>

                                                    {/* {app.previousRoles && app.previousRoles.length > 0 && (
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
                                                )} */}
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
                    </Card.Root>)}

                </Stack>
            </Stack>
            
        </div>
    );
};

export default ProfilePage;