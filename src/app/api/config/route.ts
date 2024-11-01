import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(req: NextRequest) {
  const configPath = path.resolve(process.cwd(), 'conf/conf.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return NextResponse.json(config, { status: 200 });
}