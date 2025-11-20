// app/api/creatures/route.ts
import { NextResponse } from "next/server";
import {
  getCriaturasDeUsuario,
  crearCriatura,
  TipoCriatura,
} from "@/lib/creatures";

// De momento simulamos un usuario logueado fijo
const currentUserId = "demo-user-1"; // TODO: reemplazar por usuario real

export async function GET() {
  const lista = getCriaturasDeUsuario(currentUserId);
  return NextResponse.json(lista);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nombre, tipo, nivelPoder } = body as {
      nombre?: string;
      tipo?: TipoCriatura;
      nivelPoder?: string;
    };

    if (!nombre || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, tipo" },
        { status: 400 }
      );
    }

    const nueva = crearCriatura({
      usuarioId: currentUserId,
      nombre,
      tipo,
      nivelPoder: nivelPoder || "I",
    });

    return NextResponse.json(nueva, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la criatura" },
      { status: 500 }
    );
  }
}
