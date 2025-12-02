import { renderToStream } from "@react-pdf/renderer";
import { PrescriptionPDF } from "@/components/pdf/Prescription";
import { PatientFormData } from "./types";

export async function generatePrescriptionStream(data: PatientFormData) {
  return await renderToStream(<PrescriptionPDF data={data} />);
}
