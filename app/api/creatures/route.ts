// app/api/creatures/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

function mapCreatureToApi(c: any) {
  return {
    id: c.id,
    usuarioId: c.userId,
    nombre: c.nombre,
    tipo: c.tipo.toLowerCase(),
    nivelPoder: c.nivelPoder,
    entrenada: c.entrenada,
  };
}

// Usuario demo mientras no tengamos autenticación real
const DEMO_EMAIL = "demo@santuario.com";

async function getCurrentUserId() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      password: "demo",
      role: "CUIDADOR",
    },
  });

  return user.id;
}

// GET /api/creatures  -> lista SOLO las criaturas del usuario demo
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const lista = await prisma.creature.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(lista.map(mapCreatureToApi));
  } catch (error) {
    console.error("Error en GET /api/creatures", error);
    return NextResponse.json(
      { error: "Error al obtener las criaturas" },
      { status: 500 }
    );
  }
}

// POST /api/creatures -> crear criatura para el usuario demo
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nombre,
      tipo,
      nivelPoder,
      entrenada,
    }: {
      nombre?: string;
      tipo?: string;
      nivelPoder?: string;
      entrenada?: boolean;
    } = body;

    if (!nombre || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, tipo" },
        { status: 400 }
      );
    }

    const userId = await getCurrentUserId();

    const nueva = await prisma.creature.create({
      data: {
        nombre,
        tipo: tipo.toUpperCase(),
        nivelPoder: nivelPoder || "I",
        entrenada: !!entrenada,
        userId,
      },
    });

    return NextResponse.json(mapCreatureToApi(nueva), { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/creatures", error);
    return NextResponse.json(
      { error: "Error al crear la criatura" },
      { status: 500 }
    );
  }
}
