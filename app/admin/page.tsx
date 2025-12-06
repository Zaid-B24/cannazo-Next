"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  aadhaar_number?: string;
  medicalCondition: string;
  symptoms?: string;
  createdAt: string;
  selectedProducts: string[];
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh(); // Ensures the middleware re-runs immediately
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin?page=${page}&search=${search}`);
        const json = await res.json();
        if (json.success) {
          setPatients(json.data);
          setPagination(json.pagination);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  const calculateAge = (dobString: string) => {
    const diff = Date.now() - new Date(dobString).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get("search") as string;
    router.push(`/admin?page=1&search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-360 mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">Manage patient records</p>
          </div>

          <div className="flex gap-4 items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                name="search"
                defaultValue={search}
                placeholder="Name, email, medical Condition..."
                className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </form>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
              {pagination?.total || 0} Total
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Loading records...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 min-w-[150px]">Patient</th>
                    <th className="px-6 py-3">Details</th>
                    <th className="px-6 py-3">Condition</th>
                    <th className="px-6 py-3">Symptoms</th>
                    <th className="px-6 py-3">Products</th>
                    <th className="px-6 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="bg-white hover:bg-gray-50 transition-colors"
                      >
                        {/* 1. Patient Name & ID */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 text-base">
                            {patient.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            AADHAAR: {patient.aadhaar_number}
                          </div>
                        </td>

                        {/* 2. Contact & Bio */}
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-500 mb-1">
                            {calculateAge(patient.date_of_birth)} Yrs /{" "}
                            {patient.gender}
                          </div>
                          <div className="text-gray-900 font-medium">
                            {patient.phone}
                          </div>
                          <div className="text-xs text-gray-400">
                            {patient.email}
                          </div>
                        </td>

                        {/* 3. Condition */}
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                            {patient.medicalCondition}
                          </span>
                        </td>

                        {/* 4. Symptoms (Truncated) */}
                        <td className="px-6 py-4">
                          <div
                            className="max-w-[200px] truncate text-gray-600"
                            title={patient.symptoms}
                          >
                            {patient.symptoms || "-"}
                          </div>
                        </td>

                        {/* 5. Selected Products */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[250px]">
                            {Array.isArray(patient.selectedProducts) &&
                            patient.selectedProducts.length > 0 ? (
                              patient.selectedProducts.map((prod, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-2 py-0.5 rounded-full"
                                >
                                  {prod}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </td>

                        {/* 6. Date */}
                        <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                          {new Date(patient.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* --- PAGINATION --- */}
          {!loading && pagination && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/admin?page=${page - 1}&search=${search}`)
                  }
                  disabled={page <= 1}
                  className={`px-3 py-1 border rounded text-sm ${
                    page <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    router.push(`/admin?page=${page + 1}&search=${search}`)
                  }
                  disabled={!pagination.hasMore}
                  className={`px-3 py-1 border rounded text-sm ${
                    !pagination.hasMore
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
