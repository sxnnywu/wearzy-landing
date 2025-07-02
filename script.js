
// Attach a 'submit' event listener to the waitlistForm
document.getElementById('waitlistForm').addEventListener('submit', function (e) {

    // Prevent the default form submission behavior (so the page doesn't reload)
    e.preventDefault();

    // References
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const email = document.getElementById('email').value;

    // Check that email is not empty
    if (email) {
        submitBtn.innerHTML = '<span class="loading"></span>'; // Replace the submit button text with a loading animation
        submitBtn.disabled = true; // Disable the button to prevent multiple submissions

        // Simulate a delay
        setTimeout(() => {

            // After 1.5 seconds, hide the submit button
            submitBtn.style.display = 'none';
            successMessage.style.display = 'block';
            
        }, 1500);
    }
});