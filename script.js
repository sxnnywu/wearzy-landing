// PARALLAX SCROLLING
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const rate2 = scrolled * -0.3;

    // Parallax effect for hero content
    const heroContent = document.getElementById('heroContent');
    if (heroContent) heroContent.style.transform = `translateY(${rate2}px)`;

    // Header background change on scroll
    const header = document.getElementById('header');
    if (scrolled > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// SMOOTH SCROLL ANIMATIONS
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);

// Observe all scroll-animate elements
document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
});

// ENHANCED MOUSE INTERACTIONS
document.addEventListener('mousemove', (e) => {
    const cursor = { x: e.clientX, y: e.clientY };

    // Subtle parallax effect on floating elements
    document.querySelectorAll('.floating-element').forEach((el, i) => {
        const speed = (i + 1) * 0.02;
        const x = (cursor.x * speed);
        const y = (cursor.y * speed);
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// PERFORMANCE OPTIMIZATION
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}
function updateAnimations() {
    ticking = false;
}

// INITIAL ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.scroll-animate').forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 200);
        });
    }, 300);
});

// NUMBER OF WAITLIST ENTRIES

// Initialize Supabase client
const SUPABASE_URL = 'https://ijjjhvzuibnichxdhiwy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqampodnp1aWJuaWNoeGRoaXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mjg1MzUsImV4cCI6MjA2NzAwNDUzNX0.f9BjGabBzVK1K1qTRvccFZics1nJtkkRMZo-DVz3QEo';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch number of waitlist entries from Supabase
async function fetchWaitlistCount() {
  const { count, error } = await supabaseClient
    .from('waitlist') // <- match your table name exactly
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching waitlist count:', error);
    return;
  }
  const countElement = document.getElementById('waitlistCount');
  if (countElement) {
    countElement.textContent = `Join ${count} students already on the waitlist`;
  }
}

fetchWaitlistCount(); // call it when the page loads

// HANDLING WAITLIST SUBMISSION

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
        if (existingEmails.length > 0) handleDuplicateEmail();
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
            submitBtn.style.background = 'linear-gradient(135deg, #85b2bf 0%, #649dad 100%)';
        }, 1500);
    }
    // If error, show alert and reset button
    else {
        alert('Oops! Something went wrong. Please try again.');
        submitBtn.innerHTML = 'Join Waitlist';
        submitBtn.disabled = false;
    }
    // Reset form after delay
    setTimeout(() => {
            document.getElementById('email').value = '';
            submitBtn.innerHTML = 'Get Early Access';
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, #649dad 0%, #4d8291 100%)';
            successMessage.style.display = 'none';
        }, 3000);
}

// DUPLICATE EMAIL HANDLING
function handleDuplicateEmail() {

    // Show alert for duplicate email
    alert('You have already joined the waitlist with this email.');
    submitBtn.innerHTML = 'Join Waitlist';
    submitBtn.disabled = false;
}
