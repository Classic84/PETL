document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            if (!data.name || !data.email || !data.service || !data.message) {
                formStatus.textContent = 'Please fill in all required fields.';
                formStatus.style.color = '#ef4444';
                return;
            }

            try {
                formStatus.textContent = 'Sending message...';
                formStatus.style.color = '#2563eb';

                // Send data to the live backend API
                await API.submitContact(data);

                formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                formStatus.style.color = '#16a34a';
                contactForm.reset();
            } catch (error) {
                formStatus.textContent = 'Error sending message. Please try again.';
                formStatus.style.color = '#ef4444';
            }
        });
    }
});