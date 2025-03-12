// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navLinks.style.animation = 'rollUp 1s ease forwards';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 1000);
    } else {
        navLinks.style.display = 'flex';
        navLinks.classList.add('active');
        navLinks.style.animation = 'rollDown 1s ease forwards';
    }
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navLinks.style.animation = 'rollUp 1s ease forwards';
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 1000);
        }
    });
});

// Smooth Scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Blog Section Variables
const blogCard = document.getElementById('blog-card');
const blogTitle = document.getElementById('blog-title');
const blogDescription = document.getElementById('blog-description');
const blogLink = document.getElementById('blog-link');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let posts = [];
let currentIndex = 0;
const API_URL = "https://medium-blog-backend-three.vercel.app/medium-feed";

// Fetch Blogs
const fetchBlogs = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const textData = data.contents;
        
        // Parse XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "text/xml");

        const items = xml.querySelectorAll("item");
        if (items.length === 0) throw new Error("No blog posts found");

        posts = Array.from(items).map(item => ({
            title: item.querySelector("title")?.textContent || "No title available",
            description: item.querySelector("description")?.textContent || "No description available",
            link: item.querySelector("link")?.textContent || "#"
        }));

        prevBtn.disabled = false;
        nextBtn.disabled = false;
        displayPost(currentIndex);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        showErrorMessage("Error loading posts. Please try again later.");
    }
};

// Display Blog Post
const displayPost = (index) => {
    if (posts.length > 0) {
        const post = posts[index];
        
        // Set content
        blogTitle.innerText = post.title;
        blogDescription.innerHTML = post.description;
        blogLink.href = post.link;
        blogLink.style.display = "inline"; // Show Read More button

        // Apply fade-in effect
        blogCard.style.opacity = 0;
        setTimeout(() => {
            blogCard.style.opacity = 1;
        }, 300);
    } else {
        showErrorMessage("No posts available.");
    }
};

// Show Error Message in UI
const showErrorMessage = (message) => {
    blogTitle.innerText = message;
    blogDescription.innerText = "";
    blogLink.style.display = "none";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
};

// Navigation Buttons
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : posts.length - 1;
    displayPost(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < posts.length - 1) ? currentIndex + 1 : 0;
    displayPost(currentIndex);
});

// Fetch Blogs on Load
window.onload = fetchBlogs;
