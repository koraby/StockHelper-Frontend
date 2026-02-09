'use client';

import { useMutation } from '@tanstack/react-query';
import { fetchStockDiff } from '@/lib/api';
import { StockDiffRequest, StockDiffResponse } from '@/types/stock';

export function useStockDiff() {
  return useMutation<StockDiffResponse[], Error, StockDiffRequest>({
    mutationFn: fetchStockDiff,
  });
}
