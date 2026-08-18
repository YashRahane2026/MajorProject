import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { pathname } = request.nextUrl;
  const publicRoutes = ['/login', '/api'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-crimetrack.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl.includes('demo-crimetrack');

  let user: any = null;

  if (!isDemo) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Fallback to demo mode on Supabase connection error
    }
  }

  // Demo mode session handling
  const demoRole = request.cookies.get('demo_role')?.value;
  if (!user && demoRole) {
    user = { app_metadata: { role: demoRole } };
  }

  // If unauthenticated and trying to access protected route in real mode
  if (!user && !isPublicRoute && !isDemo) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user) {
    const role = user.app_metadata?.role || 'admin';

    // Admin-only routes
    const adminRoutes = ['/settings', '/audit'];
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/overview';
        return NextResponse.redirect(url);
      }
    }

    // Police + Admin routes
    const policeRoutes = ['/suspects/new', '/firs/new', '/matching'];
    if (policeRoutes.some((route) => pathname.startsWith(route))) {
      if (role !== 'police' && role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/overview';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
