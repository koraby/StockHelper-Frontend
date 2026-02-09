'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { IndustrySummary } from '@/types/stock';
import { formatDiff, getDiffColorClass, cn } from '@/lib/utils';

interface IndustrySummaryCardProps {
  summaries: IndustrySummary[];
  title?: string;
}

export default function IndustrySummaryCard({
  summaries,
  title = '產業別統計',
}: IndustrySummaryCardProps) {
  if (summaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">尚無資料</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {summaries.map((summary) => (
            <div
              key={summary.industry}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {summary.industry}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {summary.stockCount} 檔股票
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-xl font-bold',
                      getDiffColorClass(summary.avgDiff)
                    )}
                  >
                    {formatDiff(summary.avgDiff)}
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="text-green-600">
                      ↑ {summary.positiveCount}
                    </span>
                    <span className="text-red-600">
                      ↓ {summary.negativeCount}
                    </span>
                  </div>
                </div>
              </div>
              {/* 進度條 */}
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden flex">
                {summary.stockCount > 0 && (
                  <>
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(summary.positiveCount / summary.stockCount) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${(summary.negativeCount / summary.stockCount) * 100}%`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
