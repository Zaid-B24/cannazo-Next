-- CreateTable
CREATE TABLE "PatientData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "weight" TEXT,
    "height" TEXT,
    "aadhaar_number" TEXT,
    "address" TEXT,
    "medicalCondition" TEXT NOT NULL,
    "symptoms" TEXT,
    "medicalHistory" TEXT,
    "selectedProducts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientData_createdAt_idx" ON "PatientData"("createdAt");

-- CreateIndex
CREATE INDEX "PatientData_email_idx" ON "PatientData"("email");

-- CreateIndex
CREATE INDEX "PatientData_name_idx" ON "PatientData"("name");
