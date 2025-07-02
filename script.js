// Initialize Supabase client
const SUPABASE_URL = 'https://ijjjhvzuibnichxdhiwy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqampodnp1aWJuaWNoeGRoaXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mjg1MzUsImV4cCI6MjA2NzAwNDUzNX0.f9BjGabBzVK1K1qTRvccFZics1nJtkkRMZo-DVz3QEo';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Reference to elements
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// EVENT LISTENER (SUBMIT FORM)
document.getElementById('waitlistForm').addEventListener('submit', async function (e) {

    // Prevent default form submission
    e.preventDefault();

    // User's email input
    const email = document.getElementById('email').value.trim();

    // Make sure email is not empty
    if (email) {
        submitBtn.innerHTML = '<span class="loading"></span>'; // show loading spinner
        submitBtn.disabled = true;

        // Check if email already exists in the waitlist
        const { data: existingEmails, error: fetchError } = await supabaseClient
            .from('waitlist')
            .select('*')
            .eq('email', email)
            .limit(1); // limit 1 since we only need to know if it exists
        console.log(existingEmails);
        if(existingEmails.length > 0) handleDuplicateEmail();
        else insertEmail(email);
    }
});

// INSERT EMAIL
async function insertEmail(email) {

    // Insert email into Supabase 'waitlist' table
    const { error } = await supabaseClient
        .from('waitlist')
        .insert([{ email }]);

    // On success, hide button and show success message after 1.5s delay
    if (!error) {
        setTimeout(() => {
            submitBtn.style.display = 'none';
            successMessage.style.display = 'block';
        }, 1500);
    }
    // If error, show alert and reset button
    else {
        alert('Oops! Something went wrong. Please try again.');
        submitBtn.innerHTML = 'Join Waitlist';
        submitBtn.disabled = false;
    }
}

// DUPLICATE EMAIL HANDLING
function handleDuplicateEmail() {

    // Show alert for duplicate email
    alert('You have already joined the waitlist with this email.');
    submitBtn.innerHTML = 'Join Waitlist';
    submitBtn.disabled = false;
}
