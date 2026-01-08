import { createClient } from "@/lib/auth/supabase-server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";

async function getPlayerData(userId: string) {
  const player = await prisma.player.findUnique({
    where: { userId },
    include: {
      planet: {
        include: {
          buildings: true,
          buildingQueue: true,
        },
      },
      researches: true,
      researchQueue: true,
    },
  });
  return player;
}

export default async function DashboardPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, Commander {player.username}
        </h1>
        <p className="text-slate-400 mt-1">
          {player.planet.name} [{player.planet.coordX}:{player.planet.coordY}]
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Planet Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Planet Info</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Name</dt>
              <dd className="text-white">{player.planet.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Coordinates</dt>
              <dd className="text-white">
                [{player.planet.coordX}:{player.planet.coordY}]
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Temperature</dt>
              <dd className="text-white">{player.planet.temperature}°C</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Fields</dt>
              <dd className="text-white">
                {player.planet.fieldsUsed}/{player.planet.fields}
              </dd>
            </div>
          </dl>
        </div>

        {/* Building Queue */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Building Queue
          </h2>
          {player.planet.buildingQueue ? (
            <div className="flex items-center gap-3">
              <Image
                src={`/sprites/icons/status-timer.png`}
                alt=""
                width={24}
                height={24}
              />
              <div>
                <p className="text-white">
                  {formatBuildingType(player.planet.buildingQueue.buildingType)}{" "}
                  Level {player.planet.buildingQueue.targetLevel}
                </p>
                <p className="text-sm text-slate-400">In progress...</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No buildings in queue</p>
          )}
        </div>

        {/* Research Queue */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Research Queue
          </h2>
          {player.researchQueue ? (
            <div className="flex items-center gap-3">
              <Image
                src={`/sprites/icons/status-timer.png`}
                alt=""
                width={24}
                height={24}
              />
              <div>
                <p className="text-white">
                  {formatTechType(player.researchQueue.techType)} Level{" "}
                  {player.researchQueue.targetLevel}
                </p>
                <p className="text-sm text-slate-400">In progress...</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No research in progress</p>
          )}
        </div>

        {/* Production Rates */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Production Rates
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-2 text-slate-400">
                <Image
                  src="/sprites/resources/metal.png"
                  alt=""
                  width={16}
                  height={16}
                />
                Metal
              </dt>
              <dd className="text-white">
                {Math.floor(player.planet.metalPerHour).toLocaleString()}/hr
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-2 text-slate-400">
                <Image
                  src="/sprites/resources/crystal.png"
                  alt=""
                  width={16}
                  height={16}
                />
                Crystal
              </dt>
              <dd className="text-white">
                {Math.floor(player.planet.crystalPerHour).toLocaleString()}/hr
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-2 text-slate-400">
                <Image
                  src="/sprites/resources/deuterium.png"
                  alt=""
                  width={16}
                  height={16}
                />
                Deuterium
              </dt>
              <dd className="text-white">
                {Math.floor(player.planet.deuteriumPerHour).toLocaleString()}/hr
              </dd>
            </div>
          </dl>
        </div>

        {/* Dark Matter */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Dark Matter</h2>
          <p className="text-3xl font-bold text-purple-400">
            {player.darkMatterBalance.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mt-1">Premium currency</p>
        </div>
      </div>
    </div>
  );
}

function formatBuildingType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatTechType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
