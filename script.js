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

/* Blog Fetching */
document.addEventListener("DOMContentLoaded", async function () {
    const blogContainer = document.getElementById("blog-container");
    const loadingMessage = document.getElementById("loading-message");
    const prevButton = document.getElementById("prev-blog");
    const nextButton = document.getElementById("next-blog");

    let currentIndex = 0;
    let posts = [];

    try {
        const response = await fetch("https://medium-blog-backend-three.vercel.app/medium-feed");
        posts = await response.json();

        if (!Array.isArray(posts) || posts.length === 0) {
            throw new Error("No posts found");
        }

        loadingMessage.style.display = "none"; // Hide loading message

        // Show the first post initially
        showBlog(currentIndex);

        // Navigation buttons functionality
        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % posts.length;
            showBlog(currentIndex);
        });

        prevButton.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + posts.length) % posts.length;
            showBlog(currentIndex);
        });

    } catch (error) {
        loadingMessage.innerHTML = "Error loading posts. Please try again later.";
        console.error("Error fetching Medium blogs:", error);
    }

    function showBlog(index) {
        const post = posts[index];
        const title = post.title || "Untitled Post";
        const link = post.link || "#";
        const description = post["content:encoded"] || post.description || "No description available"; // Extract description properly
        const pubDate = new Date(post.pubDate).toDateString();

        blogContainer.innerHTML = `
            <div class="blog-card">
                <h3>${title}</h3>
                <p class="date">${pubDate}</p>
                <p class="description">${stripHtml(description)}</p>
                <a href="${link}" target="_blank" class="read-more">Read More</a>
            </div>
        `;
    }

    // Function to remove HTML tags from description
    function stripHtml(html) {
        let doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    }
});
