export function checkAuthAndRedirect() {
  // Function to check if the access token is present in cookies
  function hasAccessToken() {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    return cookies.some((cookie) => cookie.startsWith("access_token="));
  }

  // Redirect to login.html if access token is not present
  if (!hasAccessToken()) {
    window.location.href = "./";
  }
}
