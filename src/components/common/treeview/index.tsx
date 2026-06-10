import { useState, useEffect, useMemo, memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FolderOpen, Search } from "lucide-react";
import { FormInput } from "@/features/orders/components/OrderFormUI";

type TreeNode = {
    name: string;
    label: string;
    checked?: boolean;
    permissions?: TreeNode[];
};

// const permissionsData: TreeNode[] = [
//     {
//         name: "dashboard",
//         label: "Dashboard",
//         checked: false,
//         children: [
//             {
//                 name: "view-dashboard",
//                 label: "View Dashboard",
//                 checked: false,
//                 children: [
//                     {
//                         name: "dashboard.statistics",
//                         label: "Statistics",
//                         checked: false,
//                     },
//                     {
//                         name: "margin-count",
//                         label: "Margin Count",
//                         checked: false,
//                     },
//                     {
//                         name: "orders-count",
//                         label: "Orders Count",
//                         checked: false,
//                     },
//                     {
//                         name: "paid-invoices-count",
//                         label: "Paid Invoices Count",
//                         checked: false,
//                     },
//                     {
//                         name: "unpaid-invoices-count",
//                         label: "Unpaid Invoices Count",
//                         checked: false,
//                     },
//                     {
//                         name: "invoices-count",
//                         label: "Invoices Count",
//                         checked: false,
//                     },
//                     {
//                         name: "topup-count",
//                         label: "Topup Count",
//                         checked: false,
//                     },
//                     {
//                         name: "transactions-table",
//                         label: "Transactions Table",
//                         checked: false,
//                     },
//                     {
//                         name: "pending-invoices-table",
//                         label: "Pending Invoices Table",
//                         checked: false,
//                     },
//                 ],
//             },
//         ],
//     },

//     // {
//     //     id: "customer",
//     //     name: "Customer",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-customer",
//     //             name: "View Customer",
//     //             checked: false,
//     //             children: [
//     //                 {
//     //                     id: "view-customer-statistics",
//     //                     name: "View Customer Statistics",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "view-customer-profile-tab",
//     //                     name: "View Customer Profile Tab",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "view-customer-orders-tab",
//     //                     name: "View Customer Orders Tab",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "view-customer-integration-tab",
//     //                     name: "View Customer Integration Tab",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "view-customer-transaction-tab",
//     //                     name: "View Customer Transaction Tab",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "view-customer-credit-application",
//     //                     name: "View Customer Credit Application",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "view-customer-invoice-tab",
//     //                     name: "View Customer Invoice Tab",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "can-verify-customer-account",
//     //                     name: "Can Verify Customer Account",
//     //                     checked: false,
//     //                 },
//     //             ],
//     //         },

//     //         {
//     //             id: "add-customer",
//     //             name: "Add Customer",
//     //             checked: false,
//     //         },

//     //         {
//     //             id: "edit-customer",
//     //             name: "Edit Customer",
//     //             checked: false,
//     //         },

//     //         {
//     //             id: "delete-customer",
//     //             name: "Delete Customer",
//     //             checked: false,
//     //         },

//     //         {
//     //             id: "active-customer",
//     //             name: "Active Customer",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "order",
//     //     name: "Order",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-order",
//     //             name: "View Order",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-order",
//     //             name: "Add Order",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-order",
//     //             name: "Edit Order",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-order",
//     //             name: "Delete Order",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "active-order",
//     //             name: "Active Order",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "view-cancel-order",
//     //             name: "View Cancel Order",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "subuser",
//     //     name: "Subuser",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-subuser",
//     //             name: "View Subuser",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-subuser",
//     //             name: "Add Subuser",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-subuser",
//     //             name: "Edit Subuser",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-subuser",
//     //             name: "Delete Subuser",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "active-subuser",
//     //             name: "Active Subuser",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "invoice",
//     //     name: "Invoice",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-invoice",
//     //             name: "View Invoice",
//     //             checked: false,
//     //             children: [
//     //                 {
//     //                     id: "can-send-invoice",
//     //                     name: "Can Send Invoice",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "can-download-invoice",
//     //                     name: "Can Download Invoice",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "can-print-invoice",
//     //                     name: "Can Print Invoice",
//     //                     checked: false,
//     //                 },
//     //                 {
//     //                     id: "can-add-payment",
//     //                     name: "Can Add Payment",
//     //                     checked: false,
//     //                 },
//     //             ],
//     //         },

//     //         {
//     //             id: "add-invoice",
//     //             name: "Add Invoice",
//     //             checked: false,
//     //         },

//     //         {
//     //             id: "edit-invoice",
//     //             name: "Edit Invoice",
//     //             checked: false,
//     //         },

//     //         {
//     //             id: "delete-invoice",
//     //             name: "Delete Invoice",
//     //             checked: false,
//     //         },

//     //         {
//     //             id: "active-invoice",
//     //             name: "Active Invoice",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "topup",
//     //     name: "Topup",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-topup",
//     //             name: "View Topup",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-topup",
//     //             name: "Add Topup",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-topup",
//     //             name: "Edit Topup",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-topup",
//     //             name: "Delete Topup",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "active-topup",
//     //             name: "Active Topup",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "profile",
//     //     name: "Profile",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-profile",
//     //             name: "View Profile",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-profile",
//     //             name: "Add Profile",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-profile",
//     //             name: "Edit Profile",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-profile",
//     //             name: "Delete Profile",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "active-profile",
//     //             name: "Active Profile",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "setting",
//     //     name: "Setting",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-setting",
//     //             name: "View Setting",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-setting",
//     //             name: "Edit Setting",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "book-a-pickup",
//     //     name: "Book a Pickup",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-book-pickup",
//     //             name: "View Book Pickup",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "book-with-direct-freight",
//     //             name: "Book With Direct Freight",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "credit-application",
//     //     name: "Credit Application",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-credit-application",
//     //             name: "View Credit Application",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-status",
//     //             name: "Edit Status",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "courier-surcharge",
//     //     name: "Courier Surcharge",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-surcharge",
//     //             name: "View Surcharge",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-surcharge",
//     //             name: "Add Surcharge",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-surcharge",
//     //             name: "Edit Surcharge",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-surcharge",
//     //             name: "Delete Surcharge",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "courier-base-postcode",
//     //     name: "Courier Base Postcode",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-courier-base-postcode",
//     //             name: "View Courier Base Postcode",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-courier-base-postcode",
//     //             name: "Add Courier Base Postcode",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-courier-base-postcode",
//     //             name: "Edit Courier Base Postcode",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-courier-base-postcode",
//     //             name: "Delete Courier Base Postcode",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "enquiry-management",
//     //     name: "Enquiry Management",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-enquiry-management",
//     //             name: "View Enquiry Management",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "admin-activity-log",
//     //     name: "Admin Activity Log",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-activity",
//     //             name: "View Activity",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "auspost-order-summary",
//     //     name: "AusPost Order Summary",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-auspost-summary",
//     //             name: "View Auspost Summary",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "un-delivered-parcel",
//     //     name: "Un-Delivered Parcel",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-undelivered-parcel",
//     //             name: "View Undelivered Parcel",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "customer-quote",
//     //     name: "Customer Quote",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-customer-quote",
//     //             name: "View Customer Quote",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "view-customer-quote-history",
//     //             name: "View Customer Quote History",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "customer-parcel-report",
//     //     name: "Customer Parcel Report",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-customer-parcel-report",
//     //             name: "View Customer Parcel Report",
//     //             checked: false,
//     //         },
//     //     ],
//     // },

//     // {
//     //     id: "help-center",
//     //     name: "Help Center",
//     //     checked: false,
//     //     children: [
//     //         {
//     //             id: "view-help-center",
//     //             name: "View Help Center",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "add-help-center",
//     //             name: "Add Help Center",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "edit-help-center",
//     //             name: "Edit Help Center",
//     //             checked: false,
//     //         },
//     //         {
//     //             id: "delete-help-center",
//     //             name: "Delete Help Center",
//     //             checked: false,
//     //         },
//     //     ],
//     // }
// ];

const PermissionTreeView = ({
    title = "Permissions",
    initialSelected = [],
    onChange,
    permissionsData,
}: {
    title?: string;
    initialSelected?: string[];
    onChange?: (selectedIds: string[]) => void;
    permissionsData: TreeNode[];
}) => {

    console.log(initialSelected, 'initialSelected')
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const totalNodesCount = useMemo(() => {
        const countNodes = (nodes: TreeNode[]): number => {
            return nodes.reduce(
                (acc, node) =>
                    acc + 1 + (node.permissions ? countNodes(node.permissions) : 0),
                0
            );
        };
        return countNodes(permissionsData);
    }, [permissionsData]);

    const selectedIds = useMemo(() => getAllCheckedIds(treeData), [treeData]);
    const isAllSelected = selectedIds.length === totalNodesCount;

    useEffect(() => {
        if (onChange) {
            onChange(selectedIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [treeData,]);


    useEffect(() => {
        if (permissionsData.length > 0) {
            setTreeData(() =>
                initialSelected.length > 0
                    ? initializeTree(permissionsData, initialSelected)
                    : permissionsData
            )
        }
    }, [initialSelected, permissionsData]);



    const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
        if (!query) return nodes;
        const lowerQuery = query.toLowerCase();

        return nodes
            .map((node) => {
                const isMatch = node.name.toLowerCase().includes(lowerQuery);
                const filteredChildren = node.permissions
                    ? filterTree(node.permissions, query)
                    : undefined;
                const hasMatchingChildren =
                    filteredChildren && filteredChildren.length > 0;

                if (isMatch || hasMatchingChildren) {
                    return {
                        ...node,
                        children: filteredChildren,
                    } as TreeNode;
                }
                return null;
            })
            .filter((node): node is TreeNode => node !== null);
    };

    const filteredTreeData = filterTree(treeData, searchQuery);

    const updateNode = (
        nodes: TreeNode[],
        name: string,
        checked: boolean
    ): TreeNode[] => {
        return nodes.map((node) => {
            if (node.name === name) {
                return {
                    ...node,
                    checked,
                    children: node.permissions
                        ? updateAllChildren(node.permissions, checked)
                        : undefined,
                };
            }

            return {
                ...node,
                children: node.permissions
                    ? updateNode(node.permissions, name, checked)
                    : undefined,
            };
        });
    };

    const updateAllChildren = (
        nodes: TreeNode[],
        checked: boolean
    ): TreeNode[] => {
        return nodes.map((node) => ({
            ...node,
            checked,
            children: node.permissions
                ? updateAllChildren(node.permissions, checked)
                : undefined,
        }));
    };

    const handleCheck = (name: string, checked: boolean) => {
        setTreeData((prev) => updateNode(prev, name, checked));
    };

    return (
        <>
            {/* // <Card className="p-6 rounded-2xl shadow-md flex flex-col h-full"> */}
            <div className="flex flex-col gap-1 pb-4 sticky top-0 bg-white dark:bg-zinc-950 z-10 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                            {title}
                        </h2>

                    </div>
                    <div className="flex items-center gap-2  px-3 py-1.5">
                        <Checkbox
                            id="select-all"
                            checked={isAllSelected}
                            // indeterminate={selectAllState}
                            onCheckedChange={(checked) =>
                                setTreeData(
                                    updateAllNodes(treeData, Boolean(checked))
                                )
                            }
                        />
                        <label
                            htmlFor="select-all"
                            className="text-xs font-bold text-slate-700 dark:text-zinc-400 cursor-pointer"
                        >
                            Select All
                        </label>
                    </div>
                </div>
                <div className="relative w-full">
                    <FormInput
                        placeholder="Search permissions..."
                        icon={Search}
                        className="h-9"
                        value={searchQuery}
                        onChange={(val) => setSearchQuery(val)}
                    />
                </div>
            </div>

            <div className="space-y-2 pr-2">
                {filteredTreeData.length > 0 ? (
                    filteredTreeData.map((node) => (
                        <TreeItem
                            key={node.name}
                            node={node}
                            level={0}
                            onCheck={handleCheck}
                            searchQuery={searchQuery}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        No permissions found matching "{searchQuery}"
                    </div>
                )}
            </div>
            {/* // </Card> */}
        </>
    );
}

// Helper functions for tree manipulation
const updateAllNodes = (nodes: TreeNode[], checked: boolean): TreeNode[] => {
    return nodes.map((node) => ({
        ...node,
        checked,
        children: node.permissions
            ? updateAllNodes(node.permissions, checked)
            : undefined,
    }));
};

const getAllCheckedIds = (nodes: TreeNode[]): string[] => {
    let ids: string[] = [];
    nodes.forEach((node) => {
        if (node.checked) ids.push(node.name);
        if (node.permissions) ids = ids.concat(getAllCheckedIds(node.permissions));
    });
    return ids;
};

const initializeTree = (
    nodes: TreeNode[],
    selectedIds: string[]
): TreeNode[] => {
    return nodes.map((node) => ({
        ...node,
        checked: selectedIds.includes(node.name),
        children: node.permissions
            ? initializeTree(node.permissions, selectedIds)
            : undefined,
    }));
};

type TreeItemProps = {
    node: TreeNode;
    level: number;
    onCheck: (id: string, checked: boolean) => void;
    isLast?: boolean;
    searchQuery?: string;
};

function TreeItem({
    node,
    level,
    onCheck,
    isLast = false,
    searchQuery = "",
}: TreeItemProps) {
    const shouldDefaultOpen = useMemo(() => {
        const hasCheckedChild = (n: TreeNode): boolean => {
            if (!n.permissions?.length) return false;
            return n.permissions.some(child => child.checked || hasCheckedChild(child));
        };
        return node.checked || hasCheckedChild(node);
    }, [node]);

    const [isOpen, setIsOpen] = useState(shouldDefaultOpen);

    useEffect(() => {
        if (shouldDefaultOpen) {
            setIsOpen(true);
        }
    }, [shouldDefaultOpen]);

    const hasChildren = !!node.permissions?.length;
    // Submenu is shown if manual toggle is open, or if we are actively searching
    const isExpanded = isOpen || !!searchQuery;

    return (
        <div className="relative">
            {/* Tree Lines */}
            {level > 0 && (
                <>
                    {/* Vertical line top to middle */}
                    <div className="absolute -left-[14px] top-0 w-px h-[20px] bg-border" />
                    {/* Vertical line middle to bottom (if not last) */}
                    {!isLast && (
                        <div className="absolute -left-[14px] top-[20px] bottom-0 w-px bg-border" />
                    )}
                    {/* Horizontal line middle to item */}
                    <div className="absolute -left-[14px] top-[20px] w-[14px] h-px bg-border" />
                </>
            )}

            <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition group">
                <div
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                    onClick={() => onCheck(node.name, !node.checked)}
                >
                    {hasChildren ? (
                        <div
                            className="w-5 h-5 flex items-center justify-center shrink-0 cursor-pointer hover:bg-accent/50 rounded transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                        >
                            {isExpanded ? (
                                <FolderOpen className="w-4 h-4 text-primary fill-primary/20" />
                            ) : (
                                <Folder className="w-4 h-4 text-primary fill-primary/20" />
                            )}
                        </div>
                    ) : (
                        <div className="w-5! h-5! flex items-center justify-center shrink-0">
                            <div className="w-1.5! h-1.5! rounded-full bg-muted-foreground/50" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-zinc-100 transition-colors">
                        {node.label}
                    </span>
                </div>

                {/* RIGHT SIDE CHECKBOX */}
                <Checkbox
                    checked={node.checked}
                    onCheckedChange={(value) =>
                        onCheck(node.name, Boolean(value))
                    }
                />
            </div>

            {/* CHILDREN */}
            {hasChildren && isExpanded && (
                <div className="relative ml-[22px] pl-[2px]">
                    {node.permissions?.map((child, index) => (
                        <TreeItem
                            key={child.name}
                            node={child}
                            level={level + 1}
                            onCheck={onCheck}
                            isLast={index === node.permissions!.length - 1}
                            searchQuery={searchQuery}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const MemoizedTreeView = memo(PermissionTreeView);
export default MemoizedTreeView;
