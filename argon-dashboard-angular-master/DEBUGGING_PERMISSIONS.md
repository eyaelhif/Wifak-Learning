# Debugging "Unable to save user permissions" Error

## What I Found
The error occurs when clicking the "Save permissions" button on the user permissions page. The frontend is trying to save permissions but the backend request is failing.

## Steps to Debug

### 1. Check Browser Console
Open your browser's **Developer Tools** (F12 or Right-click → Inspect):
- Go to the **Console** tab
- Try to save permissions again
- Look for detailed error logs showing:
  - **Status code** (401, 404, 500, etc.)
  - **Error message** from the backend
  - **Full request/response details**

### 2. Check Network Tab
- Go to the **Network** tab in Developer Tools
- Try to save permissions
- Look for a request to: `PUT http://localhost:8089/eya/api/users/{userId}/permissions`
- Check the response to see the actual error

### 3. Possible Issues & Solutions

#### Issue A: Network Error (Status 0)
**Message:** "Network error: Backend server is not responding"
- **Cause:** The backend API server is not running
- **Fix:** Start your backend server on `http://localhost:8089`

#### Issue B: 401 Unauthorized
**Message:** "Unauthorized: Your session has expired"
- **Cause:** JWT token is missing or expired
- **Fix:** Logout and login again to refresh your token

#### Issue C: 403 Forbidden
**Message:** "Forbidden: You do not have permission"
- **Cause:** Your user account lacks the `MANAGE_USERS` permission
- **Fix:** Give your account the `MANAGE_USERS` permission

#### Issue D: 404 Not Found
**Message:** "The API endpoint for updating permissions was not found"
- **Cause:** The backend doesn't have the endpoint `/users/{id}/permissions`
- **Fix:** Create the endpoint (see Backend Implementation below)

#### Issue E: 500 Server Error
**Message:** "Server error (500)..."
- **Cause:** Backend encountered an error
- **Fix:** Check your backend logs for detailed error messages

## Backend Implementation

Your backend needs to have this endpoint:

### Endpoint
```
PUT /eya/api/users/{userId}/permissions
```

### Request Payload
```json
{
  "permissionIds": [1, 2, 3]
}
```

### Expected Response
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "permissions": [
    { "id": 1, "name": "MANAGE_USERS", "description": "..." },
    { "id": 2, "name": "VIEW_REPORTS", "description": "..." }
  ],
  ...
}
```

### What to Check
1. Does the endpoint exist in your backend controller?
2. Is it correctly mapped to handle PUT requests?
3. Is it updating the user-permission relationship in your database?
4. Is it returning the complete updated user object?

## Frontend Enhancements Made
I've updated the component to:
- ✅ Log detailed error information to the console
- ✅ Show specific error messages based on HTTP status codes
- ✅ Log the exact API endpoint and payload being sent
- ✅ Help identify network, authentication, and server issues

## Next Steps
1. Open browser DevTools (F12)
2. Try to save permissions again
3. Check the Console tab for detailed error logs
4. Share the error details so we can determine the exact cause
