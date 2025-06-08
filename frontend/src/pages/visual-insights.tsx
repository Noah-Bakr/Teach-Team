"use client";

import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Spinner, Text, Stat, WrapItem, HStack, Wrap, Badge, Avatar } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useColorModeValue } from "@/components/ui/color-mode";
import { fetchVisualInsights } from "@/services/visualInsightsService";
import {CreamCard} from "@/components/CreamCard";
import { VisualInsightsUI } from "@/types/types";

const STATUS_COLORS: Record<string, string> = {
    accepted: "#38A169",
    pending: "#D69E2E",
    rejected: "#E53E3E",
};

type SkillStat = {
    skill_name: string;
    count: number;
};

type SkillUser = {
    skill_name: string;
    user_id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
};

const VisualInsightsPage: React.FC = () => {
    const [insights, setInsights] = useState<VisualInsightsUI | null>(null);
    const [loading, setLoading] = useState(true);


    const cardBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    useEffect(() => {
        fetchVisualInsights()
            .then((data) => {
                setInsights(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load insights", err);
                setLoading(false);
            });
    }, [])
    const skillBg2 = useColorModeValue("gray.700", "gray.700");
    const skillBg = useColorModeValue("gray.100", "gray.700");
    const skillBc = useColorModeValue("gray.300", "gray.600");


    if (loading || !insights) return <Spinner size="xl" color="blue.500" />;

    const { statusBreakdown, averageRankByStatus, mostCommonSkills } = insights;
    const totalApplications = statusBreakdown.reduce((acc: number, s) => acc + Number(s.count), 0);
    const mostPopularSkill = mostCommonSkills?.[0]?.skill_name ?? "N/A";

    return (
        <CreamCard>
            <Heading mb={6}>Visual Insights Dashboard</Heading>

            {/* Summary Section */}
            <SimpleGrid columns={[1, 2, 3]} margin={6} mb={10}>
                {statusBreakdown.map((item) => (
                    <Stat.Root
                        key={item.status}
                        bg={cardBg}
                        p={5}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Stat.Label textTransform="capitalize">{item.status}</Stat.Label>
                        <Stat.ValueText fontSize="2xl">{item.count}</Stat.ValueText>
                    </Stat.Root>
                ))}

                <Stat.Root
                    bg={cardBg}
                    p={5}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Stat.Label>Total Applications</Stat.Label>
                    <Stat.ValueText fontSize="2xl">{totalApplications}</Stat.ValueText>
                </Stat.Root>

                <Stat.Root
                    bg={cardBg}
                    p={5}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >

                    <Stat.Label>Most Popular Skill</Stat.Label>
                    <Stat.ValueText fontSize="2xl">{mostPopularSkill}</Stat.ValueText>
                </Stat.Root>
            </SimpleGrid>

            {/* Most Accepted status */}
            {insights.mostAcceptedApplicant && (
                <Box w="100%" mt={12}>
                    <Heading size="md" mb={4}>🎖 Most Accepted Applicant</Heading>
                    <SimpleGrid columns={[1]} margin={6}>
                        <Box borderWidth="1px" borderRadius="lg" p={5} bg={cardBg} borderColor={borderColor}>
                            <Avatar.Root>
                                <Avatar.Fallback name={`${insights.mostAcceptedApplicant.first_name} ${insights.mostAcceptedApplicant.last_name}`} />
                                <Avatar.Image src={insights.mostAcceptedApplicant.avatar} />
                            </Avatar.Root>
                            <Text fontSize="lg" fontWeight="bold">
                                {insights.mostAcceptedApplicant.first_name} {insights.mostAcceptedApplicant.last_name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Accepted to {insights.mostAcceptedApplicant.acceptedCount} positions
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Box>
            )}

            {/* Top & Bottom Ranked Applicants */}
            <Box w="100%" mt={12}>
                <Heading size="md" mb={4}>Top & Bottom Ranked Applicants</Heading>
                <SimpleGrid columns={[1, 2]} margin={6}>
                    {/* Top Ranked Applicants */}
                    <Box borderWidth="1px" borderRadius="lg" p={5} bg={cardBg} borderColor={borderColor}>
                        <Heading size="sm" mb={3}>Top Ranked Applicants</Heading>
                        {insights.topApplicants.length === 0 ? (
                            <Text>No top applicants yet.</Text>
                        ) : (
                            insights.topApplicants.map((applicant) => (
                                <Box key={applicant.user_id} mb={3}>
                                    <HStack margin={3}>
                                        <Avatar.Root>
                                            <Avatar.Fallback name={`${applicant.first_name} ${applicant.last_name}`} />
                                            <Avatar.Image src={applicant.avatar} />
                                        </Avatar.Root>
                                        <Box>
                                            <Text fontWeight="bold">
                                                {applicant.first_name} {applicant.last_name}
                                            </Text>
                                            <Text fontSize="sm">Avg Rank: {applicant.avgRank.toFixed(2)}</Text>
                                        </Box>
                                    </HStack>
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Bottom Ranked Applicants */}
                    <Box borderWidth="1px" borderRadius="lg" p={5} bg={cardBg} borderColor={borderColor}>
                        <Heading size="sm" mb={3}>Lowest Ranked Applicants</Heading>
                        {insights.bottomApplicants.length === 0 ? (
                            <Text>No bottom applicants yet.</Text>
                        ) : (
                            insights.bottomApplicants.map((applicant) => (
                                <Box key={applicant.user_id} mb={3}>
                                    <HStack margin={3}>
                                        <Avatar.Root>
                                            <Avatar.Fallback name={`${applicant.first_name} ${applicant.last_name}`} />
                                            <Avatar.Image src={applicant.avatar} />
                                        </Avatar.Root>
                                        <Box>
                                            <Text fontWeight="bold">
                                                {applicant.first_name} {applicant.last_name}
                                            </Text>
                                            <Text fontSize="sm">Avg Rank: {applicant.avgRank.toFixed(2)}</Text>
                                        </Box>
                                    </HStack>
                                </Box>
                            ))
                        )}
                    </Box>
                </SimpleGrid>
            </Box>

            <Heading size="md" mb={4}>Visual Charts Overview</Heading>
            <SimpleGrid columns={[1, 2, 3]} margin={6} mb={12}>

                {/* Pie - Application Status Breakdown */}
                <Box h="400px" bg={cardBg} borderRadius="lg" p={4} border="1px solid" borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Application Status Breakdown</Heading>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={statusBreakdown}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {statusBreakdown.map((entry, index: number) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#8884d8"} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} applications`, "Count"]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                {/* Bar - Average Rank by Status */}
                <Box h="400px" bg={cardBg} borderRadius="lg" p={4} border="1px solid" borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Avg Ranking by Status</Heading>
                    <ResponsiveContainer>
                        <BarChart
                            data={averageRankByStatus.map((item) => ({
                                ...item,
                                avgRank: item.avgRank,
                            }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`${Number(value).toFixed(2)} rank`, "Avg Rank"]}
                            />
                            <Legend />
                            <Bar dataKey="avgRank" fill="#3182CE" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                {/* Position Type Breakdown */}
                <Box h="400px"
                     bg={cardBg}
                     borderRadius="lg"
                     p={4} border="1px solid"
                     borderColor={borderColor}
                >
                    <Heading size="sm" mb={4}>Position Type Breakdown</Heading>
                    <ResponsiveContainer>
                        <BarChart
                            data={insights.positionBreakdown.map((item) => ({
                                ...item,
                                count: Number(item.count),
                            }))}
                        >
                            <XAxis dataKey="position" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#DD6B20" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </SimpleGrid>

            {/* Skills Comparison Section */}
            <Box w="100%" mt={12}>

                <SimpleGrid columns={[1, null, 2]} margin={6} padding={6}>
                    {/* Most Common Skills */}
                    <Box>
                        <Heading size="sm" mb={4}> Top 2 Most Common Skills & Their Users</Heading>
                        {insights.mostCommonSkills?.map((skill: SkillStat) => {
                            const isMost = true;
                            const users = insights.usersWithMostPopularSkills?.filter(
                                (u: SkillUser) => u.skill_name === skill.skill_name
                            ) ?? [];

                            return (
                                <Box
                                    key={skill.skill_name}
                                    m={4}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={4}
                                    bg={cardBg}
                                    borderColor={borderColor}
                                    minH="150px"
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                >
                                    <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="bold">{skill.skill_name}</Text>
                                        <Badge colorScheme={isMost ? "green" : "purple"}>
                                            {skill.count} users
                                        </Badge>
                                    </HStack>

                                    <Wrap margin={3}>
                                        {users.map((u: SkillUser) => (
                                            <WrapItem key={`${u.user_id}-${skill.skill_name}`}>
                                                <HStack
                                                    borderWidth="1px"
                                                    borderRadius="md"
                                                    px={3}
                                                    py={1}
                                                    bg={skillBg2}
                                                    borderColor={skillBc}
                                                >
                                                    <Avatar.Root>
                                                        <Avatar.Fallback name={`${u.first_name} ${u.last_name}`} />
                                                        <Avatar.Image src={u.avatar} />
                                                    </Avatar.Root>
                                                    <Text fontSize="sm">{u.first_name} {u.last_name}</Text>
                                                </HStack>
                                            </WrapItem>
                                        ))}
                                    </Wrap>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Least Common Skills */}
                    <Box>
                        <Heading size="sm" mb={4}>  Least Common Skills & Their Users</Heading>

                        {insights.leastCommonSkills?.map((skill: SkillStat) => {
                            const isMost = false;
                            const users = insights.usersWithLeastCommonSkills?.filter(
                                (u: SkillUser) => u.skill_name === skill.skill_name
                            ) ?? [];

                            return (
                                <Box
                                    key={skill.skill_name}
                                    m={4}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    p={4}
                                    bg={cardBg}
                                    borderColor={borderColor}
                                    minH="150px" // Set consistent height
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                >
                                    <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="bold">{skill.skill_name}</Text>
                                        <Badge colorScheme={isMost ? "green" : "purple"}>
                                            {skill.count} users
                                        </Badge>
                                    </HStack>

                                    <Wrap margin={3}>
                                        {users.map((u: SkillUser) => (
                                            <WrapItem key={`${u.user_id}-${skill.skill_name}`}>
                                                <HStack
                                                    borderWidth="1px"
                                                    borderRadius="md"
                                                    px={3}
                                                    py={1}
                                                    bg={skillBg}
                                                    borderColor={skillBc}
                                                >
                                                    <Avatar.Root>
                                                        <Avatar.Fallback name={`${u.first_name} ${u.last_name}`} />
                                                        <Avatar.Image src={u.avatar} />
                                                    </Avatar.Root>
                                                    <Text fontSize="sm">{u.first_name} {u.last_name}</Text>
                                                </HStack>
                                            </WrapItem>
                                        ))}
                                    </Wrap>
                                </Box>
                            );
                        })}
                    </Box>
                </SimpleGrid>
            </Box>

            {/* Unranked Applicants Table */}
            <Box w="100%" mt={12}>
                <Heading size="md" mb={4}>Applicants Without a Ranking</Heading>
                <Box borderWidth="1px" borderRadius="lg" p={5} bg={cardBg} borderColor={borderColor}>
                {insights.unrankedApplicants.length === 0 ? (
                    <Text>No unranked applicants found.</Text>
                ) : (
                    <Box overflowX="auto">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ textAlign: "left" }}>
                            <tr>
                                <th style={{ padding: "14px" }}><b>Avatar</b></th>
                                <th style={{ padding: "14px" }}><b>Name</b></th>
                                <th style={{ padding: "14px" }}><b>Position</b></th>
                                <th style={{ padding: "14px" }}><b>Availability</b></th>
                                <th style={{ padding: "14px" }}><b>Status</b></th>
                            </tr>
                            </thead>
                            <tbody>
                            {insights.unrankedApplicants.map((app) => (
                                <tr key={app.id}>
                                    <td style={{ padding: "12px" }}>
                                        <img
                                            src={app.user.avatar ?? "/placeholder-avatar.png"}
                                            alt={`${app.user.firstName} avatar`}
                                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                        />
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {app.user.firstName} {app.user.lastName}
                                    </td>
                                    <td style={{ padding: "12px" }}>{app.positionType}</td>
                                    <td style={{ padding: "12px" }}>{app.availability}</td>
                                    <td style={{ padding: "12px" }}>
                                        <span
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: "12px",
                                                color: "white",
                                                backgroundColor:
                                                    app.status === "accepted"
                                                        ? "#38A169"
                                                        : app.status === "pending"
                                                            ? "#D69E2E"
                                                            : "#E53E3E",
                                            }}
                                        >
                                          {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </Box>
                )}
            </Box>
            </Box>
        </CreamCard>
    );
};

export default VisualInsightsPage;
