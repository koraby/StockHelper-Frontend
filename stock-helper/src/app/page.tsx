'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { PriceDiffChart, IndustrySummaryCard } from '@/components/stock';
import { useStockDiff } from '@/hooks/useStockDiff';
import { getMarketSymbols } from '@/data/preset-stocks';
import { formatDate, getLastTradingDay, DEFAULT_TIME1, DEFAULT_TIME2, calculateIndustrySummary, calculateOverallAvgDiff, formatDiff, getDiffColorClass } from '@/lib/utils';
import { cn } from '@/lib/utils';

const features = [
  {
    href: '/individual',
    title: '個股查詢',
    description: '查詢特定股票在指定時間的價格差異',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: '/industry',
    title: '產業別分類',
    description: '依產業類別分析股票差價表現',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: '/market',
    title: '整體台股',
    description: '查看整體市場在指定時間的表現',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { mutate, data, isPending, isError, error } = useStockDiff();
  const [hasLoaded, setHasLoaded] = useState(false);

  // 首頁自動載入市場概覽
  useEffect(() => {
    if (!hasLoaded) {
      const symbols = getMarketSymbols();
      mutate({
        symbols,
        date: formatDate(getLastTradingDay()),
        time1: DEFAULT_TIME1,
        time2: DEFAULT_TIME2,
      });
      setHasLoaded(true);
    }
  }, [hasLoaded, mutate]);

  const overallAvgDiff = data ? calculateOverallAvgDiff(data) : 0;
  const industrySummaries = data ? calculateIndustrySummary(data) : [];
  const validData = data?.filter((d) => d.diff !== null) || [];
  const positiveCount = validData.filter((d) => (d.diff || 0) > 0).length;
  const negativeCount = validData.filter((d) => (d.diff || 0) < 0).length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          台股差價分析系統
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          快速分析台股在不同時間點的價格差異，支援個股查詢、產業別分類及整體市場分析
        </p>
      </div>

      {/* 無資料提示 */}
      {data && !isError && validData.length === 0 && !isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <span className="font-semibold">提示：</span> 該日期 ({formatDate(getLastTradingDay())}) 無交易資料，可能是假日或資料尚未更新。請前往各功能頁面選擇其他交易日查詢。
          </p>
        </div>
      )}

      {/* Quick Stats - 只在有有效資料時顯示 */}
      {data && !isError && validData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">整體平均差價</p>
                <p className={cn('text-3xl font-bold', getDiffColorClass(overallAvgDiff))}>
                  {formatDiff(overallAvgDiff)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {DEFAULT_TIME1} → {DEFAULT_TIME2}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">上漲 / 下跌</p>
                <p className="text-3xl font-bold">
                  <span className="text-green-600">{positiveCount}</span>
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-red-600">{negativeCount}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  共 {data.length} 檔股票
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">查詢日期</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatDate(getLastTradingDay())}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  最近交易日
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isPending && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">載入市場資料中...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">載入失敗: {error.message}</p>
              <Button onClick={() => {
                const symbols = getMarketSymbols();
                mutate({
                  symbols,
                  date: formatDate(getLastTradingDay()),
                  time1: DEFAULT_TIME1,
                  time2: DEFAULT_TIME2,
                });
              }}>
                重新載入
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="py-6">
                <div className="flex flex-col items-center text-center">
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Market Overview - 只在有有效資料時顯示 */}
      {data && !isError && validData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IndustrySummaryCard summaries={industrySummaries} title="產業別表現" />
          <PriceDiffChart data={data} title="個股差價排行" />
        </div>
      )}
    </div>
  );
}
