"use client";

import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
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
    <>
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="flex items-center space-x-2 pb-2">
          <img src={brandlogo} alt="Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Verify Email
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Account activation link was sent to <span className="font-bold text-slate-900 dark:text-white">{email}</span>
        </p>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        <div className="w-full">
          <Button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full text-white font-bold h-11 text-[13px] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            {resendMutation.isPending ? "Resending..." : "Resend Verification Email"}
          </Button>
        </div>

        <p className="text-center text-[13px] font-medium text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">
            Back to Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
