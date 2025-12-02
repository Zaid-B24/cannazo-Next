import { generatePrescriptionStream } from "@/lib/pdf-service";
import { NextResponse } from "next/server";
import db from "@/db";
export async function POST(req: Request) {
  try {
    // 1. Parse the incoming JSON
    const data = await req.json();

    console.log("------------------------------------------------");
    console.log("🚀 Processing Prescription for:", data.name);

    const savedRecord = await db.patientData.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        date_of_birth: new Date(data.date_of_birth),
        weight: data.weight,
        height: data.height,
        aadhaar_number: data.aadhaar_number,
        address: data.address,
        medicalCondition: data.medicalCondition,
        symptoms: data.symptoms,
        medicalHistory: data.medicalHistory,
        selectedProducts: data.selectedProducts, 
      },
    });

    console.log("✅ Database Record Created ID:", savedRecord.id);
    console.log("------------------------------------------------");
    const stream = await generatePrescriptionStream(data);
    

    // 2. Return the stream as a response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Prescription-${data.name.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }
}
