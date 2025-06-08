import { api } from "./api";
import { VisualInsightsUI } from "@/types/types"; // create this type
import { mapRawInsights } from "@/services/mappers/insightsMapper";

export async function fetchVisualInsights(): Promise<VisualInsightsUI> {
    const resp = await api.get("/applications/visual-insights");
    return mapRawInsights(resp.data);
}