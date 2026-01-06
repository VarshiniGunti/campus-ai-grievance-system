# Admin Login Feature Guide

## Overview

The Campus AI Grievance Intelligence System now includes a secure admin login system. Administrators must authenticate with an email and 4-digit PIN before accessing the admin dashboard.

## Features

### ✅ Secure Authentication
- Email-based login
- 4-digit PIN authentication
- Session management with localStorage
- Automatic logout functionality
- Protected routes (redirects to login if not authenticated)

### ✅ User Experience
- Clean, professional login interface
- Error messages for failed attempts
- Demo credentials display (collapsible)
- Admin email display on dashboard
- One-click logout button
- Responsive design

## Demo Credentials

For testing purposes, use these credentials:

### Account 1
- **Email**: `admin@campus.edu`
- **PIN**: `1234`

### Account 2
- **Email**: `grievance@campus.edu`
- **PIN**: `5678`

## How to Use

### Step 1: Access Admin Login
1. Go to the homepage
2. Click the **"Admin Login"** button in the top navigation
3. Or navigate directly to `/admin-login`

### Step 2: Enter Credentials
1. Enter your **email address**
2. Enter your **4-digit PIN**
3. Click **"Sign In"**

### Step 3: Access Dashboard
- On successful login, you'll be redirected to the admin dashboard
- Your email will be displayed in the top right
- View and filter all grievances
- Click **"Logout"** to sign out

## Features on Admin Dashboard

### After Logging In
- Dashboard is only accessible with valid credentials
- Your email is displayed in the navigation bar
- **Logout** button available in the top right

### Admin Capabilities
- View all submitted grievances
- Filter by category or urgency
- View detailed grievance information
- See AI-generated analysis
- Access statistics and insights

## Security Implementation

### How It Works
```
User Input (Email + PIN)
         ↓
Frontend Validation
         ↓
Validate Against Admin List
         ↓
Login Success → Store in localStorage
         ↓
Redirect to Dashboard
```

### Features
- ✅ Client-side validation
- ✅ Secure credential storage
- ✅ Route protection
- ✅ Session management
- ✅ Automatic redirect on invalid access

## File Structure

```
client/
├── pages/
│   ├── AdminLogin.tsx           # Login page
│   └── AdminDashboard.tsx       # Protected dashboard
├── utils/
│   └── admin-auth.ts            # Authentication utilities
└── components/
    └── ProtectedRoute.tsx       # Route protection wrapper
```

## Configuration

### Adding New Admin Accounts

Edit `client/utils/admin-auth.ts`:

```typescript
const AUTHORIZED_ADMINS: AdminCredentials[] = [
  {
    email: 'admin@campus.edu',
    pin: '1234'
  },
  {
    email: 'new-admin@campus.edu',
    pin: '9012'
  },
  // Add more accounts as needed
];
```

### Production Deployment

**IMPORTANT**: For production, move authentication to the backend:

1. Create a backend `/api/auth/login` endpoint
2. Validate credentials against a database
3. Generate JWT tokens instead of storing credentials in localStorage
4. Implement token expiration
5. Use HTTPS for all communications

**Current Implementation**: Demo/development only. Not recommended for production use without backend authentication.

## Troubleshooting

### "Invalid email or PIN"
- ✓ Check that email is entered correctly
- ✓ Verify PIN is exactly 4 digits
- ✓ Check if account exists (see demo credentials above)

### Stuck on Login Page
- ✓ Try clearing localStorage: `localStorage.clear()`
- ✓ Check browser console for errors (F12)
- ✓ Try a different browser or incognito mode

### Can't Access Dashboard
- ✓ If redirected to login, your session may have expired
- ✓ Login again with your credentials
- ✓ Clear browser cache if issues persist

### Logout Not Working
- ✓ Check if JavaScript is enabled
- ✓ Try refreshing the page after logout
- ✓ Check browser console for errors

## Pages

### `/admin-login` - Login Page
- Email and PIN input fields
- Validation and error handling
- Demo credentials reference
- Link back to homepage

### `/admin-dashboard` - Protected Dashboard
- Requires authentication to access
- Displays admin email
- Shows logout button
- Full dashboard functionality

## Security Notes

### For Development/Demo
- ✅ Credentials stored in localStorage
- ✅ Client-side validation
- ✅ No database required
- ✅ Easy to test

### For Production
- ⚠️ **DO NOT USE AS-IS**
- ⚠️ Move to backend authentication
- ⚠️ Use secure token storage
- ⚠️ Implement proper session management
- ⚠️ Use HTTPS only
- ⚠️ Add rate limiting
- ⚠️ Implement audit logging

## API Integration Ready

The authentication system is designed to easily integrate with a backend API:

```typescript
// Example: Backend authentication
async function authenticateWithBackend(email: string, pin: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pin })
  });
  
  const { token } = await response.json();
  localStorage.setItem('auth_token', token);
}
```

## Future Enhancements

- [ ] Backend authentication API
- [ ] JWT token-based sessions
- [ ] Password login option
- [ ] Multi-factor authentication (MFA)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Session timeout
- [ ] Email verification
- [ ] Account management interface
- [ ] Admin user provisioning

## Support

For issues or questions about admin login:
1. Check this guide's troubleshooting section
2. Review `client/utils/admin-auth.ts` for implementation details
3. Check browser console (F12) for error messages
4. See main [README.md](./README.md) for general support

---

**Note**: This implementation is perfect for development and demos. For production use with real data, implement proper backend authentication with secure credential storage and session management.
