// Google OAuth Troubleshooter Tool
// Run this script to diagnose OAuth configuration issues

const troubleshootOAuth = () => {
  console.log('🔍 Starting Google OAuth Troubleshooter...');
  console.log('----------------------------------------');

  // Check environment
  console.log('📊 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Build Mode:', process.env.NODE_ENV === 'production' ? 'Production' : 'Development');

  // Check URLs
  console.log('\n📡 URL Configuration:');
  console.log('API URL:', process.env.REACT_APP_API_URL || 'Not set ❌');
  console.log('SOCKET URL:', process.env.REACT_APP_SOCKET_URL || 'Not set ❌');
  console.log('CLIENT URL:', process.env.REACT_APP_CLIENT_URL || 'Not set ❌');

  // Check for localhost in production
  const checkLocalhost = (url) => url && url.includes('localhost');

  if (process.env.NODE_ENV === 'production') {
    console.log('\n⚠️ Localhost Check in Production:');
    if (checkLocalhost(process.env.REACT_APP_API_URL)) {
      console.error('API URL contains localhost in production! ❌');
    } else {
      console.log('API URL is correctly set for production ✅');
    }

    if (checkLocalhost(process.env.REACT_APP_SOCKET_URL)) {
      console.error('SOCKET URL contains localhost in production! ❌');
    } else {
      console.log('SOCKET URL is correctly set for production ✅');
    }
  }

  // Check browser features
  console.log('\n🧩 Browser Environment:');
  console.log('Cookies Enabled:', navigator.cookieEnabled ? 'Yes ✅' : 'No ❌');
  console.log('User Agent:', navigator.userAgent);
  console.log('Language:', navigator.language);

  // Check for ad blockers (basic detection)
  try {
    const adBlockCheck = document.createElement('div');
    adBlockCheck.innerHTML = '&nbsp;';
    adBlockCheck.className = 'adsbox';
    document.body.appendChild(adBlockCheck);
    
    const isAdBlocked = adBlockCheck.offsetHeight === 0;
    console.log('Ad Blocker Detected:', isAdBlocked ? 'Yes ⚠️' : 'No ✅');
    document.body.removeChild(adBlockCheck);
  } catch (e) {
    console.log('Ad Blocker Check Failed:', e.message);
  }

  // Check for any previous auth attempts
  console.log('\n🔄 Previous Auth Attempts:');
  const redirectAttempted = sessionStorage.getItem('auth_redirect_attempted') === 'true';
  const redirectTime = sessionStorage.getItem('auth_redirect_time');
  
  if (redirectAttempted) {
    console.log('Auth Redirect Attempted:', 'Yes');
    console.log('Last Attempt:', redirectTime || 'Unknown time');
    
    const timeSinceRedirect = redirectTime ? 
      Math.round((new Date() - new Date(redirectTime)) / 1000) : 
      'Unknown';
      
    console.log('Seconds since redirect:', timeSinceRedirect);
    
    if (typeof timeSinceRedirect === 'number' && timeSinceRedirect < 5) {
      console.log('⚠️ Redirect happened very recently! This might indicate a redirect loop.');
    }
  } else {
    console.log('No previous auth redirect detected');
  }

  // Google OAuth recommended configuration
  console.log('\n📋 Recommended Google OAuth Settings:');
  console.log(`Authorized JavaScript Origins: ${window.location.origin}`);
  console.log(`Authorized Redirect URI: ${process.env.REACT_APP_API_URL}/auth/google/callback`);

  // Final recommendations
  console.log('\n💡 Recommendations:');
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.REACT_APP_API_URL || !process.env.REACT_APP_CLIENT_URL) {
      console.log('1. Add missing environment variables to your production deployment');
    }
    
    if (checkLocalhost(process.env.REACT_APP_API_URL) || checkLocalhost(process.env.REACT_APP_SOCKET_URL)) {
      console.log('2. Remove localhost URLs from production environment variables');
    }
  }
  
  console.log('3. Verify Google OAuth configuration in Google Cloud Console');
  console.log('4. Check server logs for auth-related errors');
  console.log('5. Try clearing browser cookies and cache');

  console.log('\n----------------------------------------');
  console.log('🔍 Troubleshooting complete! Copy and share these results with your team if needed.');
};

// Add this function to the window so it can be called from the browser console
window.troubleshootOAuth = troubleshootOAuth;

// Export the function for potential use in components
export default troubleshootOAuth;
