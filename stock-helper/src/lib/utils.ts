import { format, subDays, isWeekend, getDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { StockDiffResponse, IndustrySummary } from '@/types/stock';
import { getStockBySymbol } from '@/data/industries';

// 合併 className
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 取得上一個交易日（排除週末）
export function getLastTradingDay(): Date {
  let date = new Date();
  
  // 如果是週六，往前 1 天
  if (getDay(date) === 6) {
    date = subDays(date, 1);
  }
  // 如果是週日，往前 2 天
  else if (getDay(date) === 0) {
    date = subDays(date, 2);
  }
  
  return date;
}

// 格式化日期為 YYYY-MM-DD
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// 格式化差價顯示
export function formatDiff(diff: number | null): string {
  if (diff === null) return '-';
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(2)}`;
}

// 格式化價格顯示
export function formatPrice(price: number | null): string {
  if (price === null) return '-';
  return price.toFixed(2);
}

// 取得差價顏色 class
export function getDiffColorClass(diff: number | null): string {
  if (diff === null || diff === 0) return 'text-gray-500';
  return diff > 0 ? 'text-green-600' : 'text-red-600';
}

// 取得差價背景顏色 class
export function getDiffBgClass(diff: number | null): string {
  if (diff === null || diff === 0) return 'bg-gray-100';
  return diff > 0 ? 'bg-green-50' : 'bg-red-50';
}

// 計算產業統計
export function calculateIndustrySummary(
  data: StockDiffResponse[]
): IndustrySummary[] {
  const industryMap = new Map<string, StockDiffResponse[]>();

  // 依產業分組
  data.forEach((item) => {
    const stock = getStockBySymbol(item.symbol);
    const industry = stock?.industry || '其他';

    if (!industryMap.has(industry)) {
      industryMap.set(industry, []);
    }
    industryMap.get(industry)!.push(item);
  });

  // 計算統計
  const summaries: IndustrySummary[] = [];

  industryMap.forEach((stocks, industry) => {
    const validStocks = stocks.filter((s) => s.diff !== null);
    const avgDiff =
      validStocks.length > 0
        ? validStocks.reduce((sum, s) => sum + (s.diff || 0), 0) /
          validStocks.length
        : 0;

    summaries.push({
      industry,
      avgDiff,
      stockCount: stocks.length,
      positiveCount: validStocks.filter((s) => (s.diff || 0) > 0).length,
      negativeCount: validStocks.filter((s) => (s.diff || 0) < 0).length,
      stocks,
    });
  });

  // 依平均差價排序
  return summaries.sort((a, b) => b.avgDiff - a.avgDiff);
}

// 計算整體平均差價
export function calculateOverallAvgDiff(data: StockDiffResponse[]): number {
  const validData = data.filter((item) => item.diff !== null);
  if (validData.length === 0) return 0;
  return (
    validData.reduce((sum, item) => sum + (item.diff || 0), 0) / validData.length
  );
}

// 驗證時間是否在交易時段
export function isValidTradingTime(time: string): boolean {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  // 台股交易時段 09:00 - 13:30
  const openTime = 9 * 60; // 09:00
  const closeTime = 13 * 60 + 30; // 13:30
  
  return totalMinutes >= openTime && totalMinutes <= closeTime;
}

// 生成時間選項（每 10 分鐘一個）
export function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 9; hour <= 13; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      // 13:30 之後不生成
      if (hour === 13 && minute > 30) break;
      options.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }
  }
  return options;
}

// 預設時間
export const DEFAULT_TIME1 = '09:00';
export const DEFAULT_TIME2 = '09:50';
