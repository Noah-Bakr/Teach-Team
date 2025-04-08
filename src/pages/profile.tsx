import { Avatar, Box, Button, Card, Field, HStack, Input, Separator, Stack, Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { User } from "@/testData/user";
import { Availability, Role } from "@/testData/user";

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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
                        <Avatar.Image src={currentUser?.avatar}  />
                    </Avatar.Root>
                    <Stack gap="0">
                        <Text fontWeight="medium">{currentUser?.firstName.concat(" " + currentUser?.lastName)}</Text>
                        <Text color="fg.muted" textStyle="sm">
                        {currentUser?.email}
                        </Text>
                    </Stack>
                </HStack>

                <Card.Root colorPalette="yellow" flexDirection="row" overflow="hidden" width={"500vw"} maxW="xl" variant="outline" size="sm">
                    <Box>
                        <Card.Body>
                            <Card.Title mb="2">Profile Information</Card.Title>
                            <Card.Description>View or change your profile information here.</Card.Description>
                            <Separator size="md" />
                            <Stack gap={2} padding={4}>
                                <Field.Root orientation="horizontal">
                                    <Field.Label>First Name</Field.Label>
                                    <Input disabled={isDisabled} name="firstName" placeholder="First Name" value={updatedUser.firstName} onChange={handleChange}/>
                                </Field.Root>

                                <Field.Root orientation="horizontal">
                                    <Field.Label>Last Name</Field.Label>
                                    <Input disabled={isDisabled} name="lastName" placeholder="Last Name" value={updatedUser.lastName} onChange={handleChange}/>
                                </Field.Root>

                                <Field.Root orientation="horizontal">
                                    <Field.Label>Email</Field.Label>
                                    <Input disabled={isDisabled} name="email" placeholder="Email" value={updatedUser.email} onChange={handleChange}/>
                                </Field.Root>

                                <Field.Root orientation="horizontal">
                                    <Field.Label>Role</Field.Label>
                                    <Input disabled={isDisabled} name="role" placeholder="Role" value={updatedUser.role} onChange={handleChange}/>
                                </Field.Root>

                            </Stack>
                        </Card.Body>
                        <Card.Footer>
                            <Button onClick={() => {isEditing ? handleSave() : setIsEditing(true); }}>{isEditing ? "Save" : "Edit"}</Button>
                        </Card.Footer>
                    </Box>
                </Card.Root>
                    <Stack gap={4}>
                        <Text fontWeight="medium">Profile Information</Text>
                        <Stack gap={2}>
                            <Text>First Name: {updatedUser.firstName}</Text>
                            <Text>Last Name: {updatedUser.lastName}</Text>
                            <Text>Email: {updatedUser.email}</Text>
                            <Text>Role: {updatedUser.role}</Text>
                        </Stack>
                    </Stack>
                    <Stack gap="8" maxW="sm" css={{ "--field-label-width": "96px" }}>
                        <Field.Root orientation="horizontal">
                            <Field.Label>Name</Field.Label>
                            <Input placeholder="John Doe" flex="1" />
                        </Field.Root>

                        <Field.Root orientation="horizontal">
                            <Field.Label>Email</Field.Label>
                            <Input placeholder="me@example.com" flex="1" />
                        </Field.Root>

                        </Stack>
            </Stack>
            
        </div>
    );
};

export default ProfilePage;