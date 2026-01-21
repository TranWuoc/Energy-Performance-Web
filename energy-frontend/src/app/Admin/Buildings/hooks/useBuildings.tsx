import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    deleteBuidling,
    exportBuildingsExcel,
    getBuildings,
    getDetailBuilding,
} from '../../../../api/buildings/buildings.api';
import { toastError, toastSuccess } from '../../../../utils/toast';

export const BUILDINGS_QK = ['buildings'];
export const BUILDING_DETAIL_QK = (buildingId: string) => ['building', buildingId];
export const DELETE_BUILDING_QK = (buildingId: string) => ['delete-building', buildingId];

export function useBuildings() {
    return useQuery({
        queryKey: BUILDINGS_QK,
        queryFn: getBuildings,
        staleTime: 60_000,
    });
}
export function useBuildingDetail(buildingId?: string) {
    return useQuery({
        queryKey: buildingId ? BUILDING_DETAIL_QK(buildingId) : ['building', 'unknown'],
        queryFn: () => getDetailBuilding(buildingId as string),
        enabled: Boolean(buildingId),
        staleTime: 60_000,
    });
}

export function useDeleteBuilding() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (buildingId: string) => deleteBuidling(buildingId),
        onSuccess: () => {
            toastSuccess('Xoá toà nhà thành công');
            qc.invalidateQueries({ queryKey: ['buildings'] });
            qc.invalidateQueries({ queryKey: ['ep-list'] });
        },

        onError: () => {
            toastError('Xoá toà nhà thất bại');
        },
    });
}

export function useExportBuildings() {
    return useMutation({
        mutationFn: (buildingIds?: string[]) => exportBuildingsExcel(buildingIds),
    });
}
