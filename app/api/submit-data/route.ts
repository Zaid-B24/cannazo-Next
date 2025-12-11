import { generatePrescriptionStream } from "@/lib/pdf-service";
import { after, NextResponse } from "next/server";
import db from "@/db";
import { streamToBuffer } from "@/lib/utils";
import { sendPrescriptionEmail } from "@/lib/emails";
export async function POST(req: Request) {
  try {

    const data = await req.json();

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

    const emailPromise = async () => {
        try {
            const stream = await generatePrescriptionStream(data);
            const pdfBuffer = await streamToBuffer(stream);
            await sendPrescriptionEmail(data.email, data.name, pdfBuffer);
            
        } catch (err) {
            console.error("Background Email Failed:", err);
        }
    };

    after(emailPromise);
   
    return NextResponse.json(
      { success: true, message: "Request received. Processing in background." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
