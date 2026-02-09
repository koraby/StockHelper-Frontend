import { Stock } from '@/types/stock';

// 大盤代表股 - 用於整體台股分析
export const MARKET_OVERVIEW_STOCKS: Stock[] = [
  // 半導體 (權重最高)
  { symbol: '2330.TW', name: '台積電', industry: '半導體' },
  { symbol: '2454.TW', name: '聯發科', industry: '半導體' },
  { symbol: '2303.TW', name: '聯電', industry: '半導體' },

  // 電子零組件
  { symbol: '2317.TW', name: '鴻海', industry: '電子零組件' },
  { symbol: '2382.TW', name: '廣達', industry: '電子零組件' },
  { symbol: '2308.TW', name: '台達電', industry: '電子零組件' },

  // 金融保險
  { symbol: '2881.TW', name: '富邦金', industry: '金融保險' },
  { symbol: '2882.TW', name: '國泰金', industry: '金融保險' },
  { symbol: '2891.TW', name: '中信金', industry: '金融保險' },
  { symbol: '2886.TW', name: '兆豐金', industry: '金融保險' },

  // 傳統產業
  { symbol: '1301.TW', name: '台塑', industry: '塑膠化工' },
  { symbol: '1303.TW', name: '南亞', industry: '塑膠化工' },
  { symbol: '2002.TW', name: '中鋼', industry: '鋼鐵' },

  // 航運
  { symbol: '2603.TW', name: '長榮', industry: '航運' },
  { symbol: '2609.TW', name: '陽明', industry: '航運' },

  // 通訊
  { symbol: '2412.TW', name: '中華電', industry: '通訊網路' },

  // 食品零售
  { symbol: '1216.TW', name: '統一', industry: '食品' },
  { symbol: '2912.TW', name: '統一超', industry: '百貨零售' },

  // 光電
  { symbol: '2409.TW', name: '友達', industry: '光電' },

  // 汽車
  { symbol: '2207.TW', name: '和泰車', industry: '汽車' },
];

// 取得預設股票的代碼陣列
export const getMarketSymbols = (): string[] => {
  return MARKET_OVERVIEW_STOCKS.map((stock) => stock.symbol);
};
