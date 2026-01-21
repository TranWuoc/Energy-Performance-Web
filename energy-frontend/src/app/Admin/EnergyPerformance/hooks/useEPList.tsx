import { useQuery } from '@tanstack/react-query';
import { getAllEPBuilding, getEPByBuildingId } from '../../../../api/EP/ep.api';

export const EP_LIST_QK = ['ep-list'];
export const EP_DETAIL_QK = (buildingId: string) => ['ep-detail', buildingId];

export function useEPList() {
    return useQuery({
        queryKey: EP_LIST_QK,
        queryFn: () => getAllEPBuilding(),
        staleTime: 60_000,
    });
}

export function useEPDetail(buildingId?: string) {
    return useQuery({
        queryKey: buildingId ? EP_DETAIL_QK(buildingId) : ['ep-detail', 'unknown'],
        queryFn: () => getEPByBuildingId(buildingId as string),
        enabled: Boolean(buildingId),
        staleTime: 60_000,
    });
}
