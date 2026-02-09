import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://stockhelper-dxoc.onrender.com/api/intraday-diff';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 驗證必要欄位
    if (!body.symbols || !Array.isArray(body.symbols) || body.symbols.length === 0) {
      return NextResponse.json(
        { error: '請提供至少一個股票代碼' },
        { status: 400 }
      );
    }

    if (!body.date || !body.time1 || !body.time2) {
      return NextResponse.json(
        { error: '請提供完整的日期與時間參數' },
        { status: 400 }
      );
    }

    // 轉發請求至外部 API
    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbols: body.symbols,
        date: body.date,
        time1: body.time1,
        time2: body.time2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `外部 API 錯誤: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: '伺服器內部錯誤' },
      { status: 500 }
    );
  }
}
