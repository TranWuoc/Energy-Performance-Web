import type { EPListResponse } from '../../app/Admin/EnergyPerformance/Types/ep.type';
import http from '../../utils/http';

export const getAllEPBuilding = async () => {
    const response = await http.get<EPListResponse>('/energy-performances');
    return response.data;
};

export const getEPByBuildingId = async (buildingId: string) => {
    const response = await http.get<EPListResponse>(`/energy-performances/${buildingId}`);
    return response.data;
};
