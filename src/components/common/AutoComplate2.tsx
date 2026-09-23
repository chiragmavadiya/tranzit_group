"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
// import { FormInput } from "@/features/orders/components/OrderFormUI";
// import { Search } from "lucide-react";

export interface AutoCompleteOption {
    value: string;
    label: string;
    [key: string]: string | number | boolean | undefined | null;
}

export interface AutoCompleteProps {
    options?: AutoCompleteOption[];
    value?: string;
    defaultValue?: string;
    onSelect?: (value: string) => void;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    renderOption?: (option: AutoCompleteOption) => React.ReactNode;
    emptyText?: string;
    shouldFilter?: boolean;
    label?: string;
    error?: boolean;
    errormsg?: string;
    required?: boolean;
    inputClassName?: string;
}

const AutoComplete = React.forwardRef<HTMLInputElement, AutoCompleteProps>(
    (
        {
            options = [],
            value,
            defaultValue = "",
            onSelect,
            onChange,
            onSearch,
            placeholder,
            disabled,
            className,
            renderOption,
            shouldFilter = true,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);
        const [inputValue, setInputValue] = React.useState(defaultValue);

        const controlledValue = value !== undefined ? value : inputValue;

        const filteredOptions = React.useMemo(() => {
            if (!shouldFilter || !controlledValue) return options;
            return options.filter((option) =>
                option.label.toLowerCase().includes(controlledValue.toLowerCase())
            );
        }, [options, controlledValue, shouldFilter]);

        const handleSelect = React.useCallback(
            (optionValue: string) => {
                const option = options.find((opt) => opt.value === optionValue);
                const newValue = option ? option.label : optionValue;

                setInputValue(newValue);
                setOpen(false);

                onSelect?.(optionValue);
                onChange?.(newValue);
            },
            [options, onSelect, onChange]
        );

        const handleInputChange = React.useCallback(
            (value: string) => {
                const newValue = value;
                setInputValue(newValue);
                onChange?.(newValue);
                onSearch?.(newValue);

                if (!open) {
                    setOpen(true);
                }
            },
            [onChange, onSearch, open]
        );

        const handleFocus = React.useCallback(() => {
            setOpen(true);
        }, []);

        React.useEffect(() => {
            setInputValue(defaultValue);
        }, [defaultValue]);

        return (
            <div className={cn("relative w-full")}>
                <Command className="group/command border-none shadow-none p-0 rounded-none" shouldFilter={false}>
                    <Popover.Root
                        open={open}
                        onOpenChange={setOpen}
                        modal={false}
                    >
                        <Popover.Trigger
                            render={(props) => (
                                <div {...props}>
                                    {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                                    <CommandInput
                                        ref={ref}
                                        // icon={Search}
                                        value={controlledValue}
                                        onValueChange={handleInputChange}
                                        onFocus={handleFocus}
                                        placeholder={placeholder}
                                        disabled={disabled}
                                        // label={label}
                                        // error={error}
                                        // errormsg={err/ormsg}
                                        // required={required}
                                        className={cn("w-full h-full", className)}
                                    // inputClassName={inputClassName}
                                    // inputHieight={9}
                                    />
                                    {/* <FormInput
                                    ref={ref}
                                    icon={Search}
                                    value={controlledValue}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    label={label}
                                    error={error}
                                    errormsg={errormsg}
                                    required={required}
                                    className={cn("w-full h-full", className)}
                                    inputClassName={inputClassName}
                                // inputHieight={9}
                                /> */}
                                </div>
                            )}
                        />

                        {filteredOptions.length > 0 && (
                            <Popover.Portal>
                                <Popover.Positioner
                                    side="bottom"
                                    align="start"
                                    sideOffset={4}
                                    className="z-50 w-(--anchor-width) min-w-[300px]"
                                >
                                    <Popover.Popup
                                        initialFocus={false}
                                        className={cn(
                                            "overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md transition-all outline-none",
                                            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                                            "p-0"
                                        )}
                                    >

                                        {/* <CommandInput placeholder="Search..." /> */}
                                        <CommandList className="max-h-[300px] w-full overflow-y-auto p-0">
                                            <CommandGroup className="">
                                                {filteredOptions.map((option) => (
                                                    <CommandItem
                                                        key={option.label}
                                                        value={option.value}
                                                        onSelect={() => handleSelect(option.value)}
                                                        className="cursor-pointer"
                                                        // onEnter={() => handleSelect(option.value)}
                                                        onClick={() => handleSelect(option.value)}
                                                        data-value={option.value}
                                                    >
                                                        {renderOption ? (
                                                            renderOption(option)
                                                        ) : (
                                                            <span>{option.label}</span>
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Popover.Popup>
                                </Popover.Positioner>
                            </Popover.Portal>
                        )}
                    </Popover.Root>
                </Command>
            </div>
        );
    }
);

AutoComplete.displayName = "AutoComplete";

export default AutoComplete;
