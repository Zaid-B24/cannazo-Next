import { renderToStream } from "@react-pdf/renderer";
import { PrescriptionPDF } from "@/components/pdf/Prescription";
import { PatientFormData } from "./types";

import fs from "fs";
import path from "path";

let cachedAuthImage: Buffer | null = null;

const getAuthImageBuffer = () => {
  if (cachedAuthImage) {
    return cachedAuthImage;
  }

  try {
    const imagePath = path.join(process.cwd(), "public", "Doctor.png");
    if (fs.existsSync(imagePath)) {
      cachedAuthImage = fs.readFileSync(imagePath);
    } else {
      console.warn("Doctor.png not found at:", imagePath);
    }
  } catch (error) {
    console.error("Error reading signature image:", error);
  }

  return cachedAuthImage;
};

export async function generatePrescriptionStream(data: PatientFormData) {
  const imageBuffer = getAuthImageBuffer();
  return await renderToStream(
    <PrescriptionPDF data={data} authImage={imageBuffer} />
  );
}
