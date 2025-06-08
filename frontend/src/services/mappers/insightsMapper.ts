import { VisualInsightsUI } from "@/types/types";
import { RawVisualInsights } from "../api/visualInsightApi";

export type CoursePlaceholder = {
    id: number;
    name: string;
    code: string;
    semester: '1' | '2';
};

// Create an actual object/value with the same name
export const CoursePlaceholder: CoursePlaceholder = {
    id: 0,
    name: "Placeholder Course",
    code: "COSC",
    semester: '1',
};

export function mapRawInsights(raw: RawVisualInsights): VisualInsightsUI {
    return {
        statusBreakdown: raw.statusBreakdown.map((s) => ({
            status: s.status,
            count: Number(s.count),
        })),
        averageRankByStatus: raw.averageRankByStatus.map((s) => ({
            status: s.status,
            avgRank: parseFloat(s.avgRank),
        })),
        mostCommonSkills: raw.mostCommonSkills.map((s) => ({
            skill_name: s.skill_name,
            count: Number(s.count),
        })),
        usersWithMostPopularSkills: raw.usersWithMostPopularSkills.map((u) => ({
            skill_name: u.skill_name,
            user_id: u.user_id,
            first_name: u.first_name,
            last_name: u.last_name,
            avatar: u.avatar,
        })),
        leastCommonSkills: raw.leastCommonSkills.map((s) => ({
            skill_name: s.skill_name,
            count: Number(s.count),
        })),
        usersWithLeastCommonSkills: raw.usersWithLeastCommonSkills.map((u) => ({
            skill_name: u.skill_name,
            user_id: u.user_id,
            first_name: u.first_name,
            last_name: u.last_name,
            avatar: u.avatar,
        })),
        mostAcceptedApplicant: raw.mostAcceptedApplicant
            ? {
                ...raw.mostAcceptedApplicant,
                acceptedCount: Number(raw.mostAcceptedApplicant.acceptedCount),
                avgRank: raw.mostAcceptedApplicant.avgRank
                    ? parseFloat(raw.mostAcceptedApplicant.avgRank)
                    : undefined,
            }
            : null,
        topApplicants: raw.topApplicants.map((a) => ({
            ...a,
            avgRank: parseFloat(a.avgRank ?? "0"),
        })),
        bottomApplicants: raw.bottomApplicants.map((a) => ({
            ...a,
            avgRank: parseFloat(a.avgRank ?? "0"),
        })),
        positionBreakdown: raw.positionBreakdown.map((p) => ({
            position: p.position,
            count: Number(p.count),
        })),
        unrankedApplicants: raw.unrankedApplicants.map((app) => ({
            id: app.application_id,
            positionType: app.position_type as "tutor" | "lab_assistant",
            status: app.status as "pending" | "accepted" | "rejected",
            appliedAt: app.applied_at,
            selected: app.selected,
            availability: app.availability as "Full-Time" | "Part-Time" | "Not Available",
            user: {
                id: app.user.user_id,
                username: app.user.username,
                email: app.user.email,
                firstName: app.user.first_name,
                lastName: app.user.last_name,
                avatar: app.user.avatar ?? null,
            },
            course: CoursePlaceholder,
        })),
    };
}

// import { VisualInsightsUI } from "@/types/types";
// import { RawVisualInsights } from "../api/visualInsightApi";
//
//
// export function mapRawInsights(raw: RawVisualInsights): VisualInsightsUI {
//     statusBreakdown: { status: string; count: number }[];
//     averageRankByStatus: { status: string; avgRank: number }[];
//     mostCommonSkills: { skill_name: string; count: number }[];
//     usersWithMostPopularSkills: {
//         skill_name: string;
//         user_id: number;
//         first_name: string;
//         last_name: string;
//         avatar: string | undefined
//     }[];
//     leastCommonSkills: { skill_name: string; count: number }[];
//     usersWithLeastCommonSkills: {
//         skill_name: string;
//         user_id: number;
//         first_name: string;
//         last_name: string;
//         avatar: string | undefined
//     }[];
//     mostAcceptedApplicant: {
//         user_id: number;
//         first_name: string;
//         last_name: string;
//         avatar?: string;
//         avgRank: number | undefined;
//         acceptedCount: number
//     } | null;
//     topApplicants: {
//         user_id: number;
//         first_name: string;
//         last_name: string;
//         avatar?: string;
//         avgRank: number;
//         acceptedCount?: string
//     }[];
//     bottomApplicants: {
//         user_id: number;
//         first_name: string;
//         last_name: string;
//         avatar?: string;
//         avgRank: number;
//         acceptedCount?: string
//     }[];
//     positionBreakdown: { position: string; count: number }[];
//     unrankedApplicants: {
//         id: number;
//         positionType: "tutor" | "lab_assistant";
//         status: "pending" | "accepted" | "rejected";
//         appliedAt: string;
//         selected: boolean;
//         availability: "Full-Time" | "Part-Time" | "Not Available";
//         user: {
//             id: number;
//             username: string;
//             email: string;
//             first_name: string;
//             last_name: string;
//             avatar: string | undefined
//         };
//         course: undefined
//     }[]
// } {
//     return {
//         statusBreakdown: raw.statusBreakdown.map((s) => ({
//             status: s.status,
//             count: Number(s.count),
//         })),
//         averageRankByStatus: raw.averageRankByStatus.map((s) => ({
//             status: s.status,
//             avgRank: parseFloat(s.avgRank),
//         })),
//         mostCommonSkills: raw.mostCommonSkills.map((s) => ({
//             skill_name: s.skill_name,
//             count: Number(s.count),
//         })),
//         usersWithMostPopularSkills: raw.usersWithMostPopularSkills.map((u) => ({
//             skill_name: u.skill_name,
//             user_id: u.user_id,
//             first_name: u.first_name,
//             last_name: u.last_name,
//             avatar: u.avatar,
//         })),
//         leastCommonSkills: raw.leastCommonSkills.map((s) => ({
//             skill_name: s.skill_name,
//             count: Number(s.count),
//         })),
//         usersWithLeastCommonSkills: raw.usersWithLeastCommonSkills.map((u) => ({
//             skill_name: u.skill_name,
//             user_id: u.user_id,
//             first_name: u.first_name,
//             last_name: u.last_name,
//             avatar: u.avatar,
//         })),
//         mostAcceptedApplicant: raw.mostAcceptedApplicant
//             ? {
//                 ...raw.mostAcceptedApplicant,
//                 acceptedCount: Number(raw.mostAcceptedApplicant.acceptedCount),
//                 avgRank: raw.mostAcceptedApplicant.avgRank
//                     ? parseFloat(raw.mostAcceptedApplicant.avgRank)
//                     : undefined,
//             }
//             : null,
//         topApplicants: raw.topApplicants.map((a) => ({
//             ...a,
//             avgRank: parseFloat(a.avgRank ?? "0"),
//         })),
//         bottomApplicants: raw.bottomApplicants.map((a) => ({
//             ...a,
//             avgRank: parseFloat(a.avgRank ?? "0"),
//         })),
//         positionBreakdown: raw.positionBreakdown.map((p) => ({
//             position: p.position,
//             count: Number(p.count),
//         })),
//         unrankedApplicants: raw.unrankedApplicants.map((app) => ({
//             id: app.application_id,
//             positionType: app.position_type as "tutor" | "lab_assistant",
//             status: app.status as "pending" | "accepted" | "rejected",
//             appliedAt: app.applied_at,
//             selected: app.selected,
//             availability: app.availability as "Full-Time" | "Part-Time" | "Not Available",
//             user: {
//                 id: app.user.user_id,
//                 username: app.user.username,
//                 email: app.user.email,
//                 first_name: app.user.first_name,
//                 last_name: app.user.last_name,
//                 avatar: app.user.avatar,
//             },
//             course: undefined,
//         })),
//     };
// }
