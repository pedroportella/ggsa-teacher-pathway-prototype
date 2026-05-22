import {
  proxyHeaders,
  requestTeacherPathwaySubmissions,
  submitTeacherPathwayRecord,
} from '@ggsa/services';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const response = await requestTeacherPathwaySubmissions();

  return new NextResponse(response.body, {
    status: response.status,
    headers: proxyHeaders(response),
  });
}

export async function POST(request: NextRequest) {
  const response = await submitTeacherPathwayRecord(
    await request.text(),
    request.headers.get('Content-Type') ?? 'application/json',
  );

  return new NextResponse(response.body, {
    status: response.status,
    headers: proxyHeaders(response),
  });
}
