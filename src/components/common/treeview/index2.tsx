import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    memo,
} from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Folder, FolderOpen, Search } from "lucide-react";
import { FormInput } from "@/features/orders/components/OrderFormUI";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type PermissionNode = {
    id: string;
    name: string;
    checked?: boolean;
    children?: PermissionNode[];
};

/* -------------------------------------------------------------------------- */
/*                              PERMISSION DATA                               */
/* -------------------------------------------------------------------------- */

const permissionsData: PermissionNode[] = [
    {
        id: "dashboard",
        name: "Dashboard",
        children: [
            {
                id: "view-dashboard",
                name: "View Dashboard",
                children: [
                    {
                        id: "statistics",
                        name: "Statistics",
                    },
                    {
                        id: "margin-count",
                        name: "Margin Count",
                    },
                    {
                        id: "orders-count",
                        name: "Orders Count",
                    },
                    {
                        id: "paid-invoices-count",
                        name: "Paid Invoices Count",
                    },
                    {
                        id: "unpaid-invoices-count",
                        name: "Unpaid Invoices Count",
                    },
                    {
                        id: "invoices-count",
                        name: "Invoices Count",
                    },
                    {
                        id: "topup-count",
                        name: "Topup Count",
                    },
                    {
                        id: "transactions-table",
                        name: "Transactions Table",
                    },
                    {
                        id: "pending-invoices-table",
                        name: "Pending Invoices Table",
                    },
                ],
            },
        ],
    },

    {
        id: "customer",
        name: "Customer",
        children: [
            {
                id: "view-customer",
                name: "View Customer",
                children: [
                    {
                        id: "view-customer-statistics",
                        name: "View Customer Statistics",
                    },
                    {
                        id: "view-customer-profile-tab",
                        name: "View Customer Profile Tab",
                    },
                    {
                        id: "view-customer-orders-tab",
                        name: "View Customer Orders Tab",
                    },
                    {
                        id: "view-customer-integration-tab",
                        name: "View Customer Integration Tab",
                    },
                    {
                        id: "view-customer-transaction-tab",
                        name: "View Customer Transaction Tab",
                    },
                    {
                        id: "view-customer-credit-application",
                        name: "View Customer Credit Application",
                    },
                    {
                        id: "view-customer-invoice-tab",
                        name: "View Customer Invoice Tab",
                    },
                    {
                        id: "can-verify-customer-account",
                        name: "Can Verify Customer Account",
                    },
                ],
            },

            {
                id: "add-customer",
                name: "Add Customer",
            },

            {
                id: "edit-customer",
                name: "Edit Customer",
            },

            {
                id: "delete-customer",
                name: "Delete Customer",
            },

            {
                id: "active-customer",
                name: "Active Customer",
            },
        ],
    },

    {
        id: "order",
        name: "Order",
        children: [
            {
                id: "view-order",
                name: "View Order",
            },
            {
                id: "add-order",
                name: "Add Order",
            },
            {
                id: "edit-order",
                name: "Edit Order",
            },
            {
                id: "delete-order",
                name: "Delete Order",
            },
            {
                id: "active-order",
                name: "Active Order",
            },
            {
                id: "view-cancel-order",
                name: "View Cancel Order",
            },
        ],
    },

    {
        id: "subuser",
        name: "Subuser",
        children: [
            {
                id: "view-subuser",
                name: "View Subuser",
            },
            {
                id: "add-subuser",
                name: "Add Subuser",
            },
            {
                id: "edit-subuser",
                name: "Edit Subuser",
            },
            {
                id: "delete-subuser",
                name: "Delete Subuser",
            },
            {
                id: "active-subuser",
                name: "Active Subuser",
            },
        ],
    },

    {
        id: "invoice",
        name: "Invoice",
        children: [
            {
                id: "view-invoice",
                name: "View Invoice",
                children: [
                    {
                        id: "can-send-invoice",
                        name: "Can Send Invoice",
                    },
                    {
                        id: "can-download-invoice",
                        name: "Can Download Invoice",
                    },
                    {
                        id: "can-print-invoice",
                        name: "Can Print Invoice",
                    },
                    {
                        id: "can-add-payment",
                        name: "Can Add Payment",
                    },
                ],
            },

            {
                id: "add-invoice",
                name: "Add Invoice",
            },

            {
                id: "edit-invoice",
                name: "Edit Invoice",
            },

            {
                id: "delete-invoice",
                name: "Delete Invoice",
            },

            {
                id: "active-invoice",
                name: "Active Invoice",
            },
        ],
    },
];

/* -------------------------------------------------------------------------- */
/*                              TREE UTILITIES                                */
/* -------------------------------------------------------------------------- */

/**
 * Marks every child recursively.
 */
const updateChildrenState = (
    nodes: PermissionNode[],
    checked: boolean
): PermissionNode[] => {
    return nodes.map((node) => ({
        ...node,
        checked,
        children: node.children
            ? updateChildrenState(node.children, checked)
            : undefined,
    }));
};

/**
 * Returns true if all children are checked.
 */
const areAllChildrenChecked = (
    children?: PermissionNode[]
): boolean => {
    if (!children?.length) {
        return false;
    }

    return children.every((child) => child.checked);
};

/**
 * Returns true if at least one child is checked.
 */
// const areSomeChildrenChecked = (
//     children?: PermissionNode[]
// ): boolean => {
//     if (!children?.length) {
//         return false;
//     }

//     return children.some(
//         (child) =>
//             child.checked || areSomeChildrenChecked(child.children)
//     );
// };

/**
 * Toggles node state recursively.
 * - Updates all descendants
 * - Updates parent states automatically
 */
const toggleNodeState = (
    nodes: PermissionNode[],
    targetId: string,
    checked: boolean
): PermissionNode[] => {
    return nodes.map((node) => {
        /* ------------------------------ TARGET NODE ----------------------------- */

        if (node.id === targetId) {
            return {
                ...node,
                checked,
                children: node.children
                    ? updateChildrenState(node.children, checked)
                    : undefined,
            };
        }

        /* ------------------------------ CHILDREN ------------------------------ */

        const updatedChildren = node.children
            ? toggleNodeState(node.children, targetId, checked)
            : undefined;

        /* --------------------------- PARENT CHECK STATE -------------------------- */

        const parentChecked = updatedChildren
            ? areAllChildrenChecked(updatedChildren)
            : node.checked;

        return {
            ...node,
            checked: parentChecked,
            children: updatedChildren,
        };
    });
};

/**
 * Extract all checked ids.
 */
const getCheckedIds = (
    nodes: PermissionNode[]
): string[] => {
    return nodes.flatMap((node) => [
        ...(node.checked ? [node.id] : []),
        ...(node.children
            ? getCheckedIds(node.children)
            : []),
    ]);
};

/**
 * Initialize tree using selected ids.
 */
const initializeTree = (
    nodes: PermissionNode[],
    selectedIds: string[]
): PermissionNode[] => {
    return nodes.map((node) => {
        const initializedChildren = node.children
            ? initializeTree(node.children, selectedIds)
            : undefined;

        const checked =
            selectedIds.includes(node.id) ||
            areAllChildrenChecked(initializedChildren);

        return {
            ...node,
            checked,
            children: initializedChildren,
        };
    });
};

/**
 * Filter tree recursively while preserving hierarchy.
 */
const filterTree = (
    nodes: PermissionNode[],
    query: string
): PermissionNode[] => {
    if (!query.trim()) {
        return nodes;
    }

    const normalizedQuery = query.toLowerCase();

    return nodes
        .map((node) => {
            const currentNodeMatches =
                node.name
                    .toLowerCase()
                    .includes(normalizedQuery);

            const filteredChildren = node.children
                ? filterTree(node.children, query)
                : undefined;

            if (
                currentNodeMatches ||
                filteredChildren?.length
            ) {
                return {
                    ...node,
                    children: filteredChildren,
                };
            }

            return null;
        })
        .filter(Boolean) as PermissionNode[];
};

/**
 * Count total nodes.
 */
const countTotalNodes = (
    nodes: PermissionNode[]
): number => {
    return nodes.reduce(
        (accumulator, node) =>
            accumulator +
            1 +
            (node.children
                ? countTotalNodes(node.children)
                : 0),
        0
    );
};

/* -------------------------------------------------------------------------- */
/*                            COMPONENT PROPERTIES                            */
/* -------------------------------------------------------------------------- */

type PermissionTreeViewProps = {
    title?: string;
    initialSelected?: string[];
    onChange?: (selectedIds: string[]) => void;
};

/* -------------------------------------------------------------------------- */
/*                         PERMISSION TREE VIEW                               */
/* -------------------------------------------------------------------------- */

export default function PermissionTreeView({
    title = "Permissions",
    initialSelected = [],
    onChange,
}: PermissionTreeViewProps) {
    /* ---------------------------------------------------------------------- */
    /*                                 STATES                                 */
    /* ---------------------------------------------------------------------- */

    const [searchQuery, setSearchQuery] =
        useState("");

    const [permissionTree, setPermissionTree] =
        useState<PermissionNode[]>(() =>
            initializeTree(
                permissionsData,
                initialSelected
            )
        );

    /* ---------------------------------------------------------------------- */
    /*                                  MEMOS                                 */
    /* ---------------------------------------------------------------------- */

    const selectedIds = useMemo(
        () => getCheckedIds(permissionTree),
        [permissionTree]
    );

    const totalNodes = useMemo(
        () => countTotalNodes(permissionTree),
        [permissionTree]
    );

    const isAllSelected =
        selectedIds.length === totalNodes;

    const filteredPermissions = useMemo(
        () => filterTree(permissionTree, searchQuery),
        [permissionTree, searchQuery]
    );

    /* ---------------------------------------------------------------------- */
    /*                                 EFFECTS                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        onChange?.(selectedIds);
    }, [selectedIds, onChange]);

    /* ---------------------------------------------------------------------- */
    /*                                HANDLERS                                */
    /* ---------------------------------------------------------------------- */

    const handleNodeToggle = useCallback(
        (id: string, checked: boolean) => {
            setPermissionTree((previousTree) =>
                toggleNodeState(
                    previousTree,
                    id,
                    checked
                )
            );
        },
        []
    );

    const handleToggleAll = useCallback(
        (checked: boolean) => {
            setPermissionTree((previousTree) =>
                updateChildrenState(
                    previousTree,
                    checked
                )
            );
        },
        []
    );

    /* ---------------------------------------------------------------------- */
    /*                                  RENDER                                */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="flex flex-col gap-4">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b bg-white pb-4 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                        {title}
                    </h2>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="select-all"
                            checked={isAllSelected}
                            onCheckedChange={(checked) =>
                                handleToggleAll(
                                    Boolean(checked)
                                )
                            }
                        />

                        <label
                            htmlFor="select-all"
                            className="cursor-pointer text-sm font-medium text-slate-700 dark:text-zinc-300"
                        >
                            Select All
                        </label>
                    </div>
                </div>

                <FormInput
                    placeholder="Search permissions..."
                    icon={Search}
                    className="h-9"
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            {/* TREE */}
            <div className="space-y-1 pr-2">
                {filteredPermissions.length > 0 ? (
                    filteredPermissions.map(
                        (node) => (
                            <TreeItem
                                key={node.id}
                                node={node}
                                level={0}
                                onCheck={
                                    handleNodeToggle
                                }
                                searchQuery={
                                    searchQuery
                                }
                            />
                        )
                    )
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        No permissions found matching "
                        {searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              TREE ITEM TYPES                               */
/* -------------------------------------------------------------------------- */

type TreeItemProps = {
    node: PermissionNode;
    level: number;
    onCheck: (
        id: string,
        checked: boolean
    ) => void;
    isLast?: boolean;
    searchQuery?: string;
};

/* -------------------------------------------------------------------------- */
/*                                TREE ITEM                                   */
/* -------------------------------------------------------------------------- */

const TreeItem = memo(function TreeItem({
    node,
    level,
    onCheck,
    isLast = false,
    searchQuery = "",
}: TreeItemProps) {
    const [isExpanded, setIsExpanded] =
        useState(false);

    const hasChildren =
        !!node.children?.length;

    const shouldExpand =
        isExpanded ||
        !!searchQuery ||
        node.checked;

    // const isIndeterminate =
    //     !node.checked &&
    //     areSomeChildrenChecked(node.children);

    return (
        <div className="relative">
            {level > 0 && (
                <>
                    <div className="absolute -left-[14px] top-0 h-[20px] w-px bg-border" />

                    {!isLast && (
                        <div className="absolute -left-[14px] top-[20px] bottom-0 w-px bg-border" />
                    )}

                    <div className="absolute -left-[14px] top-[20px] h-px w-[14px] bg-border" />
                </>
            )}

            <div className="group flex items-center justify-between rounded-lg px-2 py-2 transition hover:bg-muted/50">
                <div
                    className="flex flex-1 cursor-pointer items-center gap-2"
                    onClick={() =>
                        onCheck(
                            node.id,
                            !node.checked
                        )
                    }
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            className="flex h-5 w-5 items-center justify-center rounded transition hover:bg-accent/50"
                            onClick={(event) => {
                                event.stopPropagation();

                                setIsExpanded(
                                    (previous) =>
                                        !previous
                                );
                            }}
                        >
                            {shouldExpand ? (
                                <FolderOpen className="h-4 w-4 fill-blue-500/20 text-blue-500" />
                            ) : (
                                <Folder className="h-4 w-4 fill-blue-500/20 text-blue-500" />
                            )}
                        </button>
                    ) : (
                        <div className="flex h-5 w-5 items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                        </div>
                    )}

                    <span className="text-sm font-medium text-slate-700 transition group-hover:text-slate-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                        {node.name}
                    </span>
                </div>

                <Checkbox
                    checked={node.checked}
                    onCheckedChange={(checked) =>
                        onCheck(
                            node.id,
                            checked
                        )
                    }
                />
            </div>

            {hasChildren && shouldExpand && (
                <div className="relative ml-[22px] pl-[2px]">
                    {node.children?.map(
                        (child, index) => (
                            <TreeItem
                                key={child.id}
                                node={child}
                                level={level + 1}
                                onCheck={
                                    onCheck
                                }
                                isLast={
                                    index ===
                                    node.children!
                                        .length -
                                    1
                                }
                                searchQuery={
                                    searchQuery
                                }
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
});