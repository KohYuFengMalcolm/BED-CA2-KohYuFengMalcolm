document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password === confirmPassword) {
      warningCard.classList.add("d-none");

      const data = {
        username: username,
        email: email,
        password: password,
      };

      const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
          if (responseData.token && responseData.id) {  // ✅ Check for both token and id
            // Store both token and user_id
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("user_id", responseData.id);  // ✅ Store the user ID
            console.log("User ID saved:", responseData.id); // Debug log
            
            window.location.href = "profile.html";
          } else {
            console.error("Registration response missing token or user ID:", responseData);
            warningCard.classList.remove("d-none");
            warningText.innerText = "Registration error: Missing user data";
          }
        } else {
          warningCard.classList.remove("d-none");
          warningText.innerText = responseData.message;
        }
      };

      fetchMethod(currentUrl + "/register", callback, "POST", data);
      signupForm.reset();
    } else {
      warningCard.classList.remove("d-none");
      warningText.innerText = "Passwords do not match";
    }
  });
});