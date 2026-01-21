import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBuilding, getDetailBuilding, updateBuilding } from '../../../api/buildings/buildings.api';
import type { BuildingFormValues } from '../../Usage/NewSurvey/type/type';

export const BUILDING_QK = {
    list: ['buildings'] as const,
    detail: (buildingId: string) => ['building-detail', buildingId] as const,
};

/**
 * Create
 */
export const useCreateBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBuilding,
        onSuccess: () => {
            // nếu bạn có trang list thì invalidate để refresh
            queryClient.invalidateQueries({ queryKey: BUILDING_QK.list });
        },
    });
};

export const useBuildingDetail = (buildingId: string, enabled = true) => {
    return useQuery({
        queryKey: BUILDING_QK.detail(buildingId),
        queryFn: () => getDetailBuilding(buildingId),
        enabled: Boolean(buildingId) && enabled,
        staleTime: 30 * 1000,
    });
};

export const useUpdateBuilding = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { buildingId: string; data: BuildingFormValues }) => updateBuilding(params),
        onSuccess: (res) => {
            const id = res?.buildingId;

            if (id) queryClient.invalidateQueries({ queryKey: BUILDING_QK.detail(id) });
            queryClient.invalidateQueries({ queryKey: BUILDING_QK.list });
        },
    });
};
