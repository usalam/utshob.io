// When page loads
window.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    setTimeout(() => {
        hero.classList.add("show");
    }, 100);
});