"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ProviderDashboard() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState("");
    const [appointments, setAppointments] = useState<any[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [refills, setRefills] = useState<any[]>([]);
    const [patientIdInput, setPatientIdInput] = useState("");
    const [patientInsights, setPatientInsights] = useState<{ symptoms: any[], vitals: any[] } | null>(null);

    // Patient Search State
    const [patientSearchQuery, setPatientSearchQuery] = useState("");
    const [patientSearchResults, setPatientSearchResults] = useState<any[]>([]);
    const [isSearchingPatients, setIsSearchingPatients] = useState(false);

    // Prescription Modal State
    const [showRxModal, setShowRxModal] = useState(false);
    const [rxPatientId, setRxPatientId] = useState("");
    const [rxMedication, setRxMedication] = useState("");
    const [rxDosage, setRxDosage] = useState("");
    const [rxInstructions, setRxInstructions] = useState("");
    const [rxRefills, setRxRefills] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const email = localStorage.getItem("userEmail") || "Provider";
        setUserEmail(email);

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [apptsRes, recsRes, refillsRes] = await Promise.all([
                    axios.get("http://localhost:5233/api/appointments", config),
                    axios.get("http://localhost:5233/api/medicalrecords", config),
                    axios.get("http://localhost:5233/api/refillrequests", config).catch(() => ({ data: [] }))
                ]);
                setAppointments(apptsRes.data);
                setRecords(recsRes.data);
                setRefills(refillsRes.data);
            } catch (err) {
                console.error("Failed to fetch provider dashboard data", err);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        router.push("/");
    };

    const fetchInsights = async () => {
        if (!patientIdInput) return;
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [sympRes, vitalsRes] = await Promise.all([
                axios.get(`http://localhost:5233/api/symptoms?patientId=${patientIdInput}`, config),
                axios.get(`http://localhost:5233/api/vitals?patientId=${patientIdInput}`, config)
            ]);
            setPatientInsights({
                symptoms: sympRes.data,
                vitals: vitalsRes.data
            });
        } catch (err) {
            console.error("Failed to fetch insights", err);
            alert("No insights found for this patient ID, or unauthorized.");
        }
    };

    const handleSearchPatients = async (query: string) => {
        setPatientSearchQuery(query);
        if (!query.trim()) {
            setPatientSearchResults([]);
            return;
        }

        setIsSearchingPatients(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5233/api/patients/search?query=${encodeURIComponent(query)}`, config);
            setPatientSearchResults(res.data);
        } catch (err) {
            console.error("Failed to search patients", err);
        } finally {
            setIsSearchingPatients(false);
        }
    };

    const handleWritePrescription = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post("http://localhost:5233/api/prescriptions", {
                PatientProfileId: parseInt(rxPatientId, 10),
                MedicationName: rxMedication,
                Dosage: rxDosage,
                Instructions: rxInstructions,
                RefillsRemaining: rxRefills
            }, config);

            if (res.data.interactionsWarning) {
                alert(res.data.interactionsWarning);
            } else {
                alert("Prescription written successfully!");
            }
            setShowRxModal(false);
            window.location.reload();
        } catch (e) {
            alert("Error writing prescription. Ensure Patient ID is valid.");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <nav className="bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Provider Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-indigo-100">{userEmail}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-white hover:text-indigo-200"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Workspace</h2>
                    <button onClick={() => setShowRxModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 font-medium">+ Write Prescription</button>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Today's Schedule */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Today's Schedule</h2>
                        </div>
                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <p className="text-sm text-zinc-500 italic">No appointments scheduled for today.</p>
                            ) : (
                                appointments.map((appt: any) => (
                                    <div key={appt.id} className="rounded-lg border border-zinc-100 p-4 dark:border-zinc-800 flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-zinc-900 dark:text-white block">Patient: {appt.patientName}</span>
                                            <p className="text-sm text-zinc-500 mt-1">{new Date(appt.scheduledTime).toLocaleString()} - {appt.status}</p>
                                        </div>
                                        {appt.videoCallLink && (
                                            <a
                                                href={appt.videoCallLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                                    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 1.818a1.5 1.5 0 00-2.19.006l-1.5 1.5A1.5 1.5 0 0015.75 4.38v15.24a1.5 1.5 0 00.5 1.056l1.5 1.5a1.5 1.5 0 002.19.006A1.5 1.5 0 0021 21.111V2.889a1.5 1.5 0 00-1.06-1.071z" />
                                                </svg>
                                                Join Call
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Patient Directory */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Patient Records</h2>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search patient by name or email..."
                                value={patientSearchQuery}
                                onChange={(e) => handleSearchPatients(e.target.value)}
                                className="w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                            {isSearchingPatients && <div className="absolute right-3 top-2.5 text-xs text-zinc-400">Searching...</div>}

                            {/* Search Results Dropdown */}
                            {patientSearchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 rounded-md shadow-lg border border-zinc-200 dark:border-zinc-700 max-h-60 overflow-y-auto">
                                    {patientSearchResults.map(patient => (
                                        <div key={patient.id} className="p-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-sm text-zinc-900 dark:text-white">{patient.firstName} {patient.lastName}</div>
                                                <div className="text-xs text-zinc-500">{patient.email}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800/50">
                                                    ID: {patient.id}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(patient.id.toString());
                                                        // Automatically populate the prescription modal if we pop it open later
                                                        setRxPatientId(patient.id.toString());
                                                        setPatientIdInput(patient.id.toString());
                                                    }}
                                                    className="text-xs cursor-pointer text-blue-600 hover:text-blue-500"
                                                    title="Copy ID to Clipboard & Auto-fill forms"
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 italic mb-4">Search to get a Patient's ID for Prescriptions and Insights.</p>

                        {records.length > 0 && (
                            <div className="space-y-3 mt-4">
                                <h3 className="text-md font-medium text-zinc-800 dark:text-zinc-200">Recent Encrypted Records</h3>
                                {records.map((rec: any) => (
                                    <div key={rec.id} className="border-l-2 border-indigo-500 pl-4 py-2">
                                        <p className="font-medium text-zinc-900 dark:text-white">Patient: {rec.patientName}</p>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300"><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                                        {rec.decryptedNotes && (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 italic">"{rec.decryptedNotes}"</p>
                                        )}
                                        <p className="text-xs text-zinc-400 mt-1">{new Date(rec.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Refill Requests */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Action Needed: Refill Requests</h2>
                        {refills.length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No pending refill requests.</p>
                        ) : (
                            <div className="space-y-4">
                                {refills.filter((r: any) => r.status === 'Requested').map((req: any) => (
                                    <div key={req.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-white">{req.patientName}</p>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{req.medicationName}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{new Date(req.requestedDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-500">Approve</button>
                                            <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500">Deny</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Patient Insights Panel */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-2">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Patient Health Insights</h2>
                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Enter Patient ID (e.g. 1)"
                                value={patientIdInput}
                                onChange={(e) => setPatientIdInput(e.target.value)}
                                className="flex-1 rounded-lg border-zinc-300 py-2 pl-3 px-4 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                            <button onClick={fetchInsights} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 font-medium">Load Insights</button>
                        </div>

                        {patientInsights && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-md font-medium text-zinc-800 dark:text-zinc-200 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">Recent Symptoms</h3>
                                    {patientInsights.symptoms.length === 0 ? (
                                        <p className="text-sm text-zinc-500 italic">No symptoms logged.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {patientInsights.symptoms.map((sym: any) => (
                                                <li key={sym.id} className="text-sm border-l-4 border-orange-400 pl-3">
                                                    <p className="font-semibold text-zinc-900 dark:text-white">{sym.symptom} <span className="font-normal text-zinc-500">(Severity: {sym.severity}/10)</span></p>
                                                    <p className="text-zinc-500 text-xs mt-1">{new Date(sym.date).toLocaleDateString()} - {sym.notes || 'No notes'}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-md font-medium text-zinc-800 dark:text-zinc-200 mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2">Recent Vitals</h3>
                                    {patientInsights.vitals.length === 0 ? (
                                        <p className="text-sm text-zinc-500 italic">No vitals logged.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {patientInsights.vitals.map((v: any) => (
                                                <li key={v.id} className="text-sm border-l-4 border-blue-400 pl-3">
                                                    <p className="text-zinc-900 dark:text-white">BP: <span className="font-semibold">{v.bloodPressure || 'N/A'}</span>, HR: <span className="font-semibold">{v.heartRate || 'N/A'}</span></p>
                                                    <p className="text-zinc-500 text-xs mt-1">{new Date(v.date).toLocaleDateString()}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Write Prescription Modal */}
                {showRxModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Write Prescription</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Patient Profile ID</label>
                                    <input type="number" placeholder="e.g. 1" value={rxPatientId} onChange={e => setRxPatientId(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                    <p className="text-xs text-zinc-500 mt-1">Found via Patient Records search.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Medication Name</label>
                                    <input type="text" placeholder="e.g. Lisinopril" value={rxMedication} onChange={e => setRxMedication(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Dosage</label>
                                    <input type="text" placeholder="e.g. 10mg once daily" value={rxDosage} onChange={e => setRxDosage(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Instructions</label>
                                    <input type="text" placeholder="e.g. Take with food" value={rxInstructions} onChange={e => setRxInstructions(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Refills Allowed</label>
                                    <input type="number" min="0" value={rxRefills} onChange={e => setRxRefills(parseInt(e.target.value))} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setShowRxModal(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
                                    <button onClick={handleWritePrescription} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500">Sign & Prescribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
