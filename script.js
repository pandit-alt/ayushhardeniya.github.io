// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navLinks.style.animation = 'rollUp 1s ease forwards'; // Roll up animation
        setTimeout(() => {
            navLinks.style.display = 'none'; // Hide after animation
        }, 1000); // Match timeout with animation duration
    } else {
        navLinks.style.display = 'flex'; // Show before animation
        navLinks.classList.add('active');
        navLinks.style.animation = 'rollDown 1s ease forwards'; // Roll down animation
    }
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navLinks.style.animation = 'rollUp 1s ease forwards'; // Roll up animation
            setTimeout(() => {
                navLinks.style.display = 'none'; // Hide after animation
            }, 1000); // Match timeout with animation duration
        }
    });
});

// Smooth Scroll for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const blogCard = document.getElementById('blog-card');
const blogTitle = document.getElementById('blog-title');
const blogDescription = document.getElementById('blog-description');
const blogLink = document.getElementById('blog-link'); // Not used separately now
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let posts = [];
let currentIndex = 0;

const API_URL = "https://medium-blog-backend-three.vercel.app/medium-feed";

// Fetch blogs from the backend
const fetchBlogs = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        // Get the JSON response from the backend.
        const data = await response.json();
        console.log("Fetched Data:", data);

        // Extract the XML string from the "contents" property.
        const textData = data.contents;
        console.log("XML Data:", textData);

        // Parse XML into a DOM object.
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "text/xml");

        // Extract all <item> elements from the XML.
        const items = xml.querySelectorAll("item");
        if (items.length === 0) throw new Error("No blog posts found");

        posts = Array.from(items).map(item => ({
            title: item.querySelector("title")?.textContent || "No title available",
            description: item.querySelector("description")?.textContent || "No description available",
            link: item.querySelector("link")?.textContent || "#"
        }));

        // Enable navigation buttons if posts are present.
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        displayPost(currentIndex);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        blogTitle.innerText = "Error loading posts.";
        blogDescription.innerText = "Please try again later.";
        blogLink.style.display = "none";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }
};

// Display the current blog post with fade effect for the description snippet
const displayPost = (index) => {
    if (posts.length > 0) {
        const post = posts[index];
        blogTitle.innerText = post.title;
        // Set the blog link (used in the overlay) to the current post's link.
        blogLink.href = post.link;
        blogLink.style.display = "none"; // We'll use the "Read More" link within the fade overlay

        // Build a snippet from the description (limit to 300 characters).
        let snippet = "";
        if (post.description.trim().toLowerCase() !== "no description available" && post.description.trim() !== "") {
            snippet = post.description;
        }
        if (snippet.length > 300) {
            snippet = snippet.substring(0, 300) + "...";
        }

        // Insert the snippet with a fade overlay that includes the "Read More" link.
        blogDescription.innerHTML = `
            <div class="description-container">
                <p class="blog-description-text">${snippet}</p>
                <div class="fade-overlay">
                    <a href="${post.link}" target="_blank">Read More</a>
                </div>
            </div>
        `;

        // Smooth fade-in effect for the blog card.
        blogCard.style.opacity = 0;
        setTimeout(() => {
            blogCard.style.opacity = 1;
        }, 300);
    }
};

// Show error message in UI
const showErrorMessage = (message) => {
    blogTitle.innerText = message;
    blogDescription.innerText = "";
    blogLink.style.display = "none";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
};

// Navigation button event listeners
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : posts.length - 1;
    displayPost(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < posts.length - 1) ? currentIndex + 1 : 0;
    displayPost(currentIndex);
});

// Fetch blogs when the page loads
window.onload = fetchBlogs;
