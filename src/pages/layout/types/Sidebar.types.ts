import type { ElementType } from 'react';

export interface SidebarSubItem {
  name: string;
  path: string;
}

export interface SidebarSubGroup {
  title: string;
  items: SidebarSubItem[];
}

export interface SidebarItem {
  name: string;
  icon: ElementType;
  path: string;
  hasDropdown?: boolean;
  subItems?: SidebarSubItem[];
  subGroups?: SidebarSubGroup[];
}
