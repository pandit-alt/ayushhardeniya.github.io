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
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



class LifeNotesManager {
            constructor() {
                this.posts = [];
                this.currentIndex = 0;
                this.container = document.getElementById('lifenotes-container');
                this.loading = document.getElementById('lifenotes-loading');
                this.prevBtn = document.getElementById('lifenotes-prev');
                this.nextBtn = document.getElementById('lifenotes-next');
                this.info = document.getElementById('lifenotes-info');
                
                this.init();
            }

            async init() {
                await this.fetchPosts();
                this.setupEventListeners();
            }

            async fetchPosts() {
                try {
                    const response = await fetch("https://medium-blog-backend-three.vercel.app/medium-feed");
                    this.posts = await response.json();
                    
                    if (!Array.isArray(this.posts) || this.posts.length === 0) {
                        throw new Error("No posts found");
                    }
                    
                    this.loading.style.display = "none";
                    this.renderCurrentPost();
                    this.updateNavigation();
                } catch (error) {
                    this.loading.innerHTML = "Error loading posts. Please try again later.";
                    console.error("Error fetching Medium blogs:", error);
                }
            }

            renderCurrentPost() {
                if (this.posts.length === 0) return;
                
                const post = this.posts[this.currentIndex];
                const title = post.title || "Untitled Post";
                const link = post.link || "#";
                const pubDate = this.formatDate(post.pubDate || post.published);
                const excerpt = this.extractExcerpt(post.content || post.description || "");
                const thumbnail = this.extractImage(post.content || post.description || "");

                this.container.innerHTML = `
                    <div class="blog-card">
                        ${thumbnail ? `<img src="${thumbnail}" alt="${title}" class="blog-image" onerror="this.style.display='none'">` : ''}
                        <h4 class="blog-title">${title}</h4>
                        <div class="blog-meta">
                            <span class="blog-date">${pubDate}</span>
                        </div>
                        <p class="blog-excerpt">${excerpt}</p>
                        <a href="${link}" target="_blank" class="read-more">Read on Medium</a>
                    </div>
                `;
            }

            extractExcerpt(content) {
                if (!content) return "Click to read this fascinating life story and discover insights about personal growth, experiences, and reflections.";
                
                // Remove HTML tags and get first 150 characters
                const text = content.replace(/<[^>]*>/g, '').trim();
                return text.length > 150 ? text.substring(0, 150) + '...' : text;
            }

            extractImage(content) {
                if (!content) return null;
                
                // Try to extract image from content
                const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
                return imgMatch ? imgMatch[1] : null;
            }

            formatDate(dateString) {
                if (!dateString) return "Date not available";
                
                try {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } catch {
                    return "Date not available";
                }
            }

            setupEventListeners() {
                this.prevBtn.addEventListener('click', () => this.goToPrevious());
                this.nextBtn.addEventListener('click', () => this.goToNext());
                
                // Add keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.goToPrevious();
                    if (e.key === 'ArrowRight') this.goToNext();
                });
            }

            goToPrevious() {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.renderCurrentPost();
                    this.updateNavigation();
                    this.addTransitionEffect();
                }
            }

            goToNext() {
                if (this.currentIndex < this.posts.length - 1) {
                    this.currentIndex++;
                    this.renderCurrentPost();
                    this.updateNavigation();
                    this.addTransitionEffect();
                }
            }

            addTransitionEffect() {
                const card = this.container.querySelector('.blog-card');
                if (card) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }
            }

            updateNavigation() {
                this.prevBtn.disabled = this.currentIndex === 0;
                this.nextBtn.disabled = this.currentIndex === this.posts.length - 1;
                this.info.textContent = `${this.currentIndex + 1} / ${this.posts.length}`;
            }
        }

        // Subscription functions
        function subscribeToLifeNotes() {
            // Redirect to Medium subscription page
            window.open('https://medium.com/@ayushhardeniya/subscribe', '_blank');
        }

        function subscribeToCodeNotes() {
            // Redirect to CodeNotes newsletter page
            window.open('https://blog.ayushhardeniya.com/newsletter', '_blank');
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new LifeNotesManager();
        });
  
