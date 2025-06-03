import axios from "axios";
import { RankingUI } from "@/types/rankTypes";
import { mapRawRankingToUI } from "./mappers/rankingMapping";
import {
    CreateRankingDto,
    UpdateRankingDto,
    ApplicationRanking as RawRanking,
} from "./api/rankingApi";

const API_BASE = "http://localhost:3001/api";

export async function fetchAllRankings(): Promise<RankingUI[]> {
    const resp = await axios.get<RawRanking[]>(`${API_BASE}/application-rankings`);
    return resp.data.map(mapRawRankingToUI);
}

export async function fetchRankingById(id: number): Promise<RankingUI> {
    const resp = await axios.get<RawRanking>(`${API_BASE}/application-rankings/${id}`);
    return mapRawRankingToUI(resp.data);
}

export async function createRanking(
    payload: CreateRankingDto
): Promise<RankingUI> {
    const resp = await axios.post<RawRanking>(`${API_BASE}/application-rankings`, payload);
    return mapRawRankingToUI(resp.data);
}

export async function updateRanking(
    id: number,
    payload: UpdateRankingDto
): Promise<RankingUI> {
    const resp = await axios.put<RawRanking>(`${API_BASE}/application-rankings/${id}`, payload);
    return mapRawRankingToUI(resp.data);
}

export async function deleteRanking(id: number): Promise<{ message: string }> {
    const resp = await axios.delete<{ message: string }>(`${API_BASE}/application-rankings/${id}`);
    return resp.data;
}
