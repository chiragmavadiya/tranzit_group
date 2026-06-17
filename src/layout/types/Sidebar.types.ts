import type { ElementType } from 'react';

export interface SidebarSubItem {
  name: string;
  key?: string;
  path: string;
  icon?: ElementType;
  permissions?: string[];
}

export interface SidebarSubGroup {
  title: string;
  items: SidebarSubItem[];
}

export interface SidebarItem {
  name: string;
  key?: string;
  icon: ElementType;
  path: string;
  hasDropdown?: boolean;
  subItems?: SidebarSubItem[];
  subGroups?: SidebarSubGroup[];
  isExternal?: boolean;
  permissions?: string[];

}

