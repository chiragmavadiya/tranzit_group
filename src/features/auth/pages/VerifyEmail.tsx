"use client";

import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import brandlogo from '@/assets/Tranzit_Logo.svg';
import { useLogout, useResendVerification } from "@/features/auth/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
// import { useEffect } from "react";
import { showToast } from "@/components/ui/custom-toast";
import { logout } from "../authSlice";
import { useAppDispatch } from "@/hooks/store.hooks";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const email = JSON.parse(sessionStorage.getItem("verify-email-payloads") || "{}")?.email || location.state?.email || "";
  const authTken = localStorage.getItem("user_auth_token");


  const resendMutation = useResendVerification();
  // const verifyMutation = useVerifyEmail();
  const dispatch = useAppDispatch();
  const logoutMutation = useLogout();

  const token = searchParams.get("token") || authTken;

  // useEffect(() => {
  //   if (token) {
  //     verifyMutation.mutate(token, {
  //       onSuccess: (response) => {
  //         if (response.status) {
  //           showToast("Email verified successfully", "success");
  //         } else {
  //           showToast(response.message || "Verification failed", "error");
  //         }
  //       },
  //       onError: () => {
  //         showToast("Verification failed", "error");
  //       }
  //     });
  //   }
  // }, [token, navigate, verifyMutation]);

  const handleLogout = () => {
    // on success return to /signin
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.clear();
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const handleResend = () => {
    resendMutation.mutate(token || "", {
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
      <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto mb-8">
        <div className="flex items-center space-x-2 pb-2">
          <img src={brandlogo} alt="Logo" className="h-16 w-auto" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
          Verify your email to activate your Tranzit Group account
        </h2>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            We’ve sent an activation link to:
            {email && (
              <span className="block font-bold text-slate-900 dark:text-white mt-1 text-base">
                {email}
              </span>
            )}
          </p>

          <p className="text-sm md:text-[15px] font-normal leading-relaxed text-[#7C8B9E] dark:text-zinc-300 px-4">
            Please check your inbox and click the verification link to continue setting up your account.
          </p>

          <p className="text-xs md:text-sm font-normal text-[#A0AEC0] dark:text-zinc-500">
            Can’t find the email? Please check your spam or junk folder.
          </p>
        </div>
      </div>

      <div className="space-y-6 flex flex-col items-center w-full max-w-sm mx-auto">
        <div className="w-full">
          <Button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full text-white font-bold h-11 text-[13px] rounded-xl bg-[#0F253E] hover:bg-[#0a1e35] transition-all shadow-lg shadow-[#0F253E]/20 active:scale-[0.98]"
          >
            {resendMutation.isPending ? "Resending..." : "Resend Verification Email"}
          </Button>
        </div>

        <p className="text-center text-[13px] font-bold text-[#0F253E] dark:text-sky-500">
          <Button
            variant="secondary"
            // className="text-[13px] font-bold text-[#0F253E] hover:text-[#0f253e]/80 dark:text-sky-500 hover:underline p-0 h-auto cursor-pointer"
            className="h-9"
            onClick={() => navigate('/login')}
          >
            Back to Sign In
          </Button>
        </p>

        <Button
          variant="link"
          className="text-xs font-normal text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400 hover:underline cursor-pointer mt-6 p-0 h-auto"
          onClick={() => {
            handleLogout();
          }}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          Logout
        </Button>
      </div>
    </>
  );
}
