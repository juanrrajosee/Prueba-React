// app/api/creatures/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { mapCreatureToApi } from "@/lib/creatures";


type RouteContext = {
  params: Promise<{ id: string }>;
};


//   EDITAR CRIATURA

export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params; // <-- aquí el cambio importante

  const session = await auth();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();
  const { nombre, tipo, nivelPoder, entrenada } = body;

  // Comprobar que la criatura existe y es del usuario
  const existente = await prisma.creature.findUnique({
    where: { id },
  });

  if (!existente || existente.userId !== userId) {
    return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
  }

  const actualizada = await prisma.creature.update({
    where: { id },
    data: {
      nombre,
      tipo,
      nivelPoder,
      entrenada,
    },
  });

  return NextResponse.json(mapCreatureToApi(actualizada));
}


//   ELIMINAR CRIATURA

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params; // <-- mismo cambio

  const session = await auth();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const existente = await prisma.creature.findUnique({
    where: { id },
  });

  if (!existente || existente.userId !== userId) {
    return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
  }

  await prisma.creature.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
