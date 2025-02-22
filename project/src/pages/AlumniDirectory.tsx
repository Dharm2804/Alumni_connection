import { useState, useEffect } from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [alumniData, setAlumniData] = useState<Alumni[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const alumniPerPage = 6;

  // Fetch alumni data from backend
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/get_alumni_paginated?page=${currentPage}&limit=${alumniPerPage}&search=${searchTerm}&year=${selectedYear}`
        );
        const data = await response.json();
        
        if (response.ok) {
          setAlumniData(data.alumni);
          setTotalPages(data.pages);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching alumni:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [currentPage, searchTerm, selectedYear]);

  // Pagination handlers
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page: number) => setCurrentPage(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Alumni Directory</h1>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative w-full sm:w-2/3 transition-all duration-300 hover:scale-105">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or course..."
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3 transition-all duration-300 hover:scale-105">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">All Years</option>
            {[2020, 2019, 2018, 2017].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500">Loading alumni...</div>
      )}

      {/* Alumni Grid */}
      {!loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alumniData.map((alumni) => (
            <div
              key={alumni._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-500 hover:bg-indigo-50 hover:shadow-md hover:scale-105 group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 flex-nowrap group-hover:flex-col group-hover:items-center group-hover:text-center transition-all duration-500">
                  <img
                    src={alumni.profileImage}
                    alt={alumni.name}
                    className="h-16 w-16 rounded-full object-cover flex-shrink-0 transition-all duration-500 group-hover:h-20 group-hover:w-20"
                  />
                  <div className="transition-all duration-500 group-hover:mt-3">
                    <h3 className="text-lg font-semibold text-gray-900">{alumni.name}</h3>
                    <p className="text-sm text-gray-500">
                      {alumni.engineeringType}, {alumni.passoutYear}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="h-4 w-4 mr-2" />
                    {alumni.companyName} - {alumni.role}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {alumni.companyLocation}
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <a
                    href={`mailto:${alumni.email}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
                  >
                    Email
                  </a>
                  {alumni.linkedin && (
                    <a
                      href={alumni.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Show message if no results */}
      {!loading && alumniData.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          No alumni found matching your criteria.
        </div>
      )}
    </div>
  );
}