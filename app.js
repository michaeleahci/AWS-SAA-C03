document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebarNav = document.getElementById('sidebar-nav');
    const mobileSidebarNav = document.getElementById('mobile-sidebar-nav');
    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    
    // Modal Elements
    const addTopicBtn = document.getElementById('add-topic-btn');
    const addModal = document.getElementById('add-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const addTopicForm = document.getElementById('add-topic-form');

    // State
    let currentId = 'home';
    let knowledgeBaseData = [];
    let categories = {};

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Fetch Data
    async function fetchData() {
        try {
            // Changed to fetch data.json directly for GitHub Pages compatibility
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            knowledgeBaseData = await response.json();
            processData();
            
            // Initial Navigation check
            const hash = window.location.hash.substring(1);
            if (hash && knowledgeBaseData.find(i => i.id === hash)) {
                navigateTo(hash);
            } else {
                navigateTo('home');
            }
            
            // Initial Render
            renderNavigation(sidebarNav, searchInput.value);
            renderNavigation(mobileSidebarNav, mobileSearchInput.value);

        } catch (error) {
            console.error('Error fetching data:', error);
            contentArea.innerHTML = `<div class="p-4 bg-red-100 text-red-700 rounded">Error loading content: ${error.message}. Make sure the server is running.</div>`;
        }
    }

    // Process data into categories
    function processData() {
        categories = {};
        knowledgeBaseData.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });
    }

    // Function to render navigation
    function renderNavigation(navElement, filterText = '') {
        navElement.innerHTML = '';
        const filter = filterText.toLowerCase();

        // Sort categories alphabetically or by a predefined order if needed
        // For now, object keys order (insertion order usually)
        
        Object.keys(categories).forEach(category => {
            const items = categories[category].filter(item => 
                item.title.toLowerCase().includes(filter) || 
                item.content.toLowerCase().includes(filter)
            );

            if (items.length > 0) {
                // Category Header
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2';
                categoryHeader.textContent = category;
                navElement.appendChild(categoryHeader);

                // Items
                items.forEach(item => {
                    const link = document.createElement('a');
                    link.href = `#${item.id}`;
                    link.className = `nav-item block px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors ${currentId === item.id ? 'active' : 'text-slate-300'}`;
                    link.textContent = item.title;
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        navigateTo(item.id);
                        if (window.innerWidth < 768) {
                            closeMobileMenu();
                        }
                    });
                    navElement.appendChild(link);
                });
            }
        });
    }

    // Function to navigate to a page
    function navigateTo(id) {
        currentId = id;
        const item = knowledgeBaseData.find(i => i.id === id);
        
        if (item) {
            // Update content
            contentArea.innerHTML = item.content;
            
            // Re-initialize icons for new content
            if (window.lucide) {
                lucide.createIcons();
            }
            
            // Scroll to top
            document.querySelector('main').scrollTop = 0;

            // Update URL hash without scrolling
            history.pushState(null, null, `#${id}`);

            // Re-render nav to update active state
            renderNavigation(sidebarNav, searchInput.value);
            renderNavigation(mobileSidebarNav, mobileSearchInput.value);
        }
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        renderNavigation(sidebarNav, e.target.value);
    });

    mobileSearchInput.addEventListener('input', (e) => {
        renderNavigation(mobileSidebarNav, e.target.value);
    });

    // Mobile Menu Toggle
    function openMobileMenu() {
        mobileSidebar.classList.remove('-translate-x-full');
        mobileSidebarOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileSidebar.classList.add('-translate-x-full');
        mobileSidebarOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', openMobileMenu);
    closeSidebarBtn.addEventListener('click', closeMobileMenu);
    mobileSidebarOverlay.addEventListener('click', closeMobileMenu);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && knowledgeBaseData.find(i => i.id === hash)) {
            navigateTo(hash);
        } else {
            navigateTo('home');
        }
    });

    // Modal Logic
    function openModal() {
        addModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        addModal.classList.add('hidden');
        document.body.style.overflow = '';
        addTopicForm.reset();
    }

    if (addTopicBtn) {
        addTopicBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Form Submission
    if (addTopicForm) {
        addTopicForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('topic-title').value;
            const category = document.getElementById('topic-category').value;
            const rawContent = document.getElementById('topic-content').value;
            
            // Convert Markdown to HTML
            const content = marked.parse(rawContent);
            
            // Generate a simple ID
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const newTopic = {
                id,
                title,
                category,
                content
            };

            try {
                const response = await fetch('/api/topics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTopic)
                });

                if (response.ok) {
                    // Refresh data
                    await fetchData();
                    closeModal();
                    navigateTo(id); // Navigate to new topic
                    alert('Topic added successfully!');
                } else {
                    const errorData = await response.json();
                    alert('Error adding topic: ' + (errorData.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Network error: ' + error.message);
            }
        });
    }

    // Start
    fetchData();
});
