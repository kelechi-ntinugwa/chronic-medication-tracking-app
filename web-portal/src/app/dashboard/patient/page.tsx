"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function PatientDashboard() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState("");
    const [appointments, setAppointments] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [adherence, setAdherence] = useState<any[]>([]);
    const [symptoms, setSymptoms] = useState<any[]>([]);
    const [refills, setRefills] = useState<any[]>([]);
    const [emergencyProfile, setEmergencyProfile] = useState<any>({});

    // Modals state
    const [showApptModal, setShowApptModal] = useState(false);
    const [apptDate, setApptDate] = useState("");
    const [apptProvider, setApptProvider] = useState("");

    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [symptomName, setSymptomName] = useState("");
    const [symptomSeverity, setSymptomSeverity] = useState(1);

    const [showRefillModal, setShowRefillModal] = useState(false);
    const [refillPrescriptionId, setRefillPrescriptionId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const email = localStorage.getItem("userEmail") || "Patient";
        setUserEmail(email);

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [apptsRes, rxRes, recsRes, adherenceRes, sympRes, refillsRes, emRes] = await Promise.all([
                    axios.get("http://localhost:5233/api/appointments", config),
                    axios.get("http://localhost:5233/api/prescriptions", config),
                    axios.get("http://localhost:5233/api/medicalrecords", config),
                    axios.get("http://localhost:5233/api/adherencelogs", config).catch(() => ({ data: [] })),
                    axios.get("http://localhost:5233/api/symptoms", config).catch(() => ({ data: [] })),
                    axios.get("http://localhost:5233/api/refillrequests", config).catch(() => ({ data: [] })),
                    axios.get("http://localhost:5233/api/emergencyprofile", config).catch(() => ({ data: {} }))
                ]);
                setAppointments(apptsRes.data);
                setPrescriptions(rxRes.data);
                setRecords(recsRes.data);
                setAdherence(adherenceRes.data);
                setSymptoms(sympRes.data);
                setRefills(refillsRes.data);
                setEmergencyProfile(emRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        router.push("/");
    };

    const handleBookAppointment = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post("http://localhost:5233/api/appointments", {
                ProviderUserId: apptProvider || "provider-demo-id",
                ScheduledTime: new Date(apptDate).toISOString()
            }, config);
            setShowApptModal(false);
            window.location.reload(); // Refresh data
        } catch (e) {
            alert("Error booking appointment");
        }
    };

    const handleLogSymptom = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post("http://localhost:5233/api/symptoms", {
                Symptom: symptomName,
                Severity: symptomSeverity,
                Date: new Date().toISOString()
            }, config);
            setShowSymptomModal(false);
            window.location.reload();
        } catch (e) {
            alert("Error logging symptom");
        }
    };

    const handleRequestRefill = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post("http://localhost:5233/api/refillrequests", {
                PrescriptionId: parseInt(refillPrescriptionId, 10),
                RequestedDate: new Date().toISOString()
            }, config);
            setShowRefillModal(false);
            window.location.reload();
        } catch (e) {
            alert("Error requesting refill");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <nav className="bg-white px-4 py-4 shadow-sm dark:bg-zinc-950 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Patient Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{userEmail}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* Digital Medical Card */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Digital Medical Card</h2>
                        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Name:</span> {userEmail}</p>
                            <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Blood Type:</span> {emergencyProfile.bloodType || 'Not set'}</p>
                            <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Allergies:</span> {emergencyProfile.allergies || 'None listed'}</p>
                        </div>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Active Prescriptions</h2>
                            <button onClick={() => setShowRefillModal(true)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Request Refill</button>
                        </div>
                        {prescriptions.length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No active prescriptions.</p>
                        ) : (
                            <div className="space-y-4">
                                {prescriptions.map((rx: any) => (
                                    <div key={rx.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0">
                                        <p className="font-medium text-zinc-900 dark:text-white">{rx.medicationName} <span className="text-sm font-normal text-zinc-500">({rx.dosage})</span></p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{rx.instructions}</p>
                                        <p className="text-xs text-zinc-400 mt-1">Prescribed by: {rx.providerName}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Appointments</h2>
                            <button onClick={() => setShowApptModal(true)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Book New</button>
                        </div>
                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <p className="text-sm text-zinc-500 italic">No upcoming appointments.</p>
                            ) : (
                                appointments.map((appt: any) => (
                                    <div key={appt.id} className="rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-zinc-900 dark:text-white">{appt.providerName}</span>
                                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">{appt.status}</span>
                                        </div>
                                        <p className="text-sm text-zinc-500 mt-1 mb-3">{new Date(appt.scheduledTime).toLocaleString()}</p>
                                        {appt.videoCallLink && (
                                            <a
                                                href={appt.videoCallLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 w-full"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                                                    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 1.818a1.5 1.5 0 00-2.19.006l-1.5 1.5A1.5 1.5 0 0015.75 4.38v15.24a1.5 1.5 0 00.5 1.056l1.5 1.5a1.5 1.5 0 002.19.006A1.5 1.5 0 0021 21.111V2.889a1.5 1.5 0 00-1.06-1.071z" />
                                                </svg>
                                                Join Video Call
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Adherence & Reminders */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Adherence Logs</h2>
                        {adherence.length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No recent adherence logs.</p>
                        ) : (
                            <div className="space-y-4">
                                {adherence.slice(0, 5).map((log: any) => (
                                    <div key={log.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0 flex justify-between">
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-white">{log.medicationName}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{new Date(log.scheduledTime).toLocaleString()}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${log.status === 'Taken' ? 'bg-green-50 text-green-600 dark:bg-green-900/30' : 'bg-red-50 text-red-600 dark:bg-red-900/30'}`}>
                                            {log.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Symptoms Log */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Symptoms</h2>
                            <button onClick={() => setShowSymptomModal(true)} className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline">Log Symptom</button>
                        </div>
                        {symptoms.length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No symptoms logged.</p>
                        ) : (
                            <div className="space-y-4">
                                {symptoms.slice(0, 5).map((sym: any) => (
                                    <div key={sym.id} className="border-l-4 border-orange-400 pl-3">
                                        <p className="font-medium text-zinc-900 dark:text-white">{sym.symptom} <span className="text-sm text-zinc-500">(Severity: {sym.severity}/10)</span></p>
                                        <p className="text-xs text-zinc-400 mt-1">{new Date(sym.date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Refill Requests */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Refill Requests</h2>
                        {refills.length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No recent refill requests.</p>
                        ) : (
                            <div className="space-y-4">
                                {refills.slice(0, 5).map((req: any) => (
                                    <div key={req.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0 flex justify-between">
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-white">{req.medicationName} ({req.dosage})</p>
                                            <p className="text-xs text-zinc-500 mt-1">{new Date(req.requestedDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-sm text-indigo-600 dark:text-indigo-400">{req.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Modals */}
                {showApptModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Book Appointment</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date & Time</label>
                                    <input type="datetime-local" value={apptDate} onChange={e => setApptDate(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Provider User ID</label>
                                    <input type="text" placeholder="UUID of Provider" value={apptProvider} onChange={e => setApptProvider(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setShowApptModal(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
                                    <button onClick={handleBookAppointment} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500">Book</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showSymptomModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Log Symptom</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Symptom Description</label>
                                    <input type="text" placeholder="e.g., Headache, Nausea" value={symptomName} onChange={e => setSymptomName(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Severity (1-10)</label>
                                    <input type="number" min="1" max="10" value={symptomSeverity} onChange={e => setSymptomSeverity(parseInt(e.target.value))} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setShowSymptomModal(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
                                    <button onClick={handleLogSymptom} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-500">Log Symptom</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showRefillModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Request Refill</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Select Prescription</label>
                                    <select value={refillPrescriptionId} onChange={e => setRefillPrescriptionId(e.target.value)} className="w-full border-zinc-300 rounded-lg p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
                                        <option value="">-- Choose --</option>
                                        {prescriptions.map((rx: any) => (
                                            <option key={rx.id} value={rx.id}>{rx.medicationName} ({rx.dosage})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setShowRefillModal(false)} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">Cancel</button>
                                    <button onClick={handleRequestRefill} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500">Request Refill</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
