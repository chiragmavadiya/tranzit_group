import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FolderOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TreeNode = {
    id: string;
    name: string;
    checked?: boolean;
    children?: TreeNode[];
};

const permissionsData: TreeNode[] = [
    {
        id: "dashboard",
        name: "Dashboard",
        checked: false,
        children: [
            {
                id: "view-dashboard",
                name: "View Dashboard",
                checked: false,
                children: [
                    {
                        id: "statistics",
                        name: "Statistics",
                        checked: false,
                    },
                    {
                        id: "margin-count",
                        name: "Margin Count",
                        checked: false,
                    },
                    {
                        id: "orders-count",
                        name: "Orders Count",
                        checked: false,
                    },
                    {
                        id: "paid-invoices-count",
                        name: "Paid Invoices Count",
                        checked: false,
                    },
                    {
                        id: "unpaid-invoices-count",
                        name: "Unpaid Invoices Count",
                        checked: false,
                    },
                    {
                        id: "invoices-count",
                        name: "Invoices Count",
                        checked: false,
                    },
                    {
                        id: "topup-count",
                        name: "Topup Count",
                        checked: false,
                    },
                    {
                        id: "transactions-table",
                        name: "Transactions Table",
                        checked: false,
                    },
                    {
                        id: "pending-invoices-table",
                        name: "Pending Invoices Table",
                        checked: false,
                    },
                ],
            },
        ],
    },

    {
        id: "customer",
        name: "Customer",
        checked: false,
        children: [
            {
                id: "view-customer",
                name: "View Customer",
                checked: false,
                children: [
                    {
                        id: "view-customer-statistics",
                        name: "View Customer Statistics",
                        checked: false,
                    },
                    {
                        id: "view-customer-profile-tab",
                        name: "View Customer Profile Tab",
                        checked: false,
                    },
                    {
                        id: "view-customer-orders-tab",
                        name: "View Customer Orders Tab",
                        checked: false,
                    },
                    {
                        id: "view-customer-integration-tab",
                        name: "View Customer Integration Tab",
                        checked: false,
                    },
                    {
                        id: "view-customer-transaction-tab",
                        name: "View Customer Transaction Tab",
                        checked: false,
                    },
                    {
                        id: "view-customer-credit-application",
                        name: "View Customer Credit Application",
                        checked: false,
                    },
                    {
                        id: "view-customer-invoice-tab",
                        name: "View Customer Invoice Tab",
                        checked: false,
                    },
                    {
                        id: "can-verify-customer-account",
                        name: "Can Verify Customer Account",
                        checked: false,
                    },
                ],
            },

            {
                id: "add-customer",
                name: "Add Customer",
                checked: false,
            },

            {
                id: "edit-customer",
                name: "Edit Customer",
                checked: false,
            },

            {
                id: "delete-customer",
                name: "Delete Customer",
                checked: false,
            },

            {
                id: "active-customer",
                name: "Active Customer",
                checked: false,
            },
        ],
    },

    {
        id: "order",
        name: "Order",
        checked: false,
        children: [
            {
                id: "view-order",
                name: "View Order",
                checked: false,
            },
            {
                id: "add-order",
                name: "Add Order",
                checked: false,
            },
            {
                id: "edit-order",
                name: "Edit Order",
                checked: false,
            },
            {
                id: "delete-order",
                name: "Delete Order",
                checked: false,
            },
            {
                id: "active-order",
                name: "Active Order",
                checked: false,
            },
            {
                id: "view-cancel-order",
                name: "View Cancel Order",
                checked: false,
            },
        ],
    },

    {
        id: "subuser",
        name: "Subuser",
        checked: false,
        children: [
            {
                id: "view-subuser",
                name: "View Subuser",
                checked: false,
            },
            {
                id: "add-subuser",
                name: "Add Subuser",
                checked: false,
            },
            {
                id: "edit-subuser",
                name: "Edit Subuser",
                checked: false,
            },
            {
                id: "delete-subuser",
                name: "Delete Subuser",
                checked: false,
            },
            {
                id: "active-subuser",
                name: "Active Subuser",
                checked: false,
            },
        ],
    },

    {
        id: "invoice",
        name: "Invoice",
        checked: false,
        children: [
            {
                id: "view-invoice",
                name: "View Invoice",
                checked: false,
                children: [
                    {
                        id: "can-send-invoice",
                        name: "Can Send Invoice",
                        checked: false,
                    },
                    {
                        id: "can-download-invoice",
                        name: "Can Download Invoice",
                        checked: false,
                    },
                    {
                        id: "can-print-invoice",
                        name: "Can Print Invoice",
                        checked: false,
                    },
                    {
                        id: "can-add-payment",
                        name: "Can Add Payment",
                        checked: false,
                    },
                ],
            },

            {
                id: "add-invoice",
                name: "Add Invoice",
                checked: false,
            },

            {
                id: "edit-invoice",
                name: "Edit Invoice",
                checked: false,
            },

            {
                id: "delete-invoice",
                name: "Delete Invoice",
                checked: false,
            },

            {
                id: "active-invoice",
                name: "Active Invoice",
                checked: false,
            },
        ],
    },

    {
        id: "topup",
        name: "Topup",
        checked: false,
        children: [
            {
                id: "view-topup",
                name: "View Topup",
                checked: false,
            },
            {
                id: "add-topup",
                name: "Add Topup",
                checked: false,
            },
            {
                id: "edit-topup",
                name: "Edit Topup",
                checked: false,
            },
            {
                id: "delete-topup",
                name: "Delete Topup",
                checked: false,
            },
            {
                id: "active-topup",
                name: "Active Topup",
                checked: false,
            },
        ],
    },

    {
        id: "profile",
        name: "Profile",
        checked: false,
        children: [
            {
                id: "view-profile",
                name: "View Profile",
                checked: false,
            },
            {
                id: "add-profile",
                name: "Add Profile",
                checked: false,
            },
            {
                id: "edit-profile",
                name: "Edit Profile",
                checked: false,
            },
            {
                id: "delete-profile",
                name: "Delete Profile",
                checked: false,
            },
            {
                id: "active-profile",
                name: "Active Profile",
                checked: false,
            },
        ],
    },

    {
        id: "setting",
        name: "Setting",
        checked: false,
        children: [
            {
                id: "view-setting",
                name: "View Setting",
                checked: false,
            },
            {
                id: "edit-setting",
                name: "Edit Setting",
                checked: false,
            },
        ],
    },

    {
        id: "book-a-pickup",
        name: "Book a Pickup",
        checked: false,
        children: [
            {
                id: "view-book-pickup",
                name: "View Book Pickup",
                checked: false,
            },
            {
                id: "book-with-direct-freight",
                name: "Book With Direct Freight",
                checked: false,
            },
        ],
    },

    {
        id: "credit-application",
        name: "Credit Application",
        checked: false,
        children: [
            {
                id: "view-credit-application",
                name: "View Credit Application",
                checked: false,
            },
            {
                id: "edit-status",
                name: "Edit Status",
                checked: false,
            },
        ],
    },

    {
        id: "courier-surcharge",
        name: "Courier Surcharge",
        checked: false,
        children: [
            {
                id: "view-surcharge",
                name: "View Surcharge",
                checked: false,
            },
            {
                id: "add-surcharge",
                name: "Add Surcharge",
                checked: false,
            },
            {
                id: "edit-surcharge",
                name: "Edit Surcharge",
                checked: false,
            },
            {
                id: "delete-surcharge",
                name: "Delete Surcharge",
                checked: false,
            },
        ],
    },

    {
        id: "courier-base-postcode",
        name: "Courier Base Postcode",
        checked: false,
        children: [
            {
                id: "view-courier-base-postcode",
                name: "View Courier Base Postcode",
                checked: false,
            },
            {
                id: "add-courier-base-postcode",
                name: "Add Courier Base Postcode",
                checked: false,
            },
            {
                id: "edit-courier-base-postcode",
                name: "Edit Courier Base Postcode",
                checked: false,
            },
            {
                id: "delete-courier-base-postcode",
                name: "Delete Courier Base Postcode",
                checked: false,
            },
        ],
    },

    {
        id: "enquiry-management",
        name: "Enquiry Management",
        checked: false,
        children: [
            {
                id: "view-enquiry-management",
                name: "View Enquiry Management",
                checked: false,
            },
        ],
    },

    {
        id: "admin-activity-log",
        name: "Admin Activity Log",
        checked: false,
        children: [
            {
                id: "view-activity",
                name: "View Activity",
                checked: false,
            },
        ],
    },

    {
        id: "auspost-order-summary",
        name: "AusPost Order Summary",
        checked: false,
        children: [
            {
                id: "view-auspost-summary",
                name: "View Auspost Summary",
                checked: false,
            },
        ],
    },

    {
        id: "un-delivered-parcel",
        name: "Un-Delivered Parcel",
        checked: false,
        children: [
            {
                id: "view-undelivered-parcel",
                name: "View Undelivered Parcel",
                checked: false,
            },
        ],
    },

    {
        id: "customer-quote",
        name: "Customer Quote",
        checked: false,
        children: [
            {
                id: "view-customer-quote",
                name: "View Customer Quote",
                checked: false,
            },
            {
                id: "view-customer-quote-history",
                name: "View Customer Quote History",
                checked: false,
            },
        ],
    },

    {
        id: "customer-parcel-report",
        name: "Customer Parcel Report",
        checked: false,
        children: [
            {
                id: "view-customer-parcel-report",
                name: "View Customer Parcel Report",
                checked: false,
            },
        ],
    },

    {
        id: "help-center",
        name: "Help Center",
        checked: false,
        children: [
            {
                id: "view-help-center",
                name: "View Help Center",
                checked: false,
            },
            {
                id: "add-help-center",
                name: "Add Help Center",
                checked: false,
            },
            {
                id: "edit-help-center",
                name: "Edit Help Center",
                checked: false,
            },
            {
                id: "delete-help-center",
                name: "Delete Help Center",
                checked: false,
            },
        ],
    }
];

export default function PermissionTreeView({ title = "Permissions" }: { title?: string }) {
    const [treeData, setTreeData] = useState<TreeNode[]>(permissionsData);
    const [searchQuery, setSearchQuery] = useState("");

    const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
        if (!query) return nodes;
        const lowerQuery = query.toLowerCase();

        return nodes
            .map((node) => {
                const isMatch = node.name.toLowerCase().includes(lowerQuery);
                const filteredChildren = node.children
                    ? filterTree(node.children, query)
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
        id: string,
        checked: boolean
    ): TreeNode[] => {
        return nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    checked,
                    children: node.children
                        ? updateAllChildren(node.children, checked)
                        : undefined,
                };
            }

            return {
                ...node,
                children: node.children
                    ? updateNode(node.children, id, checked)
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
            children: node.children
                ? updateAllChildren(node.children, checked)
                : undefined,
        }));
    };

    const handleCheck = (id: string, checked: boolean) => {
        setTreeData((prev) => updateNode(prev, id, checked));
    };

    return (
        <>
            {/* // <Card className="p-6 rounded-2xl shadow-md flex flex-col h-full"> */}
            <div className="flex items-center justify-between pb-3 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                <h2 className="text-xl font-semibold">{title}</h2>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search permissions..."
                        className="pl-9 h-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2 pr-2">
                {filteredTreeData.length > 0 ? (
                    filteredTreeData.map((node) => (
                        <TreeItem
                            key={node.id}
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
    const hasChildren = !!node.children?.length;
    // Submenu is shown if parent is checked, or if we are actively searching
    const isExpanded = !!node.checked || !!searchQuery;

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

            <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition">
                <div className="flex items-center gap-2">
                    {hasChildren ? (
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            {isExpanded ? (
                                <FolderOpen className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                            ) : (
                                <Folder className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                            )}
                        </div>
                    ) : (
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        </div>
                    )}
                    <span className="text-sm font-medium">{node.name}</span>
                </div>

                {/* RIGHT SIDE CHECKBOX */}
                <Checkbox
                    checked={node.checked}
                    onCheckedChange={(value) =>
                        onCheck(node.id, Boolean(value))
                    }
                />
            </div>

            {/* CHILDREN */}
            {hasChildren && isExpanded && (
                <div className="relative ml-[22px] pl-[2px]">
                    {node.children?.map((child, index) => (
                        <TreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onCheck={onCheck}
                            isLast={index === node.children!.length - 1}
                            searchQuery={searchQuery}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}