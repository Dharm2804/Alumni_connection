import { useState, useEffect } from "react";
import { Search, MapPin, Building2, Mail, Linkedin, Download } from "lucide-react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx"; // Import xlsx for Excel file generation

interface Alumni {
  _id: string;
  name: string;
  profileImage: string;
  engineeringType: string;
  passoutYear: number;
  companyName: string;
  role: string;
  companyLocation: string;
  email: string;
  linkedin?: string;
}

export default function AlumniDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [alumniData, setAlumniData] = useState<Alumni[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>(""); // State for user role
  const alumniPerPage = 6;

  useEffect(() => {
    // Fetch user role from localStorage
    const role = localStorage.getItem("role") || "";
    setUserRole(role);

    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/get_alumni_paginated?page=${currentPage}&limit=${alumniPerPage}&search=${searchTerm}&year=${selectedYear}`,
          { credentials: "include" } // Include credentials for authentication
        );
        const data = await response.json();

        if (response.ok) {
          setAlumniData(data.alumni);
          setTotalPages(data.pages);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [currentPage, searchTerm, selectedYear]);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToPage = (page: number) => setCurrentPage(page);

  const handleDownloadAlumni = async () => {
    try {
      // Fetch all alumni data without pagination for download
      const response = await fetch("/api/get_alumni", { credentials: "include" });
      const data = await response.json();

      if (response.ok) {
        const worksheetData = data.map((alumni: Alumni) => ({
          Name: alumni.name,
          "Engineering Type": alumni.engineeringType,
          "Passout Year": alumni.passoutYear,
          Role: alumni.role,
          "Company Name": alumni.companyName,
          "Company Location": alumni.companyLocation,
          Email: alumni.email,
          "LinkedIn": alumni.linkedin || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Alumni");
        XLSX.writeFile(workbook, "Alumni_List.xlsx");
      } else {
        console.error("Failed to fetch all alumni:", data.message);
      }
    } catch (error) {
      console.error("Error downloading alumni:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <motion.h1
            className="text-4xl font-bold text-center text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Alumni Directory
          </motion.h1>
          {userRole === "faculty" && (
            <motion.button
              onClick={handleDownloadAlumni}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Alumni
            </motion.button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <motion.div
            className="relative w-full sm:w-2/3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or course..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full shadow-md border-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <motion.select
            className="w-full sm:w-1/4 px-4 py-3 bg-white rounded-full shadow-md border-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <option value="all">All Years</option>
            {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i)
              .reverse()
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </motion.select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-600 animate-pulse">
            Loading alumni...
          </div>
        )}

        {/* Alumni Grid */}
        {!loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {alumniData.map((alumni) => (
              <motion.div
                key={alumni._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-500 transform transition-all duration-300 hover:shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                  <img
                    src={alumni.profileImage}
                    alt={alumni.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white mx-auto transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 text-center">
                    {alumni.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mt-1">
                    {alumni.engineeringType} • {alumni.passoutYear}
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-center text-sm text-gray-700">
                      <Building2 className="h-5 w-5 mr-2 text-indigo-500" />
                      <span>
                        {alumni.role} at {alumni.companyName}
                      </span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                      <span>{alumni.companyLocation}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center gap-4">
                    <motion.a
                      href={`mailto:${alumni.email}`}
                      className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Mail className="h-5 w-5" />
                    </motion.a>
                    {alumni.linkedin && (
                      <motion.a
                        href={alumni.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors duration-300"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Linkedin className="h-5 w-5" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <motion.button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous
            </motion.button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-full shadow-md transition-all duration-300 ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-indigo-50"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          </div>
        )}

        {/* No Results */}
        {!loading && alumniData.length === 0 && (
          <motion.div
            className="mt-12 text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No alumni found matching your criteria.
          </motion.div>
        )}
      </div>
    </div>
  );
}