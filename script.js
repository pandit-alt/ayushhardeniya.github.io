// LifeNotes Carousel Class
        class LifeNotesCarousel {
            constructor(posts) {
                this.posts = posts;
                this.currentIndex = 0;
                this.isPlaying = true;
                this.autoPlayInterval = null;
                this.progressInterval = null;
                this.autoPlayDuration = 5000; // 5 seconds per slide
                this.progressWidth = 0;
                
                this.init();
            }
            
            init() {
                this.render();
                this.bindEvents();
                this.startAutoPlay();
            }
            
            render() {
                const container = document.getElementById('lifenotes-container');
                const track = document.getElementById('lifenotes-track');
                const indicators = document.getElementById('lifenotes-indicators');
                
                // Show container
                container.style.display = 'block';
                
                // Render slides
                track.innerHTML = this.posts.map(post => {
                    const title = post.title || "Untitled Post";
                    const link = post.link || "#";
                    const pubDate = post.pubDate ? new Date(post.pubDate).toDateString() : 
                                   post.published ? new Date(post.published).toDateString() :
                                   "Date not available";
                    
                    return `
                        <div class="carousel-slide">
                            <a href="${link}" target="_blank" class="carousel-post-title">${title}</a>
                            <div class="carousel-post-meta">${pubDate}</div>
                        </div>
                    `;
                }).join('');
                
                // Render indicators
                indicators.innerHTML = this.posts.map((_, index) => 
                    `<div class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
                ).join('');
                
                this.updateSlidePosition();
            }
            
            bindEvents() {
                // Navigation buttons
                document.getElementById('lifenotes-prev').addEventListener('click', () => this.prevSlide());
                document.getElementById('lifenotes-next').addEventListener('click', () => this.nextSlide());
                
                // Pause/Play button
                document.getElementById('lifenotes-pause').addEventListener('click', () => this.toggleAutoPlay());
                
                // Indicators
                document.querySelectorAll('#lifenotes-indicators .carousel-indicator').forEach(indicator => {
                    indicator.addEventListener('click', (e) => {
                        const index = parseInt(e.target.dataset.index);
                        this.goToSlide(index);
                    });
                });
                
                // Pause on hover
                const container = document.getElementById('lifenotes-container');
                container.addEventListener('mouseenter', () => this.pauseAutoPlay());
                container.addEventListener('mouseleave', () => this.resumeAutoPlay());
            }
            
            updateSlidePosition() {
                const track = document.getElementById('lifenotes-track');
                track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
                
                // Update indicators
                document.querySelectorAll('#lifenotes-indicators .carousel-indicator').forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === this.currentIndex);
                });
            }
            
            nextSlide() {
                this.currentIndex = (this.currentIndex + 1) % this.posts.length;
                this.updateSlidePosition();
                this.resetProgress();
            }
            
            prevSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.posts.length) % this.posts.length;
                this.updateSlidePosition();
                this.resetProgress();
            }
            
            goToSlide(index) {
                this.currentIndex = index;
                this.updateSlidePosition();
                this.resetProgress();
            }
            
            startAutoPlay() {
                if (this.isPlaying) {
                    this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDuration);
                    this.startProgress();
                }
            }
            
            stopAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                    this.autoPlayInterval = null;
                }
                this.stopProgress();
            }
            
            pauseAutoPlay() {
                this.stopAutoPlay();
            }
            
            resumeAutoPlay() {
                if (this.isPlaying) {
                    this.startAutoPlay();
                }
            }
            
            toggleAutoPlay() {
                const button = document.getElementById('lifenotes-pause');
                if (this.isPlaying) {
                    this.isPlaying = false;
                    this.stopAutoPlay();
                    button.innerHTML = '▶';
                } else {
                    this.isPlaying = true;
                    this.startAutoPlay();
                    button.innerHTML = '⏸';
                }
            }
            
            startProgress() {
                this.progressWidth = 0;
                this.progressInterval = setInterval(() => {
                    this.progressWidth += (100 / (this.autoPlayDuration / 100));
                    if (this.progressWidth >= 100) {
                        this.progressWidth = 100;
                    }
                    document.getElementById('lifenotes-progress').style.width = this.progressWidth + '%';
                }, 100);
            }
            
            stopProgress() {
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                    this.progressInterval = null;
                }
            }
            
            resetProgress() {
                this.stopProgress();
                this.progressWidth = 0;
                document.getElementById('lifenotes-progress').style.width = '0%';
                if (this.isPlaying) {
                    this.startProgress();
                }
            }
        }

        // LifeNotes (Medium) - using your existing setup
        async function fetchLifeNotes() {
            const loadingMessage = document.getElementById("lifenotes-loading");
            
            try {
                const response = await fetch("https://medium-blog-backend-three.vercel.app/medium-feed");
                const posts = await response.json();
                
                if (!Array.isArray(posts) || posts.length === 0) {
                    throw new Error("No posts found");
                }
                
                loadingMessage.style.display = "none";
                
                // Initialize carousel
                new LifeNotesCarousel(posts);
                
            } catch (error) {
                loadingMessage.innerHTML = "Error loading LifeNotes. Please try again later.";
                console.error("Error fetching LifeNotes:", error);
            }
        }

        // CodeNotes (Hashnode) - to be implemented
        async function fetchCodeNotes() {
            try {
                // Your CodeNotes fetching logic will go here
                // const response = await fetch('YOUR_CODENOTES_RSS_ENDPOINT');
                // const data = await response.json();
                
                // For now, show a placeholder
                document.getElementById('codenotes-loading').innerHTML = 'CodeNotes integration coming soon...';
                
                // displayCodeNotes(data);
            } catch (error) {
                console.error('Error fetching CodeNotes:', error);
                document.getElementById('codenotes-loading').innerHTML = 'Failed to load CodeNotes. Please try again later.';
            }
        }

        // Remove the old displayLifeNotes function as it's now handled by the carousel class

        function displayCodeNotes(data) {
            const container = document.getElementById('codenotes-container');
            if (data && data.items) {
                container.innerHTML = data.items.slice(0, 5).map(post => `
                    <article class="blog-post">
                        <a href="${post.link}" target="_blank" class="post-title">${post.title}</a>
                        <div class="post-meta">${new Date(post.pubDate).toLocaleDateString()}</div>
                        <p class="post-excerpt">${post.description?.substring(0, 150)}...</p>
                    </article>
                `).join('');
            }
        }

        // Initialize the blog sections
        document.addEventListener('DOMContentLoaded', function() {
            fetchLifeNotes();
            fetchCodeNotes();
        });
    
