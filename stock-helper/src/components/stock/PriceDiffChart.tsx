'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StockDiffResponse } from '@/types/stock';
import { getStockBySymbol } from '@/data/industries';

interface PriceDiffChartProps {
  data: StockDiffResponse[];
  title?: string;
}

export default function PriceDiffChart({
  data,
  title = '差價圖表',
}: PriceDiffChartProps) {
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

  // 準備圖表資料，只取有效資料
  const chartData = data
    .filter((item) => item.diff !== null && item.error === null)
    .map((item) => {
      const stock = getStockBySymbol(item.symbol);
      return {
        symbol: item.symbol.replace('.TW', ''),
        name: stock?.name || item.symbol,
        diff: item.diff,
        industry: stock?.industry || '其他',
      };
    })
    .sort((a, b) => (b.diff || 0) - (a.diff || 0));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">無有效資料可顯示</p>
        </CardContent>
      </Card>
    );
  }

  const getBarColor = (diff: number | null) => {
    if (diff === null || diff === 0) return '#9CA3AF';
    return diff > 0 ? '#22C55E' : '#EF4444';
  };

  interface TooltipPayload {
    payload: {
      name: string;
      diff: number;
      industry: string;
    };
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-500">{data.industry}</p>
          <p
            className={`text-lg font-bold ${
              data.diff > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {data.diff > 0 ? '+' : ''}
            {data.diff?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // 動態計算圖表高度
  const chartHeight = Math.max(300, chartData.length * 40);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => value.toFixed(1)} />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="#6B7280" strokeWidth={1} />
              <Bar dataKey="diff" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.diff)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
