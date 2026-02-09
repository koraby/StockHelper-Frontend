import { StockDiffRequest, StockDiffResponse } from '@/types/stock';

const API_BASE_URL = '/api';

export async function fetchStockDiff(
  params: StockDiffRequest
): Promise<StockDiffResponse[]> {
  const response = await fetch(`${API_BASE_URL}/intraday-diff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
