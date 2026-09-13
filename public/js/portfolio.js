// Variable to store fetched data so the filter buttons work without re-fetching
let allProjects = [];

function renderProjects(data) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = '<p style="color: rgba(255,255,255,0.7); grid-column: 1 / -1; text-align: center;">No projects found for this category.</p>';
        return;
    }

    grid.innerHTML = data.map(project => `
        <div class="project-card">
            <div class="project-img">
                <i class="fas fa-code"></i>
            </div>
            <div class="project-info">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${(project.techStack || project.tech || []).map(t => `<span>${t}</span>`).join('')}
                </div>
                <a href="${project.link}" class="project-link" target="_blank">View Project <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}

async function initPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    // 1. Fetch live projects from your MongoDB Database
    try {
        const res = await fetch('/api/projects');
        const result = await res.json();

        if (result.success) {
            allProjects = result.data;
            renderProjects(allProjects); // Initial render of all projects
        }
    } catch (err) {
        console.error('Failed to fetch projects from database:', err);
        grid.innerHTML = '<p style="color:#ef4444; grid-column: 1 / -1; text-align: center;">Error loading projects. Please make sure the server is running.</p>';
    }

    // 2. Attach Filter Button Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active styling
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter the dynamically fetched data
            const filter = btn.getAttribute('data-filter');
            let filteredData = allProjects;

            if (filter !== 'all') {
                filteredData = allProjects.filter(p => p.category === filter);
            }
            renderProjects(filteredData);
        });
    });
}

document.addEventListener('DOMContentLoaded', initPortfolio);