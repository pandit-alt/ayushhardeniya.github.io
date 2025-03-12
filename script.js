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
            }, 1000);
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

/* --- Blog Fetching and Display Section --- */
const blogCard = document.getElementById('blog-card');
const blogTitle = document.getElementById('blog-title');
const blogDescription = document.getElementById('blog-description');
const blogLink = document.getElementById('blog-link'); // (Not used directly; Read More is in the overlay)
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let posts = [];
let currentIndex = 0;

// Use your backend URL that returns JSON with a "contents" property (the XML string)
const API_URL = "https://medium-blog-backend-three.vercel.app/medium-feed";

const fetchBlogs = async () => {
    try {
        console.log("Starting fetch from:", API_URL);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const data = await response.json();
        console.log("Fetched Data:", data);
        
        if (!data.contents) throw new Error("Response does not contain 'contents'");
        
        const textData = data.contents;
        console.log("XML Data:", textData);
        
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "text/xml");
        const items = xml.querySelectorAll("item");
        
        if (items.length === 0) throw new Error("No blog posts found");
        
        posts = Array.from(items).map(item => ({
            title: item.querySelector("title")?.textContent || "No title available",
            description: item.querySelector("description")?.textContent || "No description available",
            link: item.querySelector("link")?.textContent || "#"
        }));
        
        console.log("Parsed Posts:", posts);
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

const displayPost = (index) => {
    if (posts.length > 0) {
        const post = posts[index];
        blogTitle.innerText = post.title;
        blogLink.href = post.link;
        
        // Create a snippet (limit to 300 characters) if description is longer
        let snippet = "";
        if (post.description.trim().toLowerCase() !== "no description available" && post.description.trim() !== "") {
            snippet = post.description;
        }
        if (snippet.length > 300) {
            snippet = snippet.substring(0, 300) + "...";
        }
        
        blogDescription.innerHTML = `
            <div class="description-container">
                <p class="blog-description-text">${snippet}</p>
                <div class="fade-overlay">
                    <a href="${post.link}" target="_blank">Read More</a>
                </div>
            </div>
        `;
        
        // Smooth fade-in effect
        blogCard.style.opacity = 0;
        setTimeout(() => {
            blogCard.style.opacity = 1;
        }, 300);
    }
};

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : posts.length - 1;
    displayPost(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < posts.length - 1) ? currentIndex + 1 : 0;
    displayPost(currentIndex);
});

// Use DOMContentLoaded to ensure the DOM is ready on mobile
document.addEventListener("DOMContentLoaded", () => {
    fetchBlogs();
});
