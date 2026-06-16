import { store } from "@/app/store";
import { useAppSelector } from "@/hooks/store.hooks";

/**
 * Check if the current user has a specific permission (pure utility function).
 * Reads from Redux store state first, then falls back to localStorage.
 */
export const hasPermission = (permissionName: string): boolean => {
  try {
    const state = store.getState();
    const permissions = state.auth.permissions || [];
    
    // Fallback to localStorage if store is empty (e.g. during initialization or non-React contexts)
    const finalPermissions = permissions.length > 0 
      ? permissions 
      : JSON.parse(localStorage.getItem("user_permissions") || "[]");

    return finalPermissions.includes(permissionName);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

/**
 * Check if the current user has ANY of the specified permissions.
 */
export const hasAnyPermission = (permissionNames: string[]): boolean => {
  return permissionNames.some(name => hasPermission(name));
};

/**
 * Check if the current user has ALL of the specified permissions.
 */
export const hasAllPermissions = (permissionNames: string[]): boolean => {
  return permissionNames.every(name => hasPermission(name));
};

/**
 * React hook to check if the current user has a specific permission.
 * Automatically triggers re-renders when the permission state in Redux updates.
 */
export const useHasPermission = (permissionName: string): boolean => {
  const permissions = useAppSelector((state) => state.auth.permissions) || [];
  return permissions.includes(permissionName);
};

/**
 * React hook to check if the current user has ANY of the specified permissions.
 */
export const useHasAnyPermission = (permissionNames: string[]): boolean => {
  const permissions = useAppSelector((state) => state.auth.permissions) || [];
  return permissionNames.some(name => permissions.includes(name));
};
