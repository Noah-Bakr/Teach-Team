import { Avatar, Box, Button, Card, Field, HStack, Input, NativeSelect, 
    Separator, Stack, Text, Textarea } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Availability, Role, Roles, User } from "@/types/types";
import { PasswordInput } from "@/components/ui/password-input";

// TODO: Add area for previous experience
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
    });

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
            });
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
    // Updates the state of the updatedUser object
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({
            ...prevUser,
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

    // Function to handle saving the updated user data
    const handleSave = () => {
        const savedUser = { ...currentUser, ...updatedUser }; // Merge currentUser and updatedUser
        updateUserInLocalStorage(savedUser);
        setIsEditing(false);
    };

    return (
        <div>
            <Stack gap={8}>
                <HStack gap="4">
                    <Avatar.Root colorPalette="yellow" size={"2xl"} >
                        <Avatar.Fallback name={currentUser?.firstName.concat(" " + currentUser?.lastName)} />
                        <Avatar.Image src={currentUser?.avatar}/>
                    </Avatar.Root>
                    <Stack gap="0">
                        <Text fontWeight="medium">{currentUser?.firstName.concat(" " + currentUser?.lastName)}</Text>
                        <Text color="fg.muted" textStyle="sm">
                        {currentUser?.email}
                        </Text>
                    </Stack>
                </HStack>

                <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm">
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
                    
                    
            </Stack>
            
        </div>
    );
};

export default ProfilePage;