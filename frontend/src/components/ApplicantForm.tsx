import { Button, AbsoluteCenter, Box, ButtonGroup, VStack, 
  Input, Field, Heading, Text, CloseButton, Presence, useDisclosure,
  NativeSelect,
  Checkbox,
  HStack,
  Tag} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toaster } from "@/components/ui/toaster"
import { useAuth } from "@/context/AuthContext";
import { Availability, SkillUI, ReviewUI, CourseUI, ApplicationStatus, UserUI } from "@/types/types";
import { createApplication } from "@/services/applicationService";
import { createSkill, deleteSkill, fetchAllSkills, fetchSkillById } from "@/services/skillService";
import { addSkillsToUser, removeSkillFromUser } from "@/services/userService";
import styles from "../styles/PopUpForm.module.css";

interface ApplicantFormProps {
  closeForm: () => void;
  course: CourseUI;
  positionType: 'tutor' | 'lab_assistant';
  onApplicationSubmitted?: () => void;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ closeForm, course, positionType, onApplicationSubmitted }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [removedSkills, setRemovedSkills] = useState<string[]>([]);
  const { open, onToggle } = useDisclosure();
  const [formUser, setFormUser] = useState<UserUI>(() => ({
    id: currentUser?.id ?? 0,
    username: currentUser?.username ?? "",
    firstName: currentUser?.firstName ?? "",
    lastName: currentUser?.lastName ?? "",
    email: currentUser?.email ?? "",
    avatar: currentUser?.avatar ?? "",
    role: currentUser?.role ?? "candidate",
    skills: (currentUser?.skills ?? []).map((skill) =>
        typeof skill === "string" ? { id: 0, name: skill } : skill
    ),
    academicCredentials: (currentUser?.academicCredentials ?? []).map((cred) =>
        typeof cred === "string"
            ? {
              id: 0,
              degreeName: cred,
              institution: "",
              startDate: "",
              endDate: null,
              description: "",
            }
            : cred
    ),
    courses: (currentUser?.courses ?? []).map((course) =>
        typeof course === "string"
            ? {
              id: 0,
              code: course,
              name: "",
              semester: "1",
              skills: [],
            }
            : course
    ),
    previousRoles: (currentUser?.previousRoles ?? []).map((role) =>
        typeof role === "string"
            ? {
              id: 0,
              role,
              company: "",
              startDate: "",
              endDate: null,
              description: "",
            }
            : role
    ),
    createdAt: currentUser?.createdAt ?? "",
    reviews: (currentUser?.reviews ?? []) as ReviewUI[],
  }));

  const [availability, setAvailability] = useState<"Not Available" | "Full-Time" | "Part-Time">(
    "Not Available"
  );
  const [skillsError, setSkillsError] = useState(false);
  const [allSkills, setAllSkills] = useState<SkillUI[]>([]);

  useEffect(() => {
    fetchAllSkills().then(setAllSkills);
  }, []);

  useEffect(() => {
    if (!open) {
        onToggle();
    }
  }, [onToggle, open]);

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvailability(e.target.value as "Not Available" | "Full-Time" | "Part-Time");
  };

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      return;
    }

    if (!formUser.skills || formUser.skills.length === 0) {
      setSkillsError(true);
      return;
    } else {
      setSkillsError(false);
    }

    if (!termsChecked) return;

    setLoading(true);

    try {
      const payload = {
        position_type: positionType,
        status: "pending" as ApplicationStatus,
        selected: false,
        availability,
        user_id: currentUser?.id,
        course_id: course.id,
      };

      await createApplication(payload);

      // Add new skills
      const existingSkillNames = allSkills.map((s) => s.name.toLowerCase());
      const newSkillNames = (formUser.skills ?? [])
          .map((s) => s.name)
          .filter((skillName) => !existingSkillNames.includes(skillName.toLowerCase()));

      const newSkillIds: number[] = [];

      if (newSkillNames.length > 0) {
        for (const skillName of newSkillNames) {
          const created = await createSkill({ skill_name: skillName });
          if (created.id) newSkillIds.push(created.id);
          setAllSkills((prev) => [...prev, created]);
        }

        await addSkillsToUser(currentUser.id, newSkillIds);
      }

      // Remove deleted skills
      if (removedSkills.length > 0) {
        for (const skillName of removedSkills) {
          const skillObj = allSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
          const skillId = skillObj?.id;
          if (!skillId) continue;

          await removeSkillFromUser(currentUser.id, skillId);

          const res = await fetchSkillById(skillId);
          if ((!res.users || res.users.length === 0) && (!res.courses || res.courses.length === 0)) {
            await deleteSkill(skillId);
          }
        }

        setRemovedSkills([]);
      }

      toaster.create({
        title: "Application Submitted",
        description: `You have successfully applied for ${course.name} as ${positionType.replace("_", " ")}.`,
        type: "success",
        duration: 5000,
      });

      onApplicationSubmitted?.();
      closeForm();
    } catch (error) {
      console.error("Application error:", error);
      toaster.create({
        title: "Error",
        description: "Failed to submit application.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>  {/* Overlay to block interaction with the rest of the page. Parent required */}
      {open && <div className={styles.Overlay}></div>}
      <Presence className={styles.Box}
      present={open}
      animationStyle={{ _open: "scale-fade-in", _closed: "scale-fade-out" }}
      animationDuration="moderate">
          <AbsoluteCenter colorPalette={"yellow"}>
              <Box className={styles.Box}>
                  <VStack className={styles.FormStack}>
                      <CloseButton className={styles.CloseButton} variant="ghost" colorPalette="black" onClick={() => { onToggle(); closeForm(); }}/>
                      <Heading className={styles.Header} as="h1">Apply for {course.name}</Heading>
                      <Text className={styles.Text} as="p">Please enter your details to apply.</Text>
                      <VStack className={styles.InputStack} colorPalette={"yellow"}>

                        <Field.Root className={styles.InputFieldRoot}>
                          <Field.Label>Availability</Field.Label>
                            <NativeSelect.Root >
                                <NativeSelect.Field name={styles.availability} value={availability} onChange={handleAvailabilityChange}>
                                    {Availability.map((availability) => (
                                        <option key={availability} value={availability}>{availability}</option>
                                    ))}
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        </Field.Root>

                        <Field.Root className={styles.InputFieldRoot} disabled={skillsError} required>
                          <Field.Label>Skills <Field.RequiredIndicator /></Field.Label>
                          <Box w="100%">
                              <Input
                              placeholder="Type a skill and press Enter"
                              // Add new skill badge on key down (enter or comma)
                              onKeyDown={(e) => {
                                  if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                                  e.preventDefault();
                                  const newSkill = e.currentTarget.value.trim(); // Get the new skill from the input
                                    if (!(formUser.skills ?? []).some(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
                                      setFormUser((prev) => ({
                                        ...prev,
                                        skills: [...(prev.skills || []), { id: 0, name: newSkill }],
                                      }));
                                    }
                                  e.currentTarget.value = "";
                                  }
                              }}
                              />
                              <HStack padding={2} mt={2} wrap="wrap">
                              {(formUser.skills ?? []).map((skill, index) => (
                                  <Tag.Root key={index} colorScheme="yellow" size="md">
                                    <Tag.Label>{skill.name}</Tag.Label>
                                      <Tag.EndElement>
                                      <Tag.CloseTrigger onClick={() => {
                                      const skillToRemove = skill.name;

                                      // Remove from the visual list
                                      setFormUser(prev => ({
                                          ...prev,
                                          skills: prev.skills?.filter(s => s.name !== skillToRemove)
                                      }));

                                      // Track it for deletion
                                        setRemovedSkills(prev => [...prev, skillToRemove]);
                                      }} />
                                      </Tag.EndElement>
                                  </Tag.Root>
                              ))}
                              </HStack>
                          </Box>
                          <Field.ErrorText>This field is required</Field.ErrorText>
                      </Field.Root>

                        <Field.Root className={styles.InputFieldRoot} colorPalette={"yellow"}>
                        <Field.Label></Field.Label>
                          <Checkbox.Root className={styles.InputFieldRoot} variant="solid" checked={termsChecked} onCheckedChange={(e) => setTermsChecked(!!e.checked)}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
                          </Checkbox.Root>
                        </Field.Root>

                        <ButtonGroup className={styles.ButtonGroup}>
                            <Button className={styles.Button} colorPalette="yellow" variant="surface" onClick={() => { setLoading(false); onToggle(); closeForm(); }} >Cancel</Button>
                            <Button disabled={!termsChecked} className={styles.Button} colorPalette="yellow" variant="solid" loading={loading} 
                              onClick={() => { setLoading(false); handleSubmit(); }}>Submit Application</Button>
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