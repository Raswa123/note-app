import Link from "next/link"

export default function DashboardHeader() {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-lg font-bold text-white"
                    >
                        N
                    </span>
                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        Note Hub
                    </span>
                </Link>
                <nav aria-label="Main navigation" className="ml-auto flex items-center gap-1 sm:gap-3">
                    <Link
                        href="/dashboard"
                        className="rounded-lg px-2 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:px-3 sm:text-sm"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/add"
                        className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 sm:px-4 sm:text-sm"
                    >
                        Add Note
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:text-sm"
                    >
                        LogOut
                    </Link>
                </nav>
            </div>
        </header>
    )
}
