// Simple admin authentication system
// In production, this should use a proper backend authentication system

interface AdminCredentials {
  email: string;
  pin: string;
}

interface AuthUser {
  email: string;
  authenticated: boolean;
}

const STORAGE_KEY = "campus_ai_admin_auth";

/**
 * List of authorized admin accounts
 * In production, this should be managed on the backend
 */
const AUTHORIZED_ADMINS: AdminCredentials[] = [
  {
    email: "admin@campus.edu",
    pin: "1234",
  },
  {
    email: "grievance@campus.edu",
    pin: "5678",
  },
];

/**
 * Validate admin credentials
 */
export function validateAdminCredentials(email: string, pin: string): boolean {
  return AUTHORIZED_ADMINS.some(
    (admin) => admin.email === email && admin.pin === pin,
  );
}

/**
 * Login admin and store authentication
 */
export function loginAdmin(email: string, pin: string): AuthUser | null {
  if (validateAdminCredentials(email, pin)) {
    const authUser: AuthUser = {
      email,
      authenticated: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  }
  return null;
}

/**
 * Get current authenticated admin
 */
export function getAuthenticatedAdmin(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored) as AuthUser;
      if (user.authenticated) {
        return user;
      }
    }
  } catch (error) {
    console.error("Error retrieving auth user:", error);
  }
  return null;
}

/**
 * Logout admin
 */
export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated(): boolean {
  return getAuthenticatedAdmin() !== null;
}
