import { VisualInsightsUI } from "@/types/types";

export function mapRawInsights(raw: any): VisualInsightsUI {
    return {
        statusBreakdown: raw.statusBreakdown.map((s: any) => ({
            status: s.status,
            count: Number(s.count),
        })),
        averageRankByStatus: raw.averageRankByStatus.map((s: any) => ({
            status: s.status,
            avgRank: parseFloat(s.avgRank),
        })),
        mostCommonSkills: raw.mostCommonSkills.map((s: any) => ({
            skill_name: s.skill_name,
            count: Number(s.count),
        })),
        usersWithMostPopularSkills: raw.usersWithMostPopularSkills.map((u: any) => ({
            skill_name: u.skill_name,
            user_id: u.user_id,
            first_name: u.first_name,
            last_name: u.last_name,
            avatar: u.avatar,
        })),
        leastCommonSkills: raw.leastCommonSkills.map((s: any) => ({
            skill_name: s.skill_name,
            count: Number(s.count),
        })),
        usersWithLeastCommonSkills: raw.usersWithLeastCommonSkills.map((u: any) => ({
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
            }
            : null,
        topApplicants: raw.topApplicants.map((a: any) => ({
            ...a,
            avgRank: parseFloat(a.avgRank),
        })),
        bottomApplicants: raw.bottomApplicants.map((a: any) => ({
            ...a,
            avgRank: parseFloat(a.avgRank),
        })),
        positionBreakdown: raw.positionBreakdown.map((p: any) => ({
            position: p.position,
            count: Number(p.count),
        })),
        unrankedApplicants: raw.unrankedApplicants,
    };
}
