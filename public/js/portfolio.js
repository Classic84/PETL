// Variable to store fetched data so the filter buttons work without re-fetching
let allProjects = [];

// Escape user-provided strings before inserting into HTML
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderProjects(data) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    if (!data || data.length === 0) {
        grid.innerHTML = '<p style="color: rgba(255,255,255,0.7); grid-column: 1 / -1; text-align: center;">No projects found for this category.</p>';
        return;
    }

    grid.innerHTML = data.map(project => {
        // Support both new schema (liveLink/imageUrl) and legacy (link/image)
        const liveUrl = project.liveLink || project.link || '';
        const techList = project.techStack || project.tech || [];

        // If a project has no public link, show a "Request Demo" CTA instead
        const ctaHtml = liveUrl
            ? `<a href="${escapeHTML(liveUrl)}" class="project-link" target="_blank" rel="noopener noreferrer">
                   View Project <i class="fas fa-arrow-right"></i>
               </a>`
            : `<a href="#contact" class="project-link">
                   Request Demo <i class="fas fa-arrow-right"></i>
               </a>`;

        return `
        <div class="project-card">
            <div class="project-img">
                <i class="fas fa-code"></i>
            </div>
            <div class="project-info">
                <h4>${escapeHTML(project.title)}</h4>
                <p>${escapeHTML(project.description)}</p>
                <div class="project-tech">
                    ${techList.map(t => `<span>${escapeHTML(t)}</span>`).join('')}
                </div>
                ${ctaHtml}
            </div>
        </div>
        `;
    }).join('');
}

async function initPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    // 1. Fetch live projects from your MongoDB database
    try {
        const res = await fetch('/api/projects');
        const result = await res.json();

        if (result.success) {
            allProjects = result.data;
            renderProjects(allProjects);
        } else {
            console.error('API returned failure:', result.error);
            grid.innerHTML = '<p style="color:#ef4444; grid-column: 1 / -1; text-align: center;">Failed to load projects. Please try again later.</p>';
        }
    } catch (err) {
        console.error('Failed to fetch projects from database:', err);
        grid.innerHTML = '<p style="color:#ef4444; grid-column: 1 / -1; text-align: center;">Error loading projects. Please make sure the server is running.</p>';
    }

    // 2. Attach filter button logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active styling
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter the dynamically fetched data
            const filter = btn.getAttribute('data-filter');
            const filteredData = (filter === 'all')
                ? allProjects
                : allProjects.filter(p => p.category === filter);

            renderProjects(filteredData);
        });
    });
}

document.addEventListener('DOMContentLoaded', initPortfolio);