'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StockDiffResponse } from '@/types/stock';
import { formatDiff, formatPrice, getDiffColorClass, cn } from '@/lib/utils';
import { getStockBySymbol } from '@/data/industries';

interface PriceDiffTableProps {
  data: StockDiffResponse[];
  title?: string;
  showIndustry?: boolean;
}

export default function PriceDiffTable({
  data,
  title = '差價明細',
  showIndustry = true,
}: PriceDiffTableProps) {
  if (data.length === 0) {
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

  // 依差價排序
  const sortedData = [...data].sort((a, b) => {
    if (a.diff === null) return 1;
    if (b.diff === null) return -1;
    return b.diff - a.diff;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  股票代碼
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  名稱
                </th>
                {showIndustry && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    產業
                  </th>
                )}
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  時間1價格
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  時間2價格
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                  差價
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((item, index) => {
                const stock = getStockBySymbol(item.symbol);
                const hasError = item.error !== null;

                return (
                  <tr
                    key={`${item.symbol}-${index}`}
                    className={cn(
                      'hover:bg-gray-50 transition-colors',
                      hasError && 'bg-red-50'
                    )}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.symbol.replace('.TW', '')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {stock?.name || '-'}
                    </td>
                    {showIndustry && (
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {stock?.industry || '-'}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {formatPrice(item.open_1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {formatPrice(item.open_2)}
                    </td>
                    <td
                      className={cn(
                        'px-4 py-3 text-sm font-semibold text-right',
                        getDiffColorClass(item.diff)
                      )}
                    >
                      {formatDiff(item.diff)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {hasError ? (
                        <span className="text-red-600">{item.error}</span>
                      ) : item.diff === null ? (
                        <span className="text-yellow-600">無資料</span>
                      ) : (
                        <span className="text-green-600">✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
