// app/api/creatures/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapCreatureToApi } from "@/lib/creatures";
import { auth } from "@/lib/auth";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const id = params.id;

  const existente = await prisma.creature.findUnique({ where: { id } });
  if (!existente || existente.userId !== userId) {
    return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
  }

  const body = await req.json();
  const { nombre, tipo, nivelPoder, entrenada } = body;

  const actualizada = await prisma.creature.update({
    where: { id },
    data: { nombre, tipo, nivelPoder, entrenada: !!entrenada },
  });

  return NextResponse.json(mapCreatureToApi(actualizada));
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const id = params.id;

  const existente = await prisma.creature.findUnique({ where: { id } });
  if (!existente || existente.userId !== userId) {
    return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
  }

  await prisma.creature.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
