"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_PATIENTS, type Patient } from '@/lib/mockData';
import { PatientModal } from './PatientModal';
import { motion } from 'framer-motion';

const COLUMNS_FOR_FILTER = [
    'age', 'bmi', 'hba1c', 'glucose_random', 'sbp_mean', 'dbp_mean', 'hr_mean'
];

export function PatientTable() {
    const [search, setSearch] = useState('');
    const [filterCol, setFilterCol] = useState('bmi');
    const [filterVal, setFilterVal] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8; // Small page size for "Clean" look

    const filteredPatients = useMemo(() => {
        return MOCK_PATIENTS.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toLowerCase().includes(search.toLowerCase());

            let matchesFilter = true;
            if (filterVal) {
                const val = parseFloat(filterVal);
                if (!isNaN(val)) {
                    // Default to Greater Than for demo
                    const patientVal = p[filterCol as keyof Patient];
                    if (typeof patientVal === 'number') {
                        matchesFilter = patientVal > val;
                    }
                }
            }

            return matchesSearch && matchesFilter;
        });
    }, [search, filterCol, filterVal]);

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const paginatedPatients = filteredPatients.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Name or ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500 whitespace-nowrap">Show where</span>
                    <select
                        value={filterCol}
                        onChange={e => setFilterCol(e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {COLUMNS_FOR_FILTER.map(col => (
                            <option key={col} value={col}>{col.toUpperCase().replace('_', ' ')}</option>
                        ))}
                    </select>
                    <span className="text-sm text-slate-500">is &gt;</span>
                    <input
                        type="number"
                        placeholder="Value..."
                        value={filterVal}
                        onChange={e => setFilterVal(e.target.value)}
                        className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Patient ID</th>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Age</th>
                            <th className="px-6 py-3 font-medium">Sex</th>
                            <th className="px-6 py-3 font-medium">Risk Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedPatients.length > 0 ? (
                            paginatedPatients.map((patient) => {
                                const isCritical = patient.hypoglycemia || patient.hyperglycemia || patient.bmi > 30;
                                return (
                                    <motion.tr
                                        key={patient.id}
                                        className="hover:bg-slate-50/80 transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">{patient.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{patient.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{patient.age}</td>
                                        <td className="px-6 py-4 text-slate-600">{patient.sex}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCritical ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                {isCritical ? 'Need Attention' : 'Stable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedPatient(patient)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                            >
                                                <Eye className="h-3 w-3" /> View
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No patients found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                <p className="text-sm text-slate-500">
                    Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(page * itemsPerPage, filteredPatients.length)}</span> of {filteredPatients.length} patients
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <PatientModal
                isOpen={!!selectedPatient}
                onClose={() => setSelectedPatient(null)}
                patient={selectedPatient}
            />
        </div>
    );
}
