// Set Current Year in Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.8rem 5%';
        navbar.style.background = 'rgba(10, 15, 24, 0.9)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.padding = '1.2rem 5%';
        navbar.style.background = 'rgba(22, 28, 45, 0.7)';
        navbar.style.boxShadow = 'none';
    }
});

// Update Active Nav Link based on Scroll
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Fetch and Render Projects
async function loadProjects() {
    const container = document.getElementById('projects-container');
    const loader = document.getElementById('projects-loader');
    
    try {
        // Since we are loading from a local file without a server, using fetch might fail 
        // with CORS/file protocol restrictions in local development, but works on GitHub Pages/Vercel.
        // If it fails locally, ensure you are running a local server.
        const response = await fetch('data/projects.json');
        
        if (!response.ok) {
            throw new Error('Failed to load projects table.');
        }
        
        const projects = await response.json();
        
        // Remove loader
        if (loader) loader.remove();
        
        if (projects.length === 0) {
            container.innerHTML = `<div class="loading-state">
                <p>No projects found. Check back later!</p>
            </div>`;
            return;
        }

        // Sort by date descending (optional)
        projects.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render projects
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            // Build tags HTML
            const tagsHtml = (project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
            
            // Generate link structures
            const demoBtn = project.demoLink && project.demoLink !== '#' 
                ? `<a href="${project.demoLink}" target="_blank" class="project-link"><i class="fa-solid fa-link"></i> Live Demo</a>` 
                : '';
                
            const repoBtn = project.repoLink 
                ? `<a href="${project.repoLink}" target="_blank" class="project-link"><i class="fa-brands fa-github"></i> Repository</a>` 
                : '';

            card.innerHTML = `
                <div class="project-image">
                    <img src="${project.image || 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?q=80&w=600&auto=format&fit=crop'}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-content">
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description || 'A web development project demonstrating core skills and modern methodologies.'}</p>
                    <div class="project-footer">
                        ${demoBtn}
                        ${repoBtn}
                    </div>
                </div>
            `;
            
            container.appendChild(card);
            
            // Animate entry
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        if (container) {
            container.innerHTML = `<div class="loading-state">
                <p style="color:#ef4444;">Error loading projects. Try refreshing or check the console.</p>
            </div>`;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});
