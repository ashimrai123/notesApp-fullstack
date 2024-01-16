function clearCookies() {
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None; path=/;";
  document.cookie =
    "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None; path=/;";
}

// Function to redirect to login.html
function redirectToLogin() {
  window.location.href = "./roots/login.html";
}

export function handleLogout() {
  document.getElementById("logOutButton")?.addEventListener("click", () => {
    // Clear cookies
    clearCookies();

    // Redirect to login.html
    redirectToLogin();
  });
}
