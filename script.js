function login() {
  const pass = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  // Password check
  if (pass === "admin123") {
    message.style.color = "green";
    message.textContent = "✅ Login successful! Redirecting...";
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 1500);
  } else {
    message.style.color = "red";
    message.textContent = "❌ Invalid password!";
  }
}
