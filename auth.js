// Authentication helper script for areyjones.com domain restriction

/**
 * Initialize Google Sign-In
 * Replace CLIENT_ID with your actual Google OAuth Client ID
 */
function initGoogleSignIn() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
        });
    });
}

/**
 * Check if user is authenticated and has valid email domain
 * Returns true if user is logged in with @areyjones.com email
 */
function isUserAuthenticated() {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2 && auth2.isSignedIn.get()) {
        const profile = auth2.currentUser.get().getBasicProfile();
        const email = profile.getEmail();
        return email.endsWith('@areyjones.com');
    }
    return false;
}

/**
 * Get current user email if authenticated
 */
function getCurrentUserEmail() {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2 && auth2.isSignedIn.get()) {
        return auth2.currentUser.get().getBasicProfile().getEmail();
    }
    return null;
}

/**
 * Sign out user
 */
function signOutUser() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        localStorage.removeItem('user_authenticated');
        window.location.href = 'login.html';
    });
}

/**
 * Handle Google Sign-In callback
 */
function onSignInSuccess(googleUser) {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    
    // Check if email ends with @areyjones.com
    if (!email.endsWith('@areyjones.com')) {
        showAccessDenied(email);
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
        return false;
    }
    
    // Mark as authenticated and redirect to dashboard
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_email', email);
    window.location.href = 'index.html';
    return true;
}

/**
 * Show access denied message
 */
function showAccessDenied(email) {
    const message = `Access Denied: ${email}\n\nOnly users with @areyjones.com email addresses are allowed.`;
    alert(message);
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px; font-family: Arial;">
            <h1 style="color: red;">Access Denied</h1>
            <p>Email: ${email}</p>
            <p>Only users with @areyjones.com email addresses are allowed to access this application.</p>
        </div>
    `;
}

/**
 * Protect page - redirect to login if not authenticated
 * Call this on page load of protected pages
 */
function protectPage() {
    const auth2 = gapi.auth2.getAuthInstance();
    if (!auth2 || !auth2.isSignedIn.get()) {
        window.location.href = 'login.html';
        return;
    }
    
    const profile = auth2.currentUser.get().getBasicProfile();
    const email = profile.getEmail();
    
    if (!email.endsWith('@areyjones.com')) {
        auth2.signOut();
        window.location.href = 'login.html';
        return;
    }
    
    // User is authenticated and has correct domain
    return true;
}