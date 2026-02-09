import { Stock, IndustryCategory } from '@/types/stock';

// 台股產業分類與代表性股票
export const INDUSTRIES: IndustryCategory[] = [
  {
    code: 'SEMI',
    name: '半導體',
    stocks: [
      { symbol: '2330.TW', name: '台積電', industry: '半導體' },
      { symbol: '2454.TW', name: '聯發科', industry: '半導體' },
      { symbol: '2303.TW', name: '聯電', industry: '半導體' },
      { symbol: '3711.TW', name: '日月光投控', industry: '半導體' },
      { symbol: '2379.TW', name: '瑞昱', industry: '半導體' },
    ],
  },
  {
    code: 'ELECT',
    name: '電子零組件',
    stocks: [
      { symbol: '2317.TW', name: '鴻海', industry: '電子零組件' },
      { symbol: '2382.TW', name: '廣達', industry: '電子零組件' },
      { symbol: '2308.TW', name: '台達電', industry: '電子零組件' },
      { symbol: '2357.TW', name: '華碩', industry: '電子零組件' },
      { symbol: '2395.TW', name: '研華', industry: '電子零組件' },
    ],
  },
  {
    code: 'FIN',
    name: '金融保險',
    stocks: [
      { symbol: '2881.TW', name: '富邦金', industry: '金融保險' },
      { symbol: '2882.TW', name: '國泰金', industry: '金融保險' },
      { symbol: '2891.TW', name: '中信金', industry: '金融保險' },
      { symbol: '2886.TW', name: '兆豐金', industry: '金融保險' },
      { symbol: '2884.TW', name: '玉山金', industry: '金融保險' },
    ],
  },
  {
    code: 'PLASTIC',
    name: '塑膠化工',
    stocks: [
      { symbol: '1301.TW', name: '台塑', industry: '塑膠化工' },
      { symbol: '1303.TW', name: '南亞', industry: '塑膠化工' },
      { symbol: '1326.TW', name: '台化', industry: '塑膠化工' },
      { symbol: '6505.TW', name: '台塑化', industry: '塑膠化工' },
    ],
  },
  {
    code: 'STEEL',
    name: '鋼鐵',
    stocks: [
      { symbol: '2002.TW', name: '中鋼', industry: '鋼鐵' },
      { symbol: '2014.TW', name: '中鴻', industry: '鋼鐵' },
      { symbol: '2015.TW', name: '豐興', industry: '鋼鐵' },
    ],
  },
  {
    code: 'SHIP',
    name: '航運',
    stocks: [
      { symbol: '2603.TW', name: '長榮', industry: '航運' },
      { symbol: '2609.TW', name: '陽明', industry: '航運' },
      { symbol: '2615.TW', name: '萬海', industry: '航運' },
      { symbol: '2618.TW', name: '長榮航', industry: '航運' },
    ],
  },
  {
    code: 'FOOD',
    name: '食品',
    stocks: [
      { symbol: '1216.TW', name: '統一', industry: '食品' },
      { symbol: '1227.TW', name: '佳格', industry: '食品' },
      { symbol: '1229.TW', name: '聯華', industry: '食品' },
    ],
  },
  {
    code: 'RETAIL',
    name: '百貨零售',
    stocks: [
      { symbol: '2912.TW', name: '統一超', industry: '百貨零售' },
      { symbol: '2915.TW', name: '潤泰全', industry: '百貨零售' },
      { symbol: '5903.TW', name: '全家', industry: '百貨零售' },
    ],
  },
  {
    code: 'TELECOM',
    name: '通訊網路',
    stocks: [
      { symbol: '2412.TW', name: '中華電', industry: '通訊網路' },
      { symbol: '3045.TW', name: '台灣大', industry: '通訊網路' },
      { symbol: '4904.TW', name: '遠傳', industry: '通訊網路' },
    ],
  },
  {
    code: 'BIO',
    name: '生技醫療',
    stocks: [
      { symbol: '6446.TW', name: '藥華藥', industry: '生技醫療' },
      { symbol: '4743.TW', name: '合一', industry: '生技醫療' },
      { symbol: '1773.TW', name: '保瑞', industry: '生技醫療' },
    ],
  },
  {
    code: 'AUTO',
    name: '汽車',
    stocks: [
      { symbol: '2201.TW', name: '裕隆', industry: '汽車' },
      { symbol: '2207.TW', name: '和泰車', industry: '汽車' },
    ],
  },
  {
    code: 'CONSTRUCT',
    name: '營建',
    stocks: [
      { symbol: '2504.TW', name: '國產', industry: '營建' },
      { symbol: '2542.TW', name: '興富發', industry: '營建' },
      { symbol: '2545.TW', name: '皇翔', industry: '營建' },
    ],
  },
  {
    code: 'TEXTILE',
    name: '紡織',
    stocks: [
      { symbol: '1402.TW', name: '遠東新', industry: '紡織' },
      { symbol: '1476.TW', name: '儒鴻', industry: '紡織' },
    ],
  },
  {
    code: 'CEMENT',
    name: '水泥',
    stocks: [
      { symbol: '1101.TW', name: '台泥', industry: '水泥' },
      { symbol: '1102.TW', name: '亞泥', industry: '水泥' },
    ],
  },
  {
    code: 'OPTIC',
    name: '光電',
    stocks: [
      { symbol: '2409.TW', name: '友達', industry: '光電' },
      { symbol: '3481.TW', name: '群創', industry: '光電' },
    ],
  },
];

// 依產業代碼取得產業
export const getIndustryByCode = (code: string): IndustryCategory | undefined => {
  return INDUSTRIES.find((industry) => industry.code === code);
};

// 依股票代碼取得股票資訊
export const getStockBySymbol = (symbol: string): Stock | undefined => {
  for (const industry of INDUSTRIES) {
    const stock = industry.stocks.find((s) => s.symbol === symbol);
    if (stock) return stock;
  }
  return undefined;
};

// 取得所有股票清單
export const getAllStocks = (): Stock[] => {
  return INDUSTRIES.flatMap((industry) => industry.stocks);
};
