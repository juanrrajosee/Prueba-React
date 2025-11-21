// app/api/creatures/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapCreatureToApi } from "@/lib/creatures";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const criaturas = await prisma.creature.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(criaturas.map(mapCreatureToApi));
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await req.json();
  const { nombre, tipo, nivelPoder, entrenada } = body;

  const nueva = await prisma.creature.create({
    data: {
      nombre,
      tipo,
      nivelPoder,
      entrenada: !!entrenada,
      userId,
    },
  });

  return NextResponse.json(mapCreatureToApi(nueva), { status: 201 });
}
