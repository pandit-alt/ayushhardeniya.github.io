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
    const blogContainer = document.getElementById("blog-container"); // Make sure this ID exists in your HTML
    const loadingMessage = document.getElementById("loading-message");

    try {
        const response = await fetch("https://medium-blog-backend-three.vercel.app/medium-feed");
        const posts = await response.json();

        if (!Array.isArray(posts) || posts.length === 0) {
            throw new Error("No posts found");
        }

        loadingMessage.style.display = "none"; // Hide loading message

        posts.slice(0, 6).forEach((post) => { // Display only latest 6 posts
            const blogCard = document.createElement("div");
            blogCard.classList.add("blog-card");

            // Extract data from the post
            const title = post.title || "Untitled Post";
            const link = post.link || "#";
            const description = post.description ? post.description.split("<")[0] : "No description available"; // Clean HTML tags
            const pubDate = new Date(post.pubDate).toDateString();

            // Create Blog Card
            blogCard.innerHTML = `
                <h3>${title}</h3>
                <p class="date">${pubDate}</p>
                <p class="description">${description}</p>
                <a href="${link}" target="_blank" class="read-more">Read More</a>
            `;

            blogContainer.appendChild(blogCard);
        });
    } catch (error) {
        loadingMessage.innerHTML = "Error loading posts. Please try again later.";
        console.error("Error fetching Medium blogs:", error);
    }
});
