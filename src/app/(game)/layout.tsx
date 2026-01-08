import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/auth/supabase-server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

async function getPlayerData(userId: string) {
  const player = await prisma.player.findUnique({
    where: { userId },
    include: {
      planet: true,
    },
  });
  return player;
}

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const player = await getPlayerData(user.id);

  if (!player || !player.planet) {
    redirect("/login");
  }

  const navItems = [
    { href: "/game/dashboard", label: "Dashboard", icon: "nav-dashboard" },
    { href: "/game/buildings", label: "Buildings", icon: "nav-buildings" },
    { href: "/game/research", label: "Research", icon: "nav-research" },
    { href: "/game/shipyard", label: "Shipyard", icon: "nav-shipyard" },
    { href: "/game/fleet", label: "Fleet", icon: "nav-fleet" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">Emago</h1>
          <p className="text-sm text-slate-400">{player.username}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Image
                    src={`/sprites/icons/${item.icon}.png`}
                    alt=""
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Resource bar */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-3">
          <div className="flex items-center gap-6">
            <ResourceDisplay
              icon="metal"
              value={Math.floor(player.planet.metal)}
              label="Metal"
            />
            <ResourceDisplay
              icon="crystal"
              value={Math.floor(player.planet.crystal)}
              label="Crystal"
            />
            <ResourceDisplay
              icon="deuterium"
              value={Math.floor(player.planet.deuterium)}
              label="Deuterium"
            />
            <ResourceDisplay
              icon="energy"
              value={
                player.planet.energyProduction - player.planet.energyConsumption
              }
              label="Energy"
              showSign
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function ResourceDisplay({
  icon,
  value,
  label,
  showSign = false,
}: {
  icon: string;
  value: number;
  label: string;
  showSign?: boolean;
}) {
  const formattedValue = showSign && value >= 0 ? `+${value}` : value.toString();
  const valueColor = showSign
    ? value >= 0
      ? "text-green-400"
      : "text-red-400"
    : "text-white";

  return (
    <div className="flex items-center gap-2">
      <Image
        src={`/sprites/resources/${icon}.png`}
        alt={label}
        width={24}
        height={24}
      />
      <div>
        <p className={`text-sm font-medium ${valueColor}`}>
          {Number(formattedValue).toLocaleString()}
        </p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
