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
const blogLink = document.getElementById('blog-link');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let posts = [];
let currentIndex = 0;

const API_URL = "https://medium-blog-backend-three.vercel.app/medium-feed";

// Fetch blogs from the backend

// Display the current blog post
const displayPost = (index) => {
    if (posts.length > 0) {
        const post = posts[index];
        blogTitle.innerText = post.title;
        blogDescription.innerText = post.description;
        blogLink.href = post.link;
        blogLink.style.display = "inline"; // Show the link

        // Smooth fade-in effect
        blogCard.style.opacity = 0;
        setTimeout(() => {
            blogCard.style.opacity = 1;
        }, 300);
    }
};

const fetchBlogs = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!data.contents) throw new Error("No contents property in API response.");

        const textData = data.contents;
        console.log("XML Data:", textData);

        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "text/xml");

        // Check for parsing errors
        if (xml.querySelector("parsererror")) {
            throw new Error("XML Parsing Error: " + xml.querySelector("parsererror").textContent);
        }

        const items = xml.querySelectorAll("item");
        if (items.length === 0) throw new Error("No blog posts found in XML.");

        posts = Array.from(items).map(item => ({
            title: item.querySelector("title")?.textContent || "No title available",
            description: item.querySelector("description")?.textContent || "No description available",
            link: item.querySelector("link")?.textContent || "#"
        }));

        if (posts.length === 0) throw new Error("Parsed posts array is empty.");

        prevBtn.disabled = false;
        nextBtn.disabled = false;
        displayPost(currentIndex);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        blogTitle.innerText = "Error loading posts.";
        blogDescription.innerText = "Please try again later. " + error.message;
        blogLink.style.display = "none";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }
};

// Button event listeners
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
