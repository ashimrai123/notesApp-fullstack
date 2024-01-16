import axios from "axios";

let userId: number;
//----------------------------------- LOGIN FORM ---------------------------------------------//
export function handleLogin() {
  document
    .getElementById("loginForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      const loginData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/login",
          loginData
        );
        // alert(userId);

        console.log("login successful", response.data);

        const {
          accessToken,
          refreshToken,
          userid: responseUserId,
        } = response.data;
        userId = responseUserId;
        localStorage.setItem("userIdStored", userId.toString());

        // Set tokens as HTTP cookies
        document.cookie = `access_token=${accessToken}; Secure; SameSite=None; path=/`;
        document.cookie = `refresh_token=${refreshToken}; Secure; SameSite=None; path=/`;

        // Function to check if the access token is present in cookies
        function hasAccessToken() {
          const cookies = document.cookie
            .split(";")
            .map((cookie) => cookie.trim());
          return cookies.some((cookie) => cookie.startsWith("access_token="));
        }
        // Function to redirect to login.html
        function redirectToLogin() {
          window.location.href = "./roots/login.html";
        }
        // Check for access token before allowing access to notes.html
        if (!hasAccessToken()) {
          // Redirect to login.html if access token is not present
          redirectToLogin();
        } else {
          window.location.href = "../notes.html";
        }
      } catch (error: any) {
        console.error("Error during login ", error.response.data);
        alert(`Login unsuccessful: ${error.response.data.error}`);
      }
    });
}

handleLogin();
