import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { useNavigate, Link, Navigate } from "react-router-dom";
import brandlogo from '../../assets/Tranzit_Logo.svg';
import { AuthLayout } from "../../components/auth/AuthLayout";

export default function SignIn() {
  const navigate = useNavigate();

  const userAuthString = localStorage.getItem('userAuth');
  if (userAuthString) {
    try {
      const userAuth = JSON.parse(userAuthString);
      if (userAuth?.isAuthenticated) {
        return <Navigate to="/orders" replace />;
      }
    } catch { 
      // ignore
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    if (payload.email && payload.password) {
      localStorage.setItem("userAuth", JSON.stringify({ email: payload.email, isAuthenticated: true }));
    }

    // redirect to dashboard route
    navigate("/orders");

    try {
      const response = await fetch("/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Sign in failed");
      } else {
        console.log("Sign in successful");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <AuthLayout>
      {/* Logo representation */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center space-x-2 pb-4">
          <img src={brandlogo} alt="Logo" className="" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to Tranzit Group.
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get started with your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-600 dark:text-slate-400 font-medium">Email ID</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-600 dark:text-slate-400 font-medium">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-white dark:bg-zinc-900 border-slate-300 dark:border-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 h-10"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" name="remember" value="true" className="border-slate-300 text-blue-600 focus-visible:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
            >
              Remember Me
            </Label>
          </div>
          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-md rounded-md transition-all shadow-md hover:shadow-lg">
          Login
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          New on our platform?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
