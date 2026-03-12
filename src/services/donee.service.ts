import { ApiResponse, PointOfInterest } from "../types";
import api from "./api.service";

export const getData = async (
  data: PointOfInterest,
): Promise<ApiResponse<PointOfInterest>> => {
  try {
    const response = await api.get("/", {
      params: {
        q: data.name,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return {
      success: false,
    };
  }
};
