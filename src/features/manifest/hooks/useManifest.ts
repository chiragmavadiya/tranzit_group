import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { manifestService } from "../services/manifest.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { ManifestFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";
import { downloadFile } from "@/lib/utils";

export const useManifests = (filters: ManifestFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MANIFEST.LIST, filters],
    queryFn: () => manifestService.getManifests(filters),
    placeholderData: keepPreviousData,
  });
};

export function useExportManifests() {
  return useMutation({
    mutationFn: (params: { format: string; search?: string }) =>
      manifestService.export(params),
    onSuccess: ({ blob, filename }) => {
      downloadFile(blob, filename);
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to export manifests", "error");
    },
  });
}

export function useDownloadManifestPDF() {
  return useMutation({
    mutationFn: (id: string | number) => manifestService.downloadPDF(id),
    onSuccess: ({ blob, filename }) => {
      downloadFile(blob, filename);
      showToast("Manifest downloaded successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to download manifest PDF", "error");
    },
  });
}
