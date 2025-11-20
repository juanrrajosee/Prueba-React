// app/api/creatures/[id]/route.ts
import { NextResponse } from "next/server";
import {
  getCriaturaDeUsuario,
  actualizarCriatura,
  eliminarCriatura,
  TipoCriatura,
} from "@/lib/creatures";

const currentUserId = "demo-user-1"; // TODO: usuario real con next-auth

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const criatura = getCriaturaDeUsuario(params.id, currentUserId);
  if (!criatura) {
    return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
  }
  return NextResponse.json(criatura);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { nombre, tipo, nivelPoder } = body as {
      nombre?: string;
      tipo?: TipoCriatura;
      nivelPoder?: string;
    };

    const actualizada = actualizarCriatura(params.id, currentUserId, {
      nombre,
      tipo,
      nivelPoder,
    });

    if (!actualizada) {
      return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
    }

    return NextResponse.json(actualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar la criatura" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const borrada = eliminarCriatura(params.id, currentUserId);
  if (!borrada) {
    return NextResponse.json({ error: "Criatura no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
