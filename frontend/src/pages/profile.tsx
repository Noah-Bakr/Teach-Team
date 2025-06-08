import { Box, Button, Card, Field, Input, NativeSelect, Separator, Stack, Textarea, Text, IconButton, HStack, Tag } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UserUI } from "@/types/userTypes";
import { addCredentialsToUser, addSkillsToUser, removeSkillFromUser, updateUser } from "@/services/userService";
import { Roles } from "@/types/roleTypes";
import { getCurrentUser } from "@/services/authService";
import { mapBackendUserToUI } from "@/services/mappers/authMapper"
import { deletePreviousRole, updatePreviousRole, createPreviousRole, fetchPreviousRolesByUserId } from "@/services/previousRoleService";
import { fetchApplicationsByUserId } from "@/services/applicationService";
import { PreviousRoleUI } from "@/types/previousRoleTypes";

import { LuPencil, LuPencilOff, LuTrash2 } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { fetchAllSkills, createSkill, fetchSkillById, deleteSkill } from "@/services/skillService";
import { SkillUI } from "@/types/skillTypes";
import { AcademicCredentialUI } from "@/types/academicCredentialTypes";
import { createAcademicCredential, deleteAcademicCredential, updateAcademicCredential } from "@/services/academicCredentialService";

import { ApplicationUI } from "@/types/types";
import { AcademicCredential } from "@/services/api/userApi";

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
    const [userApplicants, setUserApplicants] = useState<ApplicationUI[]>([]);

    const [isExperienceLoading, setIsExperienceLoading] = useState(false);
    const [experienceRoleError, setExperienceRoleError] = useState(false);
    const [experienceCompanyError, setExperienceCompanyError] = useState(false);
    const [experienceStartDateError, setExperienceStartDateError] = useState(false);

    const [editExperienceRoleError, setEditExperienceRoleError] = useState(false);
    const [editExperienceCompanyError, setEditExperienceCompanyError] = useState(false);
    const [editExperienceStartDateError, setEditExperienceStartDateError] = useState(false);

    const [previousRoles, setPreviousRoles] = useState<PreviousRoleUI[]>([]);
    const [editingPreviousRoleId, setEditingPreviousRoleId] = useState<number | null>(null);
    const [editPreviousRole, setEditPreviousRole] = useState<PreviousRoleUI | null>(null);

    const [allSkills, setAllSkills] = useState<SkillUI[]>([]);
    const [removedSkills, setRemovedSkills] = useState<string[]>([]);

    const [isSaveLoading, setSaveLoading] = useState(false);

    const [academicCredentialDegreeNameError, setAcademicCredentialDegreeNameError] = useState(false);
    const [academicCredentialInstitutionError, setAcademicCredentialInstitutionError] = useState(false);
    const [academicCredentialStartDateError, setAcademicCredentialStartDateError] = useState(false);
    const [academicCredentialEndDateError, setAcademicCredentialEndDateError] = useState(false);

    const [editAcademicCredentialDegreeNameError, setEditAcademicCredentialDegreeNameError] = useState(false);
    const [editAcademicCredentialInstitutionError, setEditAcademicCredentialInstitutionError] = useState(false);
    const [editAcademicCredentialStartDateError, setEditAcademicCredentialStartDateError] = useState(false);
    const [editAcademicCredentialEndDateError, setEditAcademicCredentialEndDateError] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    // // State to manage the new experience input fields
    const [newPreviousRole, setNewPreviousRole] = useState<PreviousRoleUI>({
        id: 0,
        userId: 0,
        role: "",
        company: "",
        startDate: "",
        endDate: "" ,
        description: "",
    });

    const [academicCredentials, setAcademicCredentials] = useState<AcademicCredentialUI[]>([]);
    const [newAcademicCredential, setNewAcademicCredential] = useState<AcademicCredentialUI>({
        id: 0,
        degreeName: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: "",
    });
    const [editingAcademicCredentialId, setEditingAcademicCredentialId] = useState<number | null>(null);
    const [editAcademicCredential, setEditAcademicCredential] = useState<AcademicCredentialUI | null>(null);
    const [isAcademicLoading, setIsAcademicLoading] = useState(false);

    // Fetch current user ID from /auth/me and then fetch user data from /user/:id
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                const user: UserUI = mapBackendUserToUI(response);
                setCurrentUser(user);
                setUpdatedUser(user);

                const backendCreds = response.academicCredentials || [];
                // Map backend credentials to AcademicCredentialUI shape
                setAcademicCredentials(
                    backendCreds.map((cred: AcademicCredential) => ({
                        id: cred.academic_id,
                        degreeName: cred.degree_name ?? "",
                        institution: cred.institution ?? "",
                        startDate: cred.start_date ?? "",
                        endDate: cred.end_date ?? "",
                        description: cred.description ?? "",
                    }))
                );
                setPreviousRoles(await fetchPreviousRolesByUserId(user.id) ?? []);
                setUserApplicants(await fetchApplicationsByUserId(user.id) || []);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Fetch all skills on wake
        fetchAllSkills().then(setAllSkills);
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
            setIsExperienceLoading(true);
            const roleToCreate = {
                previous_role: newPreviousRole.role,
                company: newPreviousRole.company,
                start_date: newPreviousRole.startDate,
                end_date: newPreviousRole.endDate ?? null,
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
            setIsExperienceLoading(false);
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
            }
        }
    };

    const handleEditPreviousRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditPreviousRole((prev) => prev ? { ...prev, [name]: value } : prev);
    };

    const handleUpdateExperience = async () => {
        if (!editingPreviousRoleId || !editPreviousRole) return;

        if (editPreviousRole.role === '' || !editPreviousRole.role) {
            setEditExperienceRoleError(true);
            return;
        } else { setEditExperienceRoleError(false); }
        if (editPreviousRole.company === '' || !editPreviousRole.company) {
            setEditExperienceCompanyError(true);
            return;
        } else { setEditExperienceCompanyError(false); }
        if (editPreviousRole.startDate === '' || !editPreviousRole.startDate) {
            setEditExperienceStartDateError(true);
            return;
        } else { setEditExperienceStartDateError(false); }

        try {
            setIsExperienceLoading(true);
            const payload = {
                previous_role: editPreviousRole.role,
                company: editPreviousRole.company,
                start_date: editPreviousRole.startDate,
                end_date: editPreviousRole.endDate ?? null,
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
            setIsExperienceLoading(false);

            toaster.create({
                title: "Experience Updated",
                description: "Your previous experience has been updated.",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            setIsExperienceLoading(false);
                console.error("Failed to update previous experience", error);
                toaster.create({
                    title: "Error",
                    description: "Failed to add previous experience.",
                    type: "error",
                    duration: 5000,
                });
        }
    };

    const handleSave = async () => {
        if (!updatedUser.firstName || updatedUser.firstName.trim() === "") {
            setFirstNameError(true);
            return;
        } else { setFirstNameError(false); }
        if (!updatedUser.lastName || updatedUser.lastName.trim() === "") {
            setLastNameError(true);
            return;
        } else { setLastNameError(false); }
        if (!updatedUser.username || updatedUser.username.trim() === "") {
            setUsernameError(true);
            return;
        } else { setUsernameError(false); }
        if (!updatedUser.email || updatedUser.email.trim() === "") {
            setEmailError(true);
            return;
        } else { setEmailError(false); }

        try {
            setSaveLoading(true);
            // only sends the data that API expects
            const payload = {
                username: updatedUser.username,
                email: updatedUser.email,
                first_name: updatedUser.firstName,
                last_name: updatedUser.lastName,
                avatar: updatedUser.avatar,
            };

            await updateUser(updatedUser.id, payload);

            // Create and attach new skills
            const existingSkillNames = allSkills.map((s) => s.name.toLowerCase());
            const newSkillNames = (updatedUser.skills ?? []).filter(
                (skill) => !existingSkillNames.includes(skill.toLowerCase())
            );

            const newSkillIds: number[] = [];

            // Only if there are new skills
            if (newSkillNames.length > 0) {
                for (const skillName of newSkillNames) {
                    const created = await createSkill({ skill_name: skillName });
                    const skillId = created.id || created.id;
                    if (skillId) newSkillIds.push(skillId);
                    setAllSkills((prev) => [...prev, created]);
                }

                // Link new skills to the user
                const updated = await addSkillsToUser(updatedUser.id, newSkillIds);

                // Sync updated user.skills (only if API returns them)
                if (updated?.skills) {
                    setUpdatedUser((prev) => ({
                        ...prev,
                        skills: updated?.skills?.map((s) => {
                            const skill = s as { name?: string; skill_name?: string };
                            return skill.name || skill.skill_name || "";
                        }),
                    }));
                }
            }

            // Remove unlinked skills
            if (removedSkills.length > 0) {
                for (const skillName of removedSkills) {
                    const skillObj = allSkills.find(
                        (s) => s.name.toLowerCase() === skillName.toLowerCase()
                    );
                    const skillId = skillObj?.id || skillObj?.id;

                    if (!skillId) continue;

                    try {
                        // Remove skill from user
                        await removeSkillFromUser(updatedUser.id, skillId);

                        // Fetch the skill to check if it has any users left
                        const response = await fetchSkillById(skillId);
                        // If the skill has no users or courses, delete it (for cleanup)
                        if ((!response.users || response.users.length === 0) && (!response.courses || response.courses.length === 0)) {
                            await deleteSkill(skillId);
                        }
                    } catch (err) {
                        console.error(`Failed to remove/unlink skill "${skillName}":`, err);
                    }
                }
                // Clear the removed skills state
                setRemovedSkills([]);
            }

            try {
                const refreshedUser = await getCurrentUser();
                const refreshedSkills = refreshedUser.skills || [];

                setUpdatedUser((prev) => ({
                    ...prev,
                    skills: refreshedSkills.map((s) => {
                        const skill = s as { name?: string; skill_name?: string };
                        return skill.name || skill.skill_name || "";
                    }),
                }));
            } catch (error) {
                console.error("Failed to re-fetch skills after saving:", error);
            }

            setIsEditing(false);
            setIsDisabled(true);
            // setHasUnsavedChanges(false);
            setSaveLoading(false);
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
            console.error("Failed to delete previous role", error);
            toaster.create({
                title: "Error",
                description: "Failed to delete previous role.",
                type: "error",
                duration: 4000,
            });
        }
    };

    // Function to handle changes to the NEW academic credential input fields
    const handleAcademicCredentialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewAcademicCredential((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditAcademicCredentialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditAcademicCredential((prev) =>
            prev ? { ...prev, [name]: value } : prev
        );
    };

    // Function to handle adding a new academic credential
    const handleAddAcademicCredential = async () => {
        if (newAcademicCredential.degreeName === '' || !newAcademicCredential.degreeName) {
            setAcademicCredentialDegreeNameError(true);
            return;
        } else { setAcademicCredentialDegreeNameError(false); }
        if (newAcademicCredential.institution === '' || !newAcademicCredential.institution) {
            setAcademicCredentialInstitutionError(true);
            return;
        } else { setAcademicCredentialInstitutionError(false); }
        if (newAcademicCredential.startDate === '' || !newAcademicCredential.startDate) {
            setAcademicCredentialStartDateError(true);
            return;
        } else { setAcademicCredentialStartDateError(false); }
        if (newAcademicCredential.endDate && new Date(newAcademicCredential.endDate) < new Date(newAcademicCredential.startDate)) {
            setAcademicCredentialEndDateError(true);
            return;
        } else { setAcademicCredentialEndDateError(false); }

        try {
            setIsAcademicLoading(true);
            const payload = {
                degree_name: newAcademicCredential.degreeName,
                institution: newAcademicCredential.institution,
                start_date: newAcademicCredential.startDate,
                end_date: newAcademicCredential.endDate ?? null,
                description: newAcademicCredential.description,
            };
            const created = await createAcademicCredential(payload);

            await addCredentialsToUser(updatedUser.id, [created.id]);

            setAcademicCredentials((prev) => [...prev, created]);
            setNewAcademicCredential({
                id: 0,
                degreeName: "",
                institution: "",
                startDate: "",
                endDate: "",
                description: "",
            });
            setIsAcademicLoading(false);
            toaster.create({
                title: "Success",
                description: "Academic credential added successfully.",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            setIsAcademicLoading(false);
            console.error("Failed to add academic credential", error);
            toaster.create({
                title: "Error",
                description: "Failed to add academic credential.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const handleEditAcademicCredential = (id: number) => {
        if (editingAcademicCredentialId === id) {
            handleUpdateAcademicCredential();
        } else {
            const cred = academicCredentials.find((c) => c.id === id);
            if (cred) {
                setEditAcademicCredential({ ...cred, id: cred.id });
                setEditingAcademicCredentialId(id);
            }
        }
    };

    const handleUpdateAcademicCredential = async () => {
        if (!editingAcademicCredentialId || !editAcademicCredential) return;

        if (editAcademicCredential.degreeName === '' || !editAcademicCredential.degreeName) {
            setEditAcademicCredentialDegreeNameError(true);
            return;
        } else { setEditAcademicCredentialDegreeNameError(false); }
        if (editAcademicCredential.institution === '' || !editAcademicCredential.institution) {
            setEditAcademicCredentialInstitutionError(true);
            return;
        } else { setEditAcademicCredentialInstitutionError(false); }
        if (editAcademicCredential.startDate === '' || !editAcademicCredential.startDate) {
            setEditAcademicCredentialStartDateError(true);
            return;
        } else { setEditAcademicCredentialStartDateError(false); }
        if (editAcademicCredential.endDate && new Date(editAcademicCredential.endDate) < new Date(editAcademicCredential.startDate)) {
            setEditAcademicCredentialEndDateError(true);
            return;
        } else { setEditAcademicCredentialEndDateError(false); }

        try {
            setIsAcademicLoading(true);
            const payload = {
                degree_name: editAcademicCredential.degreeName,
                institution: editAcademicCredential.institution,
                start_date: editAcademicCredential.startDate,
                end_date: editAcademicCredential.endDate ?? null,
                description: editAcademicCredential.description,
            };

            const updated = await updateAcademicCredential(editingAcademicCredentialId, payload);

            setAcademicCredentials((prev) =>
                prev.map((c) => (c.id === editingAcademicCredentialId ? updated : c))
            );

            // Reset state
            setEditAcademicCredential(null);
            setEditingAcademicCredentialId(null);
            setIsAcademicLoading(false);

            toaster.create({
                title: "Academic Credential Updated",
                description: "Your academic credential has been updated.",
                type: "success",
                duration: 5000,
            });
        } catch (error) {
            setIsAcademicLoading(false);
            console.error("Failed to update academic credential", error);
            toaster.create({
                title: "Error",
                description: "Failed to update academic credential.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const handleDeleteAcademicCredential = async (id: number) => {
        try {
            await deleteAcademicCredential(id);
            setAcademicCredentials((prev) => prev.filter((cred) => cred.id !== id));
            toaster.create({
                title: "Deleted",
                description: "Academic credential deleted successfully.",
                type: "success",
                duration: 4000,
            });
        } catch (error) {
            console.error("Failed to delete academic credential:", error);
            toaster.create({
                title: "Error",
                description: "Failed to delete academic credential.",
                type: "error",
                duration: 5000,
            });
        }
    };

    return (
        <div>
            <Stack gap={8}>
                <Stack gap={4} direction={"row"} width={"90rem"} overflow={"wrap"}>
                    <Card.Root colorPalette="yellow" flexDirection="row" width="25rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                        <Box width={"100%"}>
                            <Card.Body>
                                <Stack gap={2}>
                                    <Stack gap={0}>
                                        <Card.Title mb="2">Profile Information</Card.Title>
                                        <Card.Description>View or change your profile information here.</Card.Description>
                                    </Stack>
                                    {currentUser?.createdAt && (
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Account created: {formatDate(currentUser?.createdAt)}
                                        </Text>
                                    )}
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root disabled={isDisabled} invalid={firstNameError} required>
                                            <Field.Label>First Name <Field.RequiredIndicator /></Field.Label>
                                            <Input name="firstName" placeholder="First Name" value={updatedUser.firstName} onChange={handleChange} />
                                            <Field.ErrorText>This field is required</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root disabled={isDisabled} invalid={lastNameError} required>
                                            <Field.Label>Last Name <Field.RequiredIndicator /></Field.Label>
                                            <Input name="lastName" placeholder="Last Name" value={updatedUser.lastName} onChange={handleChange} />
                                            <Field.ErrorText>This field is required</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root disabled={isDisabled}>
                                            <Field.Label>Avatar</Field.Label>
                                            <Input name="avatar" placeholder="Avatar URL" value={updatedUser.avatar ?? ""} onChange={handleChange} />
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
                                        <Field.Root disabled={isDisabled} invalid={usernameError} required>
                                            <Field.Label>Username <Field.RequiredIndicator /></Field.Label>
                                            <Input name="username" placeholder="Username" value={updatedUser.username} onChange={handleChange}/>
                                            <Field.ErrorText>This field is required</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root disabled={isDisabled} invalid={emailError} required>
                                            <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
                                            <Input name="email" placeholder="Email" value={updatedUser.email} onChange={handleChange}/>
                                            <Field.ErrorText>This field is required</Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root disabled>
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
                                        <Card.Title mb="2">Skill Information</Card.Title>
                                        <Card.Description>View or change your skills here.</Card.Description>
                                    </Stack>
                                    <Separator size="md" />
                                    <Stack gap={2} padding={4}>
                                        <Field.Root orientation="horizontal" disabled={isDisabled}>
                                            <Box w="100%">
                                                <Input
                                                placeholder="Type a skill and press Enter"
                                                // Add new skill badge on key down (enter or comma)
                                                onKeyDown={(e) => {
                                                    if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                                                    e.preventDefault();
                                                    const newSkill = e.currentTarget.value.trim(); // Get the new skill from the input
                                                    if (!updatedUser?.skills?.includes(newSkill)) {
                                                        setUpdatedUser((prev) => ({
                                                        ...prev,
                                                        skills: [...(prev.skills || []), newSkill],
                                                        }));
                                                    }
                                                    e.currentTarget.value = "";
                                                    }
                                                }}
                                                disabled={isDisabled}
                                                />
                                                <HStack padding={2} mt={2} wrap="wrap">
                                                {updatedUser?.skills?.map((skill, index) => (
                                                    <Tag.Root key={index} colorScheme="yellow" size="md">
                                                    <Tag.Label>{skill}</Tag.Label>
                                                    {!isDisabled && (
                                                        <Tag.EndElement>
                                                        <Tag.CloseTrigger onClick={() => {
                                                        const skillToRemove = skill;

                                                        // Remove from the visual list
                                                        setUpdatedUser(prev => ({
                                                            ...prev,
                                                            skills: prev.skills?.filter(s => s !== skillToRemove)
                                                        }));

                                                        // Track it for deletion
                                                        setRemovedSkills(prev => [...prev, skillToRemove]);
                                                        }} />
                                                        </Tag.EndElement>
                                                    )}
                                                    </Tag.Root>
                                                ))}
                                                </HStack>
                                            </Box>
                                        </Field.Root>
                                    </Stack>
                                </Stack>)}
                                
                            </Card.Body>
                            <Card.Footer>
                                <Button 
                                    onClick={() => {
                                        if (isEditing) {
                                        handleSave();
                                        } else {
                                        setIsEditing(true);
                                        setIsDisabled(false);
                                        }
                                    }} 
                                    loading={isSaveLoading}
                                >
                                    {isEditing ? "Save" : "Edit"}
                                    </Button>
                            </Card.Footer>
                        </Box>
                    </Card.Root>

                    {updatedUser.role.includes("candidate") && (
                        <Card.Root colorPalette="yellow" flexDirection="row" width="30rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                            <Box width={"100%"}>
                                <Card.Body>
                                    <Stack gap={2}>
                                            <Stack gap={0}>
                                                <Card.Title mb="2">Academic Credentials</Card.Title>
                                                <Card.Description>View, add, or edit your academic credentials here.</Card.Description>
                                            </Stack>
                                            <Separator size="md" />
                                            <Stack gap={2} padding={4}>

                                                <Field.Root invalid={academicCredentialDegreeNameError} required>
                                                    <Field.Label>Degree Name <Field.RequiredIndicator /></Field.Label>
                                                    <Input name="degreeName" placeholder="Degree Name" value={newAcademicCredential.degreeName} onChange={handleAcademicCredentialChange} />
                                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={academicCredentialInstitutionError} required>
                                                    <Field.Label>Institution <Field.RequiredIndicator /></Field.Label>
                                                    <Input name="institution" placeholder="Institution" value={newAcademicCredential.institution} onChange={handleAcademicCredentialChange} />
                                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={academicCredentialStartDateError} required>
                                                    <Field.Label>Start Date <Field.RequiredIndicator /></Field.Label>
                                                    <Input type="date" name="startDate" value={newAcademicCredential.startDate} onChange={handleAcademicCredentialChange} />
                                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root invalid={academicCredentialEndDateError} required>
                                                    <Field.Label>End Date <Field.RequiredIndicator /></Field.Label>
                                                    <Input type="date" name="endDate" value={newAcademicCredential.endDate ?? ""} onChange={handleAcademicCredentialChange} />
                                                    <Field.ErrorText>This field is required</Field.ErrorText>
                                                </Field.Root>

                                                <Field.Root>
                                                    <Field.Label>Description</Field.Label>
                                                    <Textarea name="description" placeholder="Description" value={newAcademicCredential.description ?? ""} onChange={handleAcademicCredentialChange} />
                                                </Field.Root>

                                                <Button onClick={handleAddAcademicCredential} colorScheme="yellow" loading={isAcademicLoading}>
                                                    Add Academic Credential
                                                </Button>
                                            </Stack>

                                            <Separator size="md" />
                                            <Stack gap={2}>
                                                {academicCredentials.map((cred) => (
                                                    <Card.Root key={cred.id} colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm">
                                                        <HStack p={2} justify="flex-end">
                                                            <IconButton position="absolute" right="0px" top="0px" aria-label="Edit" variant="ghost" colorScheme="yellow" size="sm" onClick={() => handleEditAcademicCredential(cred.id)} >
                                                                {editingAcademicCredentialId === cred.id ? <LuPencilOff /> : <LuPencil />}
                                                            </IconButton>
                                                            <IconButton position="absolute" right="40px" top="0px" aria-label="Delete" variant="ghost" colorScheme="yellow" size="sm" onClick={() => handleDeleteAcademicCredential(cred.id)} >
                                                                <LuTrash2 />
                                                            </IconButton>
                                                        </HStack>
                                                        <Box direction="row" key={cred.id} paddingTop={4}>
                                                            {editingAcademicCredentialId === cred.id && editAcademicCredential?.id === cred.id ? (
                                                                <Stack gap={2} padding={4}>
                                                                    <Field.Root invalid={editAcademicCredentialDegreeNameError} required>
                                                                        <Field.Label>Degree Name <Field.RequiredIndicator /></Field.Label>
                                                                        <Input width={"18rem"} name="degreeName" placeholder="Degree Name" value={editAcademicCredential.degreeName} onChange={handleEditAcademicCredentialChange}/>
                                                                        <Field.ErrorText>This field is required</Field.ErrorText>
                                                                    </Field.Root>

                                                                    <Field.Root invalid={editAcademicCredentialInstitutionError} required>
                                                                        <Field.Label>Institution <Field.RequiredIndicator /></Field.Label>
                                                                        <Input name="institution" placeholder="Institution" value={editAcademicCredential.institution} onChange={handleEditAcademicCredentialChange}/>
                                                                        <Field.ErrorText>This field is required</Field.ErrorText>
                                                                    </Field.Root>

                                                                    <Field.Root invalid={editAcademicCredentialStartDateError} required>
                                                                        <Field.Label>Start Date <Field.RequiredIndicator /></Field.Label>
                                                                        <Input type="date" name="startDate" value={editAcademicCredential.startDate} onChange={handleEditAcademicCredentialChange}/>
                                                                        <Field.ErrorText>This field is required</Field.ErrorText>
                                                                    </Field.Root>

                                                                    <Field.Root invalid={editAcademicCredentialEndDateError} required>
                                                                        <Field.Label>End Date <Field.RequiredIndicator /></Field.Label>
                                                                        <Input type="date" name="endDate" value={editAcademicCredential.endDate ?? ""} onChange={handleEditAcademicCredentialChange}/>
                                                                        <Field.ErrorText>This field is required</Field.ErrorText>
                                                                    </Field.Root>

                                                                    <Field.Root>
                                                                        <Field.Label>Description</Field.Label>
                                                                        <Textarea name="description" placeholder="Description" value={editAcademicCredential.description ?? ""} onChange={handleEditAcademicCredentialChange}/>
                                                                    </Field.Root>
                                                                </Stack>
                                                            ) : (
                                                                <>
                                                                    <Text width={"75%"}>{cred.degreeName} at {cred.institution}</Text>
                                                                    <Text>{new Date(cred.startDate).toLocaleDateString()} - {cred.endDate ? new Date(cred.endDate).toLocaleDateString() : "Present"}</Text>
                                                                    <Text>{cred.description}</Text>
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
                        <Card.Root colorPalette="yellow" flexDirection="row" width="30rem" overflow="hidden" maxW="xl" variant="outline" size="sm">
                            <Box width={"100%"}>
                                <Card.Body>
                                    <Stack gap={2}>
                                        <Stack gap={0}>
                                            <Card.Title mb="2">Previous Work Experience</Card.Title>
                                            <Card.Description>View, add, or edit your work experience here.</Card.Description>
                                        </Stack>
                                        <Separator size="md" />
                                        <Stack gap={2} padding={4}>
                                            <Field.Root invalid={experienceRoleError} required>
                                                <Field.Label>Role <Field.RequiredIndicator /></Field.Label>
                                                <Input name="role" placeholder="Role" value={newPreviousRole.role} onChange={handlePreviousRoleChange}/>
                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root invalid={experienceCompanyError} required>
                                                <Field.Label>Company <Field.RequiredIndicator /></Field.Label>
                                                <Input name="company" placeholder="Company" value={newPreviousRole.company} onChange={handlePreviousRoleChange}/>
                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root invalid={experienceStartDateError} required>
                                                <Field.Label>Start Date <Field.RequiredIndicator /></Field.Label>
                                                <Input type="date" name="startDate" value={newPreviousRole.startDate} onChange={handlePreviousRoleChange}/>
                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                            </Field.Root>

                                            <Field.Root>
                                                <Field.Label>End Date</Field.Label>
                                                <Input type="date" name="endDate" value={newPreviousRole.endDate ?? ""} onChange={handlePreviousRoleChange}/>
                                            </Field.Root>

                                            <Field.Root>
                                                <Field.Label>Description</Field.Label>
                                                <Textarea name="description" placeholder="Description" value={newPreviousRole.description ?? ""} onChange={handlePreviousRoleChange}/>
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
                                                    <Box direction="row" key={prevRole.id} paddingTop={4}>
                                                        {editingPreviousRoleId === prevRole.id && editPreviousRole ? (
                                                        <Stack gap={2} padding={4}>
                                                            <Field.Root invalid={editExperienceRoleError} required>
                                                                <Field.Label>Role <Field.RequiredIndicator /></Field.Label>
                                                                <Input width={"18rem"} name="role" placeholder="Role" value={editPreviousRole.role} onChange={handleEditPreviousRoleChange}/>
                                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                                            </Field.Root>

                                                            <Field.Root invalid={editExperienceCompanyError} required>
                                                                <Field.Label>Company <Field.RequiredIndicator /></Field.Label>
                                                                <Input name="company" placeholder="Company" value={editPreviousRole.company} onChange={handleEditPreviousRoleChange}/>
                                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                                            </Field.Root>

                                                            <Field.Root invalid={editExperienceStartDateError} required>
                                                                <Field.Label>Start Date <Field.RequiredIndicator /></Field.Label>
                                                                <Input type="date" name="startDate" value={editPreviousRole.startDate} onChange={handleEditPreviousRoleChange}/>
                                                                <Field.ErrorText>This field is required</Field.ErrorText>
                                                            </Field.Root>

                                                            <Field.Root>
                                                                <Field.Label>End Date</Field.Label>
                                                                <Input type="date" name="endDate" value={editPreviousRole.endDate ?? ""} onChange={handleEditPreviousRoleChange}/>
                                                            </Field.Root>

                                                            <Field.Root>
                                                                <Field.Label>Description</Field.Label>
                                                                <Textarea name="description" placeholder="Description" value={editPreviousRole.description ?? ""} onChange={handleEditPreviousRoleChange}/>
                                                            </Field.Root>
                                                        </Stack>
                                                    ) : (
                                                        <>
                                                            <Text width={"99%"}>{prevRole.role} at {prevRole.company}</Text>
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
                                            <Card.Root key={app.id} colorPalette="yellow" flexDirection="row" overflow="hidden" maxW="xl" variant="outline" size="sm">
                                                <Box p="4" >
                                                    <Text fontWeight="bold">{app.course?.name}</Text>
                                                    <Text>Course ID: {app.course?.code}</Text>
                                                    <Text>Date Submitted: {new Date(app.appliedAt).toLocaleDateString()}</Text>
                                                    <Text>Availability: {app.availability}</Text>
                                                    <Text>Status: <strong>{app.status}</strong></Text>
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