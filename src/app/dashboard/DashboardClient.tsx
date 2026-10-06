'use client'

import { ShieldAlert, FileWarning, Activity, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function DashboardClient({ userName }: { userName: string }) {
  // Hardcoded synthetic data for Phase 1 Demo
  const readiness = 82
  const expiringCount = 3
  const missingCount = 2

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Good morning, {userName.split(' ')[0] || 'User'}.
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Here is your document intelligence summary.
          </p>
        </div>
        <div>
          <Link
            href="/office-mode"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            <Briefcase className="h-5 w-5" />
            OFFICE MODE
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Readiness Score */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-50 p-3">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500">Document Readiness</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold text-slate-900">{readiness}%</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${readiness}%` }}></div>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-amber-50 p-3">
                <ShieldAlert className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500">Expiring Soon</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold text-slate-900">{expiringCount} <span className="text-sm font-medium text-slate-500 ml-1">documents</span></div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/vault?filter=expiring" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Review documents &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Missing Documents */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-red-50 p-3">
                <FileWarning className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-slate-500">Missing Documents</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-bold text-slate-900">{missingCount} <span className="text-sm font-medium text-slate-500 ml-1">applications</span></div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/workflows" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Resolve requirements &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action / Recent Activity placeholder */}
      <section className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 mt-8">
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-slate-500">No recent activity. Start by configuring a new workflow or heading to Office Mode.</p>
        </div>
      </section>
    </div>
  )
}
