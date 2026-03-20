import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, phone, country, city, preferences, marketing_opt_in } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Email, password and full name are required' }, { status: 400 });
    }

    const { user, token } = registerUser({ email, password, full_name, phone, country, city, preferences, marketing_opt_in });

    const response = NextResponse.json({ user, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
