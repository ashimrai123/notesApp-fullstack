import axios from "axios";

//----------------------------------- SIGN UP FORM ---------------------------------------------//

export function handleSignup() {
  document
    .getElementById("signupForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      const userData = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/signup",
          userData
        );

        // Redirect to login page after successful signup
        window.location.href = "./login.html";
      } catch (error: any) {
        // Log the error to console
        console.log("Error during Signup", error.response.data);

        // Display error message to the user (You can replace this with your own error handling logic)
        alert(`Signup unsuccessful, ${error.response.data.error}`);
      }
    });
}

handleSignup();
