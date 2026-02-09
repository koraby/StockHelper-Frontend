'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button, Select } from '@/components/ui';
import { QueryForm, PriceDiffTable, PriceDiffChart, IndustrySummaryCard } from '@/components/stock';
import { useStockDiff } from '@/hooks/useStockDiff';
import { INDUSTRIES, getIndustryByCode } from '@/data/industries';
import { QueryParams, IndustryCategory } from '@/types/stock';
import { formatDate, getLastTradingDay, DEFAULT_TIME1, DEFAULT_TIME2, calculateIndustrySummary } from '@/lib/utils';

export default function IndustryPage() {
  const { mutate, data, isPending, isError, error } = useStockDiff();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [date, setDate] = useState(formatDate(getLastTradingDay()));
  const [time1, setTime1] = useState(DEFAULT_TIME1);
  const [time2, setTime2] = useState(DEFAULT_TIME2);

  const industryOptions = [
    { value: '', label: '選擇產業類別' },
    { value: 'ALL', label: '全部產業（比較）' },
    ...INDUSTRIES.map((ind) => ({
      value: ind.code,
      label: `${ind.name} (${ind.stocks.length}檔)`,
    })),
  ];

  const handleQueryIndustry = () => {
    if (!selectedIndustry) {
      alert('請選擇產業類別');
      return;
    }

    let symbols: string[];

    if (selectedIndustry === 'ALL') {
      // 查詢所有產業的股票
      symbols = INDUSTRIES.flatMap((ind) => ind.stocks.map((s) => s.symbol));
    } else {
      const industry = getIndustryByCode(selectedIndustry);
      if (!industry) {
        alert('找不到該產業');
        return;
      }
      symbols = industry.stocks.map((s) => s.symbol);
    }

    mutate({
      symbols,
      date,
      time1,
      time2,
    });
  };

  const industrySummaries = data ? calculateIndustrySummary(data) : [];
  const currentIndustry = selectedIndustry && selectedIndustry !== 'ALL' 
    ? getIndustryByCode(selectedIndustry) 
    : null;
  const validData = data?.filter((d) => d.diff !== null) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">產業別分類查詢</h1>
        <p className="text-gray-600">
          依產業類別分析股票在指定時間點的差價表現
        </p>
      </div>

      {/* 查詢條件 */}
      <Card>
        <CardHeader>
          <CardTitle>查詢條件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              id="industry"
              label="產業類別"
              options={industryOptions}
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            />

            {currentIndustry && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">{currentIndustry.name}</span> 包含以下股票：
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentIndustry.stocks.map((stock) => (
                    <span
                      key={stock.symbol}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {stock.symbol.replace('.TW', '')} {stock.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
              <Button
                onClick={handleQueryIndustry}
                loading={isPending}
                disabled={!selectedIndustry}
              >
                查詢產業差價
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

      {/* 無資料提示 */}
      {data && data.length > 0 && validData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <span className="font-semibold">提示：</span> 該日期 ({date}) 無交易資料，可能是假日或資料尚未更新。請選擇其他交易日查詢。
          </p>
        </div>
      )}

      {/* 結果顯示 */}
      {data && data.length > 0 && (
        <>
          {/* 產業統計 - 只有有效資料時才顯示 */}
          {selectedIndustry === 'ALL' && validData.length > 0 && (
            <IndustrySummaryCard
              summaries={industrySummaries}
              title="產業別統計"
            />
          )}

          {/* 詳細資料 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PriceDiffTable
              data={data}
              title={
                selectedIndustry === 'ALL'
                  ? '所有產業股票明細'
                  : `${currentIndustry?.name || ''} 股票明細`
              }
              showIndustry={selectedIndustry === 'ALL'}
            />
            {validData.length > 0 && (
              <PriceDiffChart
                data={data}
                title={
                  selectedIndustry === 'ALL'
                    ? '所有產業差價圖表'
                    : `${currentIndustry?.name || ''} 差價圖表`
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
