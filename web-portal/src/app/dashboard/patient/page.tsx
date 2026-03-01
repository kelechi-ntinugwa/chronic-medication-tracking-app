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
                const [apptsRes, rxRes, recsRes] = await Promise.all([
                    axios.get("http://localhost:5233/api/appointments", config),
                    axios.get("http://localhost:5233/api/prescriptions", config),
                    axios.get("http://localhost:5233/api/medicalrecords", config)
                ]);
                setAppointments(apptsRes.data);
                setPrescriptions(rxRes.data);
                setRecords(recsRes.data);
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
                            <p><span className="font-medium text-zinc-900 dark:text-zinc-200">DOB:</span> Not set</p>
                            <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Blood Type:</span> Not set</p>
                        </div>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Active Prescriptions</h2>
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
                            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Book New</button>
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

                </div>
            </main>
        </div>
    );
}
