'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { PriceDiffTable, PriceDiffChart, IndustrySummaryCard } from '@/components/stock';
import { useStockDiff } from '@/hooks/useStockDiff';
import { MARKET_OVERVIEW_STOCKS, getMarketSymbols } from '@/data/preset-stocks';
import { QueryParams } from '@/types/stock';
import {
  formatDate,
  getLastTradingDay,
  DEFAULT_TIME1,
  DEFAULT_TIME2,
  calculateIndustrySummary,
  calculateOverallAvgDiff,
  formatDiff,
  getDiffColorClass,
  cn,
} from '@/lib/utils';

export default function MarketPage() {
  const { mutate, data, isPending, isError, error } = useStockDiff();
  const [date, setDate] = useState(formatDate(getLastTradingDay()));
  const [time1, setTime1] = useState(DEFAULT_TIME1);
  const [time2, setTime2] = useState(DEFAULT_TIME2);
  const [autoLoaded, setAutoLoaded] = useState(false);

  // 自動載入
  useEffect(() => {
    if (!autoLoaded) {
      handleQuery();
      setAutoLoaded(true);
    }
  }, []);

  const handleQuery = () => {
    mutate({
      symbols: getMarketSymbols(),
      date,
      time1,
      time2,
    });
  };

  const industrySummaries = data ? calculateIndustrySummary(data) : [];
  const overallAvgDiff = data ? calculateOverallAvgDiff(data) : 0;
  const validData = data?.filter((d) => d.diff !== null) || [];
  const positiveCount = validData.filter((d) => (d.diff || 0) > 0).length;
  const negativeCount = validData.filter((d) => (d.diff || 0) < 0).length;
  const maxDiff = validData.length > 0 ? Math.max(...validData.map((d) => d.diff || 0)) : 0;
  const minDiff = validData.length > 0 ? Math.min(...validData.map((d) => d.diff || 0)) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">整體台股分析</h1>
        <p className="text-gray-600">
          透過 {MARKET_OVERVIEW_STOCKS.length} 檔代表性股票，分析整體市場在指定時間的表現
        </p>
      </div>

      {/* 查詢條件 */}
      <Card>
        <CardHeader>
          <CardTitle>查詢條件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 預設股票清單 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">預設股票清單</span>（{MARKET_OVERVIEW_STOCKS.length} 檔）：
              </p>
              <div className="flex flex-wrap gap-2">
                {MARKET_OVERVIEW_STOCKS.map((stock) => (
                  <span
                    key={stock.symbol}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-white border border-gray-200"
                  >
                    <span className="font-medium text-gray-900">
                      {stock.symbol.replace('.TW', '')}
                    </span>
                    <span className="ml-1 text-gray-500">{stock.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 時間設定 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  查詢日期
                </label>
                <input
                  type="date"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  時間1
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                >
                  {Array.from({ length: 28 }, (_, i) => {
                    const hour = 9 + Math.floor(i / 6);
                    const minute = (i % 6) * 10;
                    if (hour === 13 && minute > 30) return null;
                    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  時間2
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                >
                  {Array.from({ length: 28 }, (_, i) => {
                    const hour = 9 + Math.floor(i / 6);
                    const minute = (i % 6) * 10;
                    if (hour === 13 && minute > 30) return null;
                    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleQuery} loading={isPending}>
                查詢市場差價
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 錯誤訊息 */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">查詢失敗: {error.message}</p>
        </div>
      )}

      {/* 載入中 */}
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

      {/* 無資料提示 */}
      {data && data.length > 0 && validData.length === 0 && !isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <span className="font-semibold">提示：</span> 該日期 ({date}) 無交易資料，可能是假日或資料尚未更新。請選擇其他交易日查詢。
          </p>
        </div>
      )}

      {/* 統計摘要 */}
      {data && data.length > 0 && validData.length > 0 && !isPending && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">整體平均差價</p>
                  <p className={cn('text-2xl font-bold', getDiffColorClass(overallAvgDiff))}>
                    {formatDiff(overallAvgDiff)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">上漲</p>
                  <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">下跌</p>
                  <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">最大漲幅</p>
                  <p className="text-2xl font-bold text-green-600">{formatDiff(maxDiff)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">最大跌幅</p>
                  <p className="text-2xl font-bold text-red-600">{formatDiff(minDiff)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 產業統計 */}
          <IndustrySummaryCard summaries={industrySummaries} title="產業別統計" />

          {/* 詳細資料 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PriceDiffTable data={data} title="所有股票明細" showIndustry={true} />
            <PriceDiffChart data={data} title="差價排行圖" />
          </div>
        </>
      )}

      {/* 有查詢但無有效資料時，仍顯示明細表 */}
      {data && data.length > 0 && validData.length === 0 && !isPending && (
        <PriceDiffTable data={data} title="查詢結果（無交易資料）" showIndustry={true} />
      )}
    </div>
  );
}
