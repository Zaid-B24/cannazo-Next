import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Link as PdfLink,
  Image as PdfImage,
} from "@react-pdf/renderer";
import { PatientFormData } from "@/lib/types";
import { getProductByName, Product } from "@/lib/products";
// Register standard font
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfB.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10, color: "#333" },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  clinicSection: { width: "50%" },
  doctorSection: { width: "50%", textAlign: "right" },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 4,
  },
  doctorName: { fontSize: 14, fontWeight: "bold" },
  subText: { fontSize: 9, color: "#555", marginBottom: 2 },

  // Patient Section
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#006400",
    marginTop: 10,
    marginBottom: 5,
    textDecoration: "underline",
  },
  patientInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  patientText: { fontSize: 10, fontWeight: "bold" },

  // Clinical Details
  clinicalRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  clinicalLabel: {
    fontWeight: "bold",
    width: 100,
  },

  // Table
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#bfbfbf",
    minHeight: 30,
    alignItems: "center",
  },
  tableHeader: { backgroundColor: "#e0e0e0", fontWeight: "bold" },
  col1: {
    width: "40%",
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
  },
  col2: {
    width: "15%",
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    textAlign: "center",
  },
  col3: {
    width: "15%",
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    textAlign: "center",
  },
  col4: { width: "30%", padding: 5 },

  // Advice
  noteContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 4,
  },
  noteTitle: { fontSize: 11, fontWeight: "bold", marginBottom: 5 },
  bulletPoint: { fontSize: 9, marginBottom: 3, lineHeight: 1.4, color: "#444" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 10,
  },
  //Auth/Doctors stamp
  authSection: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  combinedAuthImage: {
    width: 150,
    height: 80,
    marginBottom: 5,
    objectFit: "contain" as const,
  },
});

const getNumericAge = (dob: string | Date): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 0;
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const getPersonalizedDose = (
  product: Product | undefined,
  age: number,
  gender: string
): string => {
  if (!product || !product.dosage) return product?.dose || "As Dir.";

  const isMale = gender.toLowerCase().startsWith("m");
  const genderKey = isMale ? "male" : "female";

  // 1. Children (< 18)
  if (age < 18) {
    return product.dosage.children !== "N/A"
      ? product.dosage.children
      : product.dose || "Consult Physician";
  }

  // 2. Seniors (> 50)
  if (age > 50) {
    return product.dosage.adults.above50[genderKey];
  }

  // 3. Adults (18-50)
  return product.dosage.adults.age18to50[genderKey];
};

interface PrescriptionPDFProps {
  data: PatientFormData;
  authImage: Buffer | null;
}

export const PrescriptionPDF = ({ data, authImage }: PrescriptionPDFProps) => {
  const age = getNumericAge(data.date_of_birth);
  const date = new Date().toLocaleDateString("en-IN");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.clinicSection}>
            <Text style={styles.subText}>
              NG Plaza, Building No 1, Mira Road
            </Text>
            <Text style={styles.subText}>East Thane, 401107</Text>
            <Text style={styles.subText}>Email: aun8898@gmail.com</Text>
          </View>
          <View style={styles.doctorSection}>
            <Text style={styles.doctorName}>Dr. Abdul Shafiz Shaikh</Text>
            <Text style={styles.subText}>
              BUMS, PG Diploma in Sports Nutrition
            </Text>
            <Text style={styles.subText}>Reg. No: 2416</Text>
            <Text style={styles.subText}>Contact: +91 98784 70093</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Patient Details</Text>

        {/* PATIENT INFO */}
        <View style={styles.patientInfoContainer}>
          <View>
            <Text style={styles.patientText}>Name: {data.name}</Text>
            <Text style={{ fontSize: 9, marginTop: 2 }}>
              Phone: {data.phone}
            </Text>
          </View>
          <View>
            <Text style={styles.patientText}>
              Age/Sex: {age} Y / {data.gender}
            </Text>
            <Text style={{ fontSize: 9, marginTop: 2 }}>
              ID: {data.aadhaar_number?.slice(-4) || "N/A"}
            </Text>
          </View>
          <View>
            <Text style={styles.patientText}>Date: {date}</Text>
            {/* <Text style={{ fontSize: 9, marginTop: 2 }}>Rx No: {Math.floor(Math.random() * 10000)}</Text> */}
          </View>
        </View>

        {/* DIAGNOSIS */}
        <View style={{ marginBottom: 10 }}>
          <View style={styles.clinicalRow}>
            <Text style={styles.clinicalLabel}>Condition:</Text>
            <Text style={{ flex: 1 }}>{data.medicalCondition}</Text>
          </View>

          {data.symptoms && (
            <View style={styles.clinicalRow}>
              <Text style={styles.clinicalLabel}>Symptoms:</Text>
              <Text style={{ flex: 1 }}>{data.symptoms}</Text>
            </View>
          )}

          {data.medicalHistory && (
            <View style={styles.clinicalRow}>
              <Text style={styles.clinicalLabel}>History:</Text>
              <Text style={{ flex: 1 }}>{data.medicalHistory}</Text>
            </View>
          )}
        </View>

        {/* TABLE */}
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          Rx (Medicines)
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.col1}>Medicine Name</Text>
            <Text style={styles.col2}>Days</Text>
            <Text style={styles.col3}>Dose</Text>
            <Text style={styles.col4}>Intake - Frequency - Remark</Text>
          </View>

          {data.selectedProducts && data.selectedProducts.length > 0 ? (
            data.selectedProducts.map((prodName: string, i: number) => {
              // LOOKUP DOSE HERE
              const product = getProductByName(prodName);
              const personalizedDose = getPersonalizedDose(
                product,
                age,
                data.gender
              );
              const frequency = product?.dose ? `${product.dose}` : "";

              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.col1}>{prodName}</Text>
                  <Text style={styles.col2}>30</Text>
                  {/* DISPLAY DYNAMIC DOSE */}
                  <Text style={styles.col3}>{frequency}</Text>
                  <Text style={styles.col4}>
                    After Meal - Daily {personalizedDose}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.tableRow}>
              <Text style={{ padding: 10 }}>No medicines selected</Text>
            </View>
          )}
        </View>

        {/* ADVICE */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>ADVISE:</Text>
          <Text style={styles.bulletPoint}>
            Start with the lowest dose. If needed, increase by 1 drop every
            third day until the maximum dose is reached.
          </Text>
          <Text style={styles.bulletPoint}>
            Stop increasing once the desired effect is achieved.
          </Text>

          <Text style={{ ...styles.noteTitle, marginTop: 10 }}>Notes:</Text>
          <Text style={styles.bulletPoint}>Dropper size = 1 mL</Text>
          <Text style={styles.bulletPoint}>1 mL = 20 drops</Text>
          <Text style={styles.bulletPoint}>1 drop = 0.02 mL</Text>
          <Text style={styles.bulletPoint}>
            5 mL syringe = 100 drops (100 servings)
          </Text>

          <Text style={{ ...styles.noteTitle, marginTop: 10 }}>
            Standard mg calculation:
          </Text>
          <Text style={styles.bulletPoint}>
            Total mg of cannabinoids / total volume = mg of cannabinoids per 1
            mL
          </Text>
        </View>

        <View
          style={{
            marginTop: 15,
            marginBottom: 15,
            paddingHorizontal: 5,
            alignItems: "flex-start",
          }}
        >
          <Text style={{ fontSize: 9, color: "#444", marginBottom: 4 }}>
            Click the link below for expert guidance on medical cannabis,
            dosage, and diet recommendations:
          </Text>
          <PdfLink
            src="https://cannazoindia.com/wp-content/uploads/2025/06/Prescription-pdf.pdf"
            style={{ fontSize: 9, color: "blue", textDecoration: "underline" }}
          >
            Expert Guidance
          </PdfLink>
        </View>

        {/* FOOTER */}
        <View style={styles.authSection}>
          {authImage && (
            <PdfImage src={authImage} style={styles.combinedAuthImage} />
          )}
          <Text style={{ fontWeight: "bold" }}>Dr. Abdul Shafiz Shaikh</Text>
        </View>

        <View style={styles.footer}>
          <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
            THIS PRESCRIPTION IS VALID ONLY FOR THE NEXT 24 HOURS.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
