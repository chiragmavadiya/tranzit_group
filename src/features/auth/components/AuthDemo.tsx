import { useState, useCallback, useMemo } from "react";
import { useRegister, useVerificationStatus, useResendVerification } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, UserPlus } from "lucide-react";

export const AuthDemo = () => {
    const [email, setEmail] = useState("test@example.com");
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");

    // Queries & Mutations
    const {
        data: statusData,
        isLoading: isStatusLoading,
        isError: isStatusError,
        refetch: refetchStatus
    } = useVerificationStatus();

    const registerMutation = useRegister();
    const resendMutation = useResendVerification();

    // Handlers
    const handleRegister = useCallback(() => {
        registerMutation.mutate({
            first_name: firstName,
            last_name: lastName,
            email,
            password: "password123",
            password_confirmation: "password123",
            terms: true,
        });
    }, [registerMutation, firstName, lastName, email]);

    const handleResend = useCallback(() => {
        resendMutation.mutate();
    }, [resendMutation]);

    // UI States
    const mutationLoading = useMemo(() => registerMutation.isPending || resendMutation.isPending, [registerMutation.isPending, resendMutation.isPending]);

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">API Integration Demo</h1>

            {/* Verification Status Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Verification Status</CardTitle>
                    <Button variant="outline" size="icon" onClick={() => refetchStatus()} disabled={isStatusLoading}>
                        <RefreshCw className={`h-4 w-4 ${isStatusLoading ? "animate-spin" : ""}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {isStatusLoading ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="animate-spin" />
                            <span>Loading status...</span>
                        </div>
                    ) : isStatusError ? (
                        <p className="text-destructive">Error loading verification status.</p>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Email Verified:</span>
                                <Badge variant={statusData?.data.email_verified ? "default" : "secondary"}>
                                    {statusData?.data.email_verified ? "Yes" : "No"}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Is Onboarded:</span>
                                <Badge variant={statusData?.data.is_onboarded ? "default" : "secondary"}>
                                    {statusData?.data.is_onboarded ? "Yes" : "No"}
                                </Badge>
                            </div>
                            {statusData?.data.next_step && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Next Step: {statusData.data.next_step}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        variant="outline"
                        onClick={handleResend}
                        disabled={mutationLoading}
                        className="w-full"
                    >
                        {resendMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Resend Verification Email
                    </Button>
                </CardFooter>
            </Card>

            {/* Registration Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">First Name</label>
                            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {registerMutation.isError && (
                        <p className="text-destructive text-sm font-medium">
                            Registration failed: {(registerMutation.error as any)?.response?.data?.message || "Unknown error"}
                        </p>
                    )}
                    {registerMutation.isSuccess && (
                        <p className="text-green-600 text-sm font-medium">
                            Successfully registered! Token saved.
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleRegister}
                        disabled={mutationLoading}
                        className="w-full"
                    >
                        {registerMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <UserPlus className="mr-2 h-4 w-4" />
                        )}
                        Register Customer
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
