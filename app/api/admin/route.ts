import { NextResponse } from "next/server";
import db from "@/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;
    

    const whereCondition: Prisma.PatientDataWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { medicalCondition: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [patients, totalCount] = await Promise.all([
      db.patientData.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.patientData.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: patients,
      pagination: {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasMore: skip + patients.length < totalCount,
      },
    });

  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch patient records" },
      { status: 500 }
    );
  }
}