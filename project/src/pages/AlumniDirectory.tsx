import React from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';
import type { Alumni } from '../types';

export default function AlumniDirectory() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState<string>('all');

  const mockAlumni: Alumni[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      graduationYear: 2020,
      course: 'Computer Science',
      currentCompany: 'Google',
      designation: 'Software Engineer',
      location: 'San Francisco, CA',
      email: 'sarah.j@example.com',
      linkedIn: 'linkedin.com/sarah-j',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: '2',
      name: 'Michael Chen',
      graduationYear: 2019,
      course: 'Electrical Engineering',
      currentCompany: 'Tesla',
      designation: 'Systems Engineer',
      location: 'Austin, TX',
      email: 'michael.c@example.com',
      linkedIn: 'linkedin.com/michael-c',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'
    },
    // Add more mock data as needed
  ];

  const filteredAlumni = mockAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || alumni.graduationYear.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
      
      {/* Search and Filter */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
  {/* Search Input */}
  <div className="relative w-full sm:w-2/3 transition-all duration-300 hover:scale-105">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-300 group-hover:text-indigo-500" />
    <input
      type="text"
      placeholder="Search by name or course..."
      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all duration-300 hover:shadow-md focus:shadow-lg"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Year Filter Dropdown */}
  <div className="w-full sm:w-1/3 transition-all duration-300 hover:scale-105">
    <select
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all duration-300 hover:shadow-md focus:shadow-lg"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      <option value="all">All Years</option>
      {[2020, 2019, 2018, 2017].map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
</div>


      {/* Alumni Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {filteredAlumni.map((alumni) => (
    <div
      key={alumni.id}
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-in-out hover:bg-indigo-50 hover:shadow-md hover:scale-105 group"
    >
      <div className="p-6">
        {/* Image container that moves on hover */}
        <div className="flex items-center gap-4 flex-nowrap group-hover:flex-col group-hover:items-center group-hover:text-center transition-all duration-500 ease-in-out">
          <img
            src={alumni.avatar}
            alt={alumni.name}
            className="h-16 w-16 rounded-full object-cover flex-shrink-0 transition-all duration-500 ease-in-out group-hover:h-20 group-hover:w-20"
          />
          <div className="transition-all duration-500 ease-in-out group-hover:mt-3">
            <h3 className="text-lg font-semibold text-gray-900">{alumni.name}</h3>
            <p className="text-sm text-gray-500">
              {alumni.course}, {alumni.graduationYear}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Building2 className="h-4 w-4 mr-2" />
            {alumni.currentCompany} - {alumni.designation}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {alumni.location}
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <a
            href={`mailto:${alumni.email}`}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300 ease-in-out"
          >
            Email
          </a>
          <a
            href={alumni.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300 ease-in-out"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}