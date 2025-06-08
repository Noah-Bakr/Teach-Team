export interface RawStatusBreakdown {
    status: string;
    count: string; // comes as string
}

export interface RawAverageRank {
    status: string;
    avgRank: string;
}

export interface RawSkillStat {
    skill_name: string;
    count: string;
}

export interface RawUserWithSkill {
    skill_name: string;
    user_id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
}

export interface RawApplicant {
    user_id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
    avgRank?: string;
    acceptedCount?: string;
}

export interface RawPositionBreakdown {
    position: string;
    count: string;
}

export interface RawUser {
    user_id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar?: string;
}

export interface RawUnrankedApplicant {
    application_id: number;
    position_type: string;
    status: string;
    applied_at: string;
    selected: boolean;
    availability: string;
    user: RawUser;
}

export interface RawVisualInsights {
    statusBreakdown: RawStatusBreakdown[];
    averageRankByStatus: RawAverageRank[];
    mostCommonSkills: RawSkillStat[];
    usersWithMostPopularSkills: {
        skill_name: string;
        user_id: number;
        userName: string;
        first_name: string;
        last_name: string;
        avatar?: string;
    }[];
    leastCommonSkills: RawSkillStat[];
    usersWithLeastCommonSkills: RawUserWithSkill[];
    mostAcceptedApplicant: RawApplicant | null;
    topApplicants: RawApplicant[];
    bottomApplicants: RawApplicant[];
    positionBreakdown: RawPositionBreakdown[];
    unrankedApplicants: RawUnrankedApplicant[];
}


