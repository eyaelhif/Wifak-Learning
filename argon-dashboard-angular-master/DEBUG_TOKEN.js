// Debugging script for JWT token and permissions
// Paste this in your browser Console (F12) to debug:

console.log('=== JWT TOKEN DEBUG ===');

// 1. Get the token
const token = sessionStorage.getItem('eya_token') || localStorage.getItem('eya_token');
console.log('Token found:', !!token);

// 2. Decode JWT (without verification - just for debugging)
if (token) {
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const decoded = JSON.parse(atob(parts[1]));
      console.log('JWT Payload:', decoded);
      console.log('Permissions in token:', decoded.permissions || 'NOT FOUND');
    } catch (e) {
      console.error('Failed to decode JWT:', e);
    }
  }
}

// 3. Get user from localStorage
const user = JSON.parse(localStorage.getItem('eya_user') || sessionStorage.getItem('eya_user'));
console.log('User from storage:', user);
console.log('Permissions from storage:', user?.permissions?.map(p => p.name) || []);
console.log('Has MANAGE_USERS?:', user?.permissions?.some(p => p.name === 'MANAGE_USERS'));

// 4. Check headers being sent
console.log('=== NEXT REQUEST HEADERS ===');
console.log('The Authorization header should contain: Bearer [your-token]');
console.log('If you see this token in the Network tab on the next request, you\'re good.');
