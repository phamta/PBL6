import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /dashboard)
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard'];
  const publicRoutes = ['/login', '/'];
  const adminRoutes = ['/dashboard/admin'];
  const studentRoutes = ['/dashboard/student'];
  const specialistRoutes = ['/dashboard/specialist'];
  const managerRoutes = ['/dashboard/manager'];
  const viewerRoutes = ['/dashboard/viewer'];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  
  let user = null;
  try {
    if (userCookie) {
      user = JSON.parse(userCookie);
    }
  } catch (error) {
    // Invalid user cookie
  }

  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If accessing login page with a valid token, redirect to appropriate dashboard
  if (pathname === '/login' && token && user) {
    const url = request.nextUrl.clone();
    
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        url.pathname = '/dashboard/admin';
        break;
      case 'student':
        url.pathname = '/dashboard/student';
        break;
      case 'specialist':
        url.pathname = '/dashboard/specialist';
        break;
      case 'manager':
        url.pathname = '/dashboard/manager';
        break;
      case 'viewer':
        url.pathname = '/dashboard/viewer';
        break;
      default:
        url.pathname = '/dashboard';
    }
    
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (token && user) {
    const userRole = user.role;
    
    // Check admin routes
    if (adminRoutes.some(route => pathname.startsWith(route)) && userRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Check student routes
    if (studentRoutes.some(route => pathname.startsWith(route)) && userRole !== 'student') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Check specialist routes
    if (specialistRoutes.some(route => pathname.startsWith(route)) && userRole !== 'specialist') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Check manager routes
    if (managerRoutes.some(route => pathname.startsWith(route)) && userRole !== 'manager') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Check viewer routes
    if (viewerRoutes.some(route => pathname.startsWith(route)) && userRole !== 'viewer') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
