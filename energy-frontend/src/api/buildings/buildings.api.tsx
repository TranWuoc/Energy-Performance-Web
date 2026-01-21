import type { BuildingFormValues } from '../../app/Usage/NewSurvey/type/type';
import http from '../../utils/http';
import type { Building, BuildingsResponse } from './building.type';

export const getBuildings = async () => {
    const response = await http.get<BuildingsResponse>('/buildings');
    return response.data;
};

export const getDetailBuilding = async (buildingId: string) => {
    const res = await http.get<Building>(`/buildings/${buildingId}`);
    return res.data;
};

export const createBuilding = async (data: BuildingFormValues) => {
    const response = await http.post<BuildingFormValues>('/buildings', data);
    const newBuilding = response.data;

    return {
        building: newBuilding,
        buildingId: newBuilding.buildingId,
    };
};

export const updateBuilding = async (params: { buildingId: string; data: BuildingFormValues }) => {
    const { buildingId, data } = params;

    const response = await http.put<BuildingFormValues>(`/buildings/${buildingId}`, data);

    const building = response.data;

    return {
        building,
        buildingId: building?.buildingId ?? buildingId,
    };
};

export const deleteBuidling = async (buildingId: string) => {
    const response = await http.delete(`/buildings/${buildingId}`);
    return response.data;
};

function getFilenameFromContentDisposition(contentDisposition?: string) {
    if (!contentDisposition) return null;
    // attachment; filename="buildings_export.xlsx"
    const match = /filename\*?=(?:UTF-8''|")?([^";\n]+)"?/i.exec(contentDisposition);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export const exportBuildingsExcel = async (buildingIds?: string[]) => {
    const params: any = {};
    if (buildingIds?.length) params.buildingIds = buildingIds.join(',');

    const res = await http.get('/buildings/export', {
        params,
        responseType: 'blob',
    });

    const filename =
        getFilenameFromContentDisposition(res.headers?.['content-disposition']) ??
        `buildings_export_${new Date().toISOString().slice(0, 10)}.xlsx`;

    downloadBlob(res.data as Blob, filename);

    return { filename };
};
