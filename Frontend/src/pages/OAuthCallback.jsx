import React, { useEffect, useContext, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Wallet, Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        updateUser(user, token);
        navigate("/", { replace: true });
      } catch {
        navigate("/login?error=Invalid+OAuth+response", { replace: true });
      }
    } else {
      navigate("/login?error=OAuth+failed", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-white/80 text-sm font-medium">
          Signing you in with Google…
        </p>
      </div>
    </div>
  );
}
