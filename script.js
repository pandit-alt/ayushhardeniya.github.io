// Your existing JavaScript code integrated properly
        
        // Mobile Menu Toggle (from your existing code)
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenu && navLinks) {
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
        }

        // Nav link handling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navLinks.style.animation = 'rollUp 1s ease forwards';
                    setTimeout(() => {
                        navLinks.style.display = 'none';
                    }, 1000);
                }
            });
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        /* YOUR EXISTING Blog Fetching Code - EXACTLY AS PROVIDED */
        document.addEventListener("DOMContentLoaded", async function () {
            const blogContainer = document.getElementById("lifenotes-grid");
            const loadingMessage = document.getElementById("lifenotes-loading");
            
            try {
                const response = await fetch("https://medium-blog-backend-three.vercel.app/medium-feed");
                const posts = await response.json();
                
                if (!Array.isArray(posts) || posts.length === 0) {
                    throw new Error("No posts found");
                }
                
                // Hide loading message
                if (loadingMessage) {
                    loadingMessage.style.display = "none";
                }
                
                // Clear container and populate with actual Medium articles
                blogContainer.innerHTML = '';
                
                posts.forEach((post, index) => {
                    const title = post.title || "Untitled Post";
                    const link = post.link || "#";
                    
                    // Check for different possible date keys (from your existing code)
                    const pubDate = post.pubDate ? new Date(post.pubDate).toLocaleDateString() : 
                                   post.published ? new Date(post.published).toLocaleDateString() :
                                   "Date not available";
                    
                    // Create excerpt from available content
                    const excerpt = post.contentSnippet || post.description || 
                                   post.summary || "Click to read this article on Medium.";
                    
                    const articleCard = document.createElement('article');
                    articleCard.className = 'blog-card';
                    articleCard.innerHTML = `
                        <div class="blog-header">
                            <div class="blog-image lifenotes"></div>
                            <div class="blog-title-section">
                                <span class="blog-category lifenotes">LifeNotes</span>
                                <h3 class="blog-title">${title}</h3>
                            </div>
                        </div>
                        <p class="blog-excerpt">${excerpt}</p>
                        <div class="blog-meta">
                            <span class="blog-date">${pubDate}</span>
                            <a href="${link}" target="_blank" class="read-time">📖 Read on Medium</a>
                        </div>
                    `;
                    
                    blogContainer.appendChild(articleCard);
                });
                
            } catch (error) {
                if (loadingMessage) {
                    loadingMessage.innerHTML = "Error loading posts from Medium. Please try again later.";
                    loadingMessage.classList.remove('pulse');
                }
                console.error("Error fetching Medium blogs:", error);
            }
        });

        // Add scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        // Initialize animations after content loads
        setTimeout(() => {
            document.querySelectorAll('.blog-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }, 500);
