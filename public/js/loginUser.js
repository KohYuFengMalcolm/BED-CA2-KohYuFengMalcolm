document.addEventListener("DOMContentLoaded", function () {
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    if (responseStatus == 200) {
      if (responseData.token && responseData.id) {  // ✅ Ensure both exist
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("user_id", responseData.id);  // ✅ Store user ID
          console.log("User ID saved:", responseData.id); // ✅ Debug log
  
          window.location.href = "profile.html";
      } else {
          console.error("Login response missing user ID:", responseData);
      }
  } else {
      warningCard.classList.remove("d-none");
      warningText.innerText = responseData.message;
    }
  };

  const loginForm = document.getElementById("loginForm");

  const warningCard = document.getElementById("warningCard");
  const warningText = document.getElementById("warningText");

  loginForm.addEventListener("submit", function (event) {
    console.log("loginForm.addEventListener");
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      username: username,
      password: password,
    };
    // Perform login request
    fetchMethod(currentUrl + "/login", callback, "POST", data);

    // Reset the form fields
    loginForm.reset();
  });
});