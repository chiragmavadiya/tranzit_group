"use client";

import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useResendVerification, useVerifyEmail } from "@/features/auth/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { showToast } from "@/components/ui/custom-toast";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  const resendMutation = useResendVerification();
  const verifyMutation = useVerifyEmail();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token, {
        onSuccess: (response) => {
          if (response.status) {
            showToast("Email verified successfully", "success");
            navigate("/setup");
          } else {
            showToast(response.message || "Verification failed", "error");
          }
        },
        onError: () => {
          showToast("Verification failed", "error");
        }
      });
    }
  }, [token, navigate, verifyMutation]);

  const handleResend = () => {
    resendMutation.mutate(undefined, {
      onSuccess: (response) => {
        if (response.status) {
          showToast("Verification email resent", "success");
        } else {
          showToast(response.message || "Failed to resend verification email", "error");
        }
      },
      onError: () => {
        showToast("Failed to resend verification email", "error");
      }
    });
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center space-y-6 w-sm m-auto">
        <div className="flex items-center space-x-2">
          <img src={brandlogo} alt="Logo" className="h-25" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify your email.
          </h2>
          <p className="my-0 text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
            Account activation link was sent to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>. Please follow the link to continue.
          </p>
        </div>

        <div className="pt-2 w-xs m-auto">
          <Button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-8 text-sm rounded-md transition-all shadow-md hover:shadow-lg"
          >
            {resendMutation.isPending ? "Sending..." : "Didn't get the email? Resend"}
          </Button>
        </div>

        <div className="flex flex-col space-y-4 pt-2">
          <Link to="/signin" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
