// 股票差價查詢請求
export interface StockDiffRequest {
  symbols: string[];
  date: string;
  time1: string;
  time2: string;
}

// 股票差價查詢回應
export interface StockDiffResponse {
  symbol: string;
  date: string;
  time1: string;
  time2: string;
  open_1: number | null;
  open_2: number | null;
  diff: number | null;
  error: string | null;
}

// 股票基本資料
export interface Stock {
  symbol: string;
  name: string;
  industry: string;
}

// 產業分類
export interface IndustryCategory {
  code: string;
  name: string;
  stocks: Stock[];
}

// 查詢表單參數
export interface QueryParams {
  symbols: string[];
  date: string;
  time1: string;
  time2: string;
}

// 產業統計
export interface IndustrySummary {
  industry: string;
  avgDiff: number;
  stockCount: number;
  positiveCount: number;
  negativeCount: number;
  stocks: StockDiffResponse[];
}
