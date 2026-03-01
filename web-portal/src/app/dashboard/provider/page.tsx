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
                const [apptsRes, recsRes] = await Promise.all([
                    axios.get("http://localhost:5233/api/appointments", config),
                    axios.get("http://localhost:5233/api/medicalrecords", config)
                ]);
                setAppointments(apptsRes.data);
                setRecords(recsRes.data);
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
                                placeholder="Search patient by name or ID..."
                                className="w-full rounded-lg border-zinc-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                            />
                        </div>
                        <p className="text-sm text-zinc-500 italic mb-4">Use the search bar to find a patient.</p>

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

                </div>
            </main>
        </div>
    );
}
