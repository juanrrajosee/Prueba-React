// app/api/creatures/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

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

// GET /api/creatures/:id
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

    const criatura = await prisma.creature.findUnique({
      where: { id },
    });

    if (!criatura) {
      return NextResponse.json(
        { error: "Criatura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(mapCreatureToApi(criatura));
  } catch (error) {
    console.error("Error en GET /api/creatures/[id]", error);
    return NextResponse.json(
      { error: "Error al obtener la criatura" },
      { status: 500 }
    );
  }
}

// PUT /api/creatures/:id -> actualizar criatura
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

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

    // Comprobamos que la criatura existe
    const existente = await prisma.creature.findUnique({
      where: { id },
    });

    if (!existente) {
      return NextResponse.json(
        { error: "Criatura no encontrada" },
        { status: 404 }
      );
    }

    // Construimos el objeto data solo con los campos que vengan
    const data: any = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (tipo !== undefined) data.tipo = tipo.toUpperCase();
    if (nivelPoder !== undefined) data.nivelPoder = nivelPoder;
    if (entrenada !== undefined) data.entrenada = entrenada;

    const actualizada = await prisma.creature.update({
      where: { id },
      data,
    });

    return NextResponse.json(mapCreatureToApi(actualizada));
  } catch (error) {
    console.error("Error en PUT /api/creatures/[id]", error);
    return NextResponse.json(
      {
        error: "Error al actualizar la criatura",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/creatures/:id -> eliminar criatura
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

    await prisma.creature.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en DELETE /api/creatures/[id] (delete)", error);

    // Fallback por si acaso
    try {
      const { id } = await context.params;

      await prisma.creature.deleteMany({
        where: { id },
      });

      return NextResponse.json({ ok: true });
    } catch (error2) {
      console.error(
        "Error en DELETE /api/creatures/[id] (deleteMany)",
        error2
      );
      return NextResponse.json(
        {
          error: "Error al eliminar la criatura",
          detail: String(error2),
        },
        { status: 500 }
      );
    }
  }
}
