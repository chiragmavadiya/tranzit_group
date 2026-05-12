import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { reportsService } from "../services/reports.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import type { ReportFilters } from "../types";
import { showToast } from "@/components/ui/custom-toast";

export const useShipmentReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS.SHIPMENT, filters],
    queryFn: () => reportsService.getShipmentReport(filters),
    placeholderData: keepPreviousData,
  });
};

export const useExportShipmentReport = () => {
  return useMutation({
    mutationFn: (filters: ReportFilters & { format: string }) =>
      reportsService.exportShipmentReport(filters),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to export shipment report", "error");
    },
  });
};

export const useTransactionReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS.TRANSACTION, filters],
    queryFn: () => reportsService.getTransactionReport(filters),
    placeholderData: keepPreviousData,
  });
};

export const useExportTransactionReport = () => {
  return useMutation({
    mutationFn: (filters: ReportFilters & { format: string }) =>
      reportsService.exportTransactionReport(filters),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to export transaction report", "error");
    },
  });
};

export const useInvoiceReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS.INVOICE, filters],
    queryFn: () => reportsService.getInvoiceReport(filters),
    placeholderData: keepPreviousData,
  });
};

// Assuming export for invoice is not available based on prompt endpoints, skipping useExportInvoiceReport

export const useParcelReport = (filters: ReportFilters, isAdmin: boolean = false) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS.PARCELS, filters, isAdmin],
    queryFn: () => reportsService.getParcelReport(filters, isAdmin),
    placeholderData: keepPreviousData,
  });
};

export const useExportParcelReport = (isAdmin: boolean = false) => {
  return useMutation({
    mutationFn: (filters: ReportFilters & { format: string }) =>
      reportsService.exportParcelReport(filters, isAdmin),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "Failed to export parcel report", "error");
    },
  });
};

export const useUploadDirectFreightInvoice = () => {
  return useMutation({
    mutationFn: (file: File) => reportsService.uploadDirectFreightInvoice(file),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Direct Freight invoice uploaded successfully", "success");
      } else {
        showToast(response.message || "Failed to upload Direct Freight invoice", "error");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "An error occurred during upload", "error");
    },
  });
};

export const useUploadAusPostInvoice = () => {
  return useMutation({
    mutationFn: (file: File) => reportsService.uploadAusPostInvoice(file),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "AusPost invoice uploaded successfully", "success");
      } else {
        showToast(response.message || "Failed to upload AusPost invoice", "error");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "An error occurred during upload", "error");
    },
  });
};
