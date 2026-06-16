import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { ManifestFilters, ManifestResponse } from "../types";
import { getFileName } from "@/lib/utils";

export const manifestService = {
  getManifests: async (params: ManifestFilters): Promise<ManifestResponse> => {
    const response = await api.get<ManifestResponse>(API_ENDPOINTS.MANIFEST.LIST, { params });
    return response.data;
  },
  export: async (params: { format: string; search?: string }): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(API_ENDPOINTS.MANIFEST.EXPORT, {
      params,
      responseType: "blob",
    });
    const format = params.format === "pdf" ? "pdf" : params.format === "csv" ? "csv" : "xls";
    const filename = getFileName(response) || `manifests_${new Date().getTime()}.${format}`;

    return { blob: response.data, filename };
  },
  downloadPDF: async (url: string): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(url.replace('https://api.tranzit.digisite.net/api', ''), {
      responseType: "blob",
    });
    const filename = getFileName(response) || `manifests_${new Date().getTime()}.pdf`;
    return { blob: response.data, filename };
  },
};
