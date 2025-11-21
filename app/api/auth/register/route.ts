// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, nombreMagico } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const emailNorm = String(email).toLowerCase();

   
    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese correo mágico" },
        { status: 400 }
      );
    }

    // Crear usuario (contraseña en plano para este proyecto)
    const user = await prisma.user.create({
      data: {
        email: emailNorm,
        password: String(password),
        role: role === "MAESTRO" ? "MAESTRO" : "CUIDADOR",
        
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error en registro:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
