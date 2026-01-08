import { NextRequest, NextResponse } from "next/server";
import { prisma, BuildingType, TechType } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username } = body;

    if (!userId || !username) {
      return NextResponse.json(
        { error: "Missing userId or username" },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingUsername = await prisma.player.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Check if userId already has a player
    const existingPlayer = await prisma.player.findUnique({
      where: { userId },
    });

    if (existingPlayer) {
      return NextResponse.json(
        { error: "Player already exists for this account" },
        { status: 409 }
      );
    }

    // Generate random coordinates (1-499)
    const coordX = Math.floor(Math.random() * 499) + 1;
    const coordY = Math.floor(Math.random() * 499) + 1;

    // Create player, planet, buildings, and researches in a transaction
    const player = await prisma.$transaction(async (tx) => {
      // Create player
      const newPlayer = await tx.player.create({
        data: {
          userId,
          username,
        },
      });

      // Create planet with starting resources
      const planet = await tx.planet.create({
        data: {
          playerId: newPlayer.id,
          name: "Homeworld",
          coordX,
          coordY,
          // Starting resources are schema defaults (metal: 500, crystal: 500, deuterium: 0)
        },
      });

      // Create all buildings at level 0
      const buildingTypes = Object.values(BuildingType);
      await tx.building.createMany({
        data: buildingTypes.map((type) => ({
          planetId: planet.id,
          type,
          level: 0,
        })),
      });

      // Create all researches at level 0
      const techTypes = Object.values(TechType);
      await tx.research.createMany({
        data: techTypes.map((type) => ({
          playerId: newPlayer.id,
          type,
          level: 0,
        })),
      });

      return newPlayer;
    });

    return NextResponse.json({
      success: true,
      playerId: player.id,
      username: player.username,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
