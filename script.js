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
        showBlog(currentIndex); // Show first blog initially

        updateNavButtons();

        nextButton.addEventListener("click", () => {
            if (currentIndex < posts.length - 1) {
                currentIndex++;
                showBlog(currentIndex);
            }
        });

        prevButton.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                showBlog(currentIndex);
            }
        });

    } catch (error) {
        loadingMessage.innerHTML = "Error loading posts. Please try again later.";
        console.error("Error fetching Medium blogs:", error);
    }

    function showBlog(index) {
        const post = posts[index];
        const title = post.title || "Untitled Post";
        const link = post.link || "#";
        const pubDate = new Date(post.pubDate).toDateString();

        blogContainer.innerHTML = `
            <div class="blog-card">
                <h3 class="blog-title">${title}</h3>
                <p class="date">${pubDate}</p>
                <div class="read-more-container">
                    <a href="${link}" target="_blank" class="read-more">Read More</a>
                </div>
            </div>
        `;

        updateNavButtons();
    }

    function updateNavButtons() {
        prevButton.style.display = currentIndex === 0 ? "none" : "block";
        nextButton.style.display = currentIndex === posts.length - 1 ? "none" : "block";
    }
});
