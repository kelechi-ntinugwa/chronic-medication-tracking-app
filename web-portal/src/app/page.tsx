import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center py-16 px-8 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          Chronic Medication Portal
        </h1>
        <p className="mb-10 text-xl text-zinc-600 dark:text-zinc-300">
          Secure access for patients and healthcare providers.
        </p>

        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Patients</h2>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">Access your digital cards, track medication, and book telehealth visits.</p>
            <Link href="/login" className="block text-center w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
              Patient Login
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Providers</h2>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">View patient records, update prescriptions, and join video calls.</p>
            <Link href="/login" className="block text-center w-full rounded-md bg-zinc-800 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100">
              Provider Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
