import { proxyHeaders, submitTeacherPathwayEvidence } from '@ggsa/services';
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const response = await submitTeacherPathwayEvidence(await request.formData());

  return new NextResponse(response.body, {
    status: response.status,
    headers: proxyHeaders(response),
  });
}
