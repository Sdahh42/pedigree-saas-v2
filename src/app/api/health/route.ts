/**
 * Route API Health Check
 * Permet de vérifier que l'application est en ligne
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  });
}
