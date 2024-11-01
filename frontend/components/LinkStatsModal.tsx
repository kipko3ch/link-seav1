'use client'
import React from 'react'
import type { LinkStats } from '@/types/analytics'

interface LinkStatsModalProps {
  stats: LinkStats;
  onClose: () => void;
}

export default function LinkStatsModal({ stats, onClose }: LinkStatsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Link Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{stats.title}</h3>
            <a
              href={stats.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {stats.url}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {stats.total_clicks}
              </div>
              <div className="text-sm text-blue-700">Total Clicks</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {stats.unique_visitors}
              </div>
              <div className="text-sm text-blue-700">Unique Visitors</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {((stats.unique_visitors / stats.total_clicks) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700">Unique Click Rate</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Click History</h3>
            <div className="space-y-2">
              {stats.click_history.map((click, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded flex justify-between items-center"
                >
                  <div className="text-sm">
                    {new Date(click.clicked_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {click.referrer || 'Direct Visit'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 