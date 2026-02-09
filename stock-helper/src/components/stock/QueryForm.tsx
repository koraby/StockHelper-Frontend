'use client';

import { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { generateTimeOptions, formatDate, getLastTradingDay, DEFAULT_TIME1, DEFAULT_TIME2 } from '@/lib/utils';
import { QueryParams } from '@/types/stock';

interface QueryFormProps {
  onSubmit: (params: QueryParams) => void;
  loading?: boolean;
  showSymbolInput?: boolean;
  defaultSymbols?: string[];
  title?: string;
}

export default function QueryForm({
  onSubmit,
  loading = false,
  showSymbolInput = true,
  defaultSymbols = [],
  title = '查詢條件',
}: QueryFormProps) {
  const timeOptions = generateTimeOptions().map((time) => ({
    value: time,
    label: time,
  }));

  const [symbolInput, setSymbolInput] = useState(defaultSymbols.join(', '));
  const [date, setDate] = useState(formatDate(getLastTradingDay()));
  const [time1, setTime1] = useState(DEFAULT_TIME1);
  const [time2, setTime2] = useState(DEFAULT_TIME2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 解析股票代碼
    const symbols = showSymbolInput
      ? symbolInput
          .split(/[,，\s]+/)
          .map((s) => s.trim().toUpperCase())
          .filter((s) => s.length > 0)
          .map((s) => (s.endsWith('.TW') ? s : `${s}.TW`))
      : defaultSymbols;

    if (symbols.length === 0) {
      alert('請輸入至少一個股票代碼');
      return;
    }

    onSubmit({
      symbols,
      date,
      time1,
      time2,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showSymbolInput && (
            <Input
              id="symbols"
              label="股票代碼（多個以逗號分隔）"
              placeholder="2330, 2317, 2454"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              id="date"
              label="查詢日期"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Select
              id="time1"
              label="時間1"
              options={timeOptions}
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
            />

            <Select
              id="time2"
              label="時間2"
              options={timeOptions}
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={loading}>
              查詢差價
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
