// notifications.js ─────────────────────────────────────────


emailjs.init("GxQA4kklx8CniHUqZ");

const form = document.getElementById("contactForm");

let lastSubmissionTime = 0;

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const button = form.querySelector(".form-button");
    const buttonText = button.querySelector("span");

    const honeypot = document.getElementById("website").value;
    if (honeypot !== "") {
        console.warn("Spam detected");
        return;
    }

    const now = Date.now();
    if (now - lastSubmissionTime < 15000) {
        showNotification("Please wait before sending another message.", "info");
        return;
    }

    lastSubmissionTime = now;

    document.getElementById("date").value =
        new Date().toLocaleString();

    buttonText.textContent = "Sending...";
    button.disabled = true;

    emailjs.sendForm(
        "service_diw8jdx",
        "template_2xj1ndq",
        form
    )
        .then(() => {
            showNotification("Message sent successfully!", "success");
            form.reset();
        })
        .catch((error) => {
            console.error(error);
            showNotification("Failed to send message. Try again.", "info");
        })
        .finally(() => {
            buttonText.textContent = 'Send Message';
            button.disabled = false;
        });
});

function downloadResume() {

    const resumePath = '../images/Karanjit_Singh_Resume.pdf';

    if (!resumePath) {
        showNotification('Resume download will be available soon!', 'info');
        return;
    }

    showNotification('Downloading Resume...', 'success');

    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Karanjit_Singh_Resume.pdf';

    document.body.appendChild(link);

    setTimeout(() => {
        link.click();
        link.remove();
    }, 200);

}


function showNotification(message, type = 'success') {

    const notification = document.createElement('div');

    notification.className = `notification ${type}`;

    notification.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
        <span>${message}</span>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--gradient-accent)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        gap: '0.5rem',
        zIndex: 999999,
        transform: 'translateX(400px)',
        transition: 'transform .3s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px var(--shadow-medium)'
    });

    document.body.appendChild(notification);

    if (window.lucide) lucide.createIcons();

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

}