import { proxyHeaders, submitTeacherPathwayReadiness } from '@ggsa/services';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const response = await submitTeacherPathwayReadiness(
    await request.text(),
    request.headers.get('Content-Type') ?? 'application/json',
  );

  return new NextResponse(response.body, {
    status: response.status,
    headers: proxyHeaders(response),
  });
}
