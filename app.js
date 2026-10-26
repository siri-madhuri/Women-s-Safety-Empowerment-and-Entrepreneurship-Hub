const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Sending…";
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to send your message.");
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.textContent = "Could not send the message. Please check that the Node.js server is running.";
  }
});