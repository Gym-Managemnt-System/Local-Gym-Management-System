const API_BASE = window.API_BASE || "http://localhost:4000/api";

const form = document.getElementById("signup-form");
const msg = document.getElementById("form-msg");
const submitBtn = document.getElementById("submit-btn");
const credentialsRow = document.getElementById("credentials-row");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

function fieldEl(name) {
  return form.querySelector(`[name="${name}"]`);
}

function setError(name, text) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = text || "";
  const field = fieldEl(name)?.closest(".field");
  if (field) field.classList.toggle("invalid", Boolean(text));
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  document.querySelectorAll(".field.invalid").forEach((f) => f.classList.remove("invalid"));
}

function validate() {
  clearErrors();
  let valid = true;

  const fullName = fieldEl("fullName").value.trim();
  if (fullName.length < 2) {
    setError("fullName", "Enter your full name.");
    valid = false;
  }

  const email = fieldEl("email").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email", "Enter a valid email address.");
    valid = false;
  }

  const phone = fieldEl("phone").value.trim();
  if (!/^[0-9+\-\s()]{7,15}$/.test(phone)) {
    setError("phone", "Enter a valid phone number.");
    valid = false;
  }

  const dob = fieldEl("dob").value;
  if (!dob) {
    setError("dob", "Enter your date of birth.");
    valid = false;
  } else {
    const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000);
    if (age < 13) {
      setError("dob", "You must be at least 13 years old.");
      valid = false;
    }
  }

  const gender = fieldEl("gender").value;
  if (!gender) {
    setError("gender", "Select a gender.");
    valid = false;
  }

  const address = fieldEl("address").value.trim();
  if (address.length < 5) {
    setError("address", "Enter your home address.");
    valid = false;
  }

  if (!usernameInput.value || !passwordInput.value) {
    msg.textContent = "Generate a username and password before creating your account.";
    msg.classList.remove("success");
    valid = false;
  }

  return valid;
}

async function generateCredential(kind, targetInput, seed) {
  try {
    const params = new URLSearchParams();
    if (seed) params.set("seed", seed);
    const res = await fetch(`${API_BASE}/generate-${kind}?${params.toString()}`);
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    targetInput.value = data.value;
  } catch (err) {
    // Fallback: generate client-side if the backend is unreachable
    targetInput.value = kind === "username"
      ? `member${Math.floor(1000 + Math.random() * 9000)}`
      : Array.from({ length: 12 }, () =>
          "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%"[Math.floor(Math.random() * 61)]
        ).join("");
  }
  credentialsRow.classList.remove("hidden");
}

document.getElementById("gen-username").addEventListener("click", () => {
  const fullName = fieldEl("fullName").value.trim();
  generateCredential("username", usernameInput, fullName);
});

document.getElementById("gen-password").addEventListener("click", () => {
  generateCredential("password", passwordInput);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  msg.classList.remove("success");

  if (!validate()) return;

  const payload = {
    fullName: fieldEl("fullName").value.trim(),
    email: fieldEl("email").value.trim(),
    phone: fieldEl("phone").value.trim(),
    dob: fieldEl("dob").value,
    gender: fieldEl("gender").value,
    address: fieldEl("address").value.trim(),
    plan: form.querySelector('input[name="plan"]:checked').value,
    username: usernameInput.value,
    password: passwordInput.value,
  };

  submitBtn.disabled = true;
  submitBtn.querySelector(".cta-label").textContent = "Creating account…";

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Something went wrong. Please try again.";
      return;
    }

    msg.textContent = "Account created! You can now log in.";
    msg.classList.add("success");
    form.reset();
    credentialsRow.classList.add("hidden");
  } catch (err) {
    msg.textContent = "Could not reach the server. Please try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".cta-label").textContent = "Create account";
  }
});
