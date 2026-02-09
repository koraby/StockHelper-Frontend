'use client';

import { QueryForm, PriceDiffTable, PriceDiffChart } from '@/components/stock';
import { useStockDiff } from '@/hooks/useStockDiff';
import { QueryParams } from '@/types/stock';

export default function IndividualPage() {
  const { mutate, data, isPending, isError, error } = useStockDiff();

  const handleSubmit = (params: QueryParams) => {
    mutate(params);
  };

  const validData = data?.filter((d) => d.diff !== null) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">個股差價查詢</h1>
        <p className="text-gray-600">
          輸入股票代碼，查詢指定時間點的價格差異
        </p>
      </div>

      <QueryForm
        onSubmit={handleSubmit}
        loading={isPending}
        showSymbolInput={true}
        title="查詢條件"
      />

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">查詢失敗: {error.message}</p>
        </div>
      )}

      {/* 無資料提示 */}
      {data && data.length > 0 && validData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            <span className="font-semibold">提示：</span> 該日期無交易資料，可能是假日或資料尚未更新。請選擇其他交易日查詢。
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceDiffTable data={data} title="差價明細" showIndustry={true} />
          {validData.length > 0 && (
            <PriceDiffChart data={data} title="差價圖表" />
          )}
        </div>
      )}
    </div>
  );
}
