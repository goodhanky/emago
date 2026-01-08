"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/supabase-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 text-left text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
    >
      Logout
    </button>
  );
}
