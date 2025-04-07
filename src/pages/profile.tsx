import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const ProfilePage: React.FC = () => {
    const { currentUser } = useAuth();
    
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
                    <Stack gap={4}>
                    <Text fontWeight="medium">Profile Information</Text>
                    <Stack gap={2}>
                        <Text>First Name: {currentUser?.firstName}</Text>
                        <Text>Last Name: {currentUser?.lastName}</Text>
                        <Text>Email: {currentUser?.email}</Text>
                        <Text>Role: {currentUser?.role}</Text>
                    </Stack>
                    </Stack>
            </Stack>
            
        </div>
    );
};

export default ProfilePage;