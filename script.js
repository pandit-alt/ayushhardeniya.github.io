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
const blogLink = document.getElementById('blog-link'); // (Link used within fade overlay)
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let posts = [];
let currentIndex = 0;

// Medium RSS feed URL for your profile
const RSS_URL = "https://medium.com/feed/@ayushhardeniya.profile";

const fetchBlogs = async () => {
    try {
        const response = await fetch(RSS_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        // Get the XML response from backend
        const textData = await response.text();
        console.log("Fetched XML Data:", textData);
        
        // Parse the XML string into a DOM object
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "text/xml");
        
        // Check for parsing errors
        const parseError = xml.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            throw new Error("Error parsing XML");
        }
        
        // Use getElementsByTagName to capture all <item> elements
        const items = xml.getElementsByTagName("item");
        console.log("Number of items found:", items.length);
        if (items.length === 0) throw new Error("No blog posts found");
        
        posts = Array.from(items).map(item => ({
            title: item.getElementsByTagName("title")[0]?.textContent || "No title available",
            description: item.getElementsByTagName("description")[0]?.textContent || "No description available",
            link: item.getElementsByTagName("link")[0]?.textContent || "#"
        }));
        
        console.log("Parsed Posts:", posts);
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
        
        // Build a snippet from the description (limit to 300 characters)
        let snippet = post.description.trim();
        if (snippet.length > 300) {
            snippet = snippet.substring(0, 300) + "...";
        }
        
        // Insert the snippet into a container that includes a fade overlay with a "Read More" link
        blogDescription.innerHTML = `
            <div class="description-container">
                <p class="blog-description-text">${snippet}</p>
                <div class="fade-overlay">
                    <a href="${post.link}" target="_blank">Read More</a>
                </div>
            </div>
        `;
        
        // Smooth fade-in effect for the blog card
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

// Use DOMContentLoaded to trigger fetch on mobile reliably
document.addEventListener("DOMContentLoaded", () => {
    fetchBlogs();
});
