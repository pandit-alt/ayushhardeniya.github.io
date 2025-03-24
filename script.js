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
const API_URL = "https://medium-blog-backend-three.vercel.app/"; 

const blogContainer = document.getElementById("blog-container");

async function fetchBlogs() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const blogs = await response.json();
        if (!blogs.length) throw new Error("No blog posts found");

        let blogHTML = "";
        blogs.slice(0, 5).forEach(blog => {
            const title = blog.title[0] || "Untitled";
            const link = blog.link[0] || "#";
            const description = blog.description[0]?.substring(0, 150) || "No description";

            blogHTML += `
                <div class="blog-card">
                    <h3>${title}</h3>
                    <p>${description}...</p>
                    <a href="${link}" target="_blank" class="read-more">Read More</a>
                </div>
            `;
        });

        blogContainer.innerHTML = blogHTML;
    } catch (error) {
        blogContainer.innerHTML = `<p>Error loading posts. Please try again later.</p>`;
    }
}

window.onload = fetchBlogs;
