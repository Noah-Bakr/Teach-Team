import { ApplicationRanking as RawRanking } from "../api/rankingApi";
import { RankingUI } from "../../types/rankTypes";

/**
 * Convert the raw backend Ranking shape → our frontend RankingUI.
 */
export function mapRawRankingToUI(raw: RawRanking): RankingUI {
    // If the server did not include a “lecturer” object, default to empty string
    const lecturerName = raw.lecturer
        ? `${raw.lecturer.first_name} ${raw.lecturer.last_name}`
        : "";

    return {
        id: raw.ranking_id,
        ranking: raw.rank,
        createdAt: raw.reviewed_at, 
        updatedAt: raw.updated_at,
        lecturerName,
    };
}
