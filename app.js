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
    const langToggleBtn = document.getElementById('lang-toggle-btn');

    // State
    let currentId = 'home';
    let currentLang = 'en'; // 'en' or 'zh'
    let knowledgeBaseData = [];
    let categories = {};
    let isEditing = false;
    let editingId = null;

    // Language Toggle Logic
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        langToggleBtn.textContent = currentLang.toUpperCase();
        
        // Re-render everything
        renderNavigation(sidebarNav, searchInput.value);
        renderNavigation(mobileSidebarNav, mobileSearchInput.value);
        
        // Update current content if viewing a page
        if (currentId) {
            navigateTo(currentId);
        }
    });

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize Quill Editors
    const quillEn = new Quill('#editor-container-en', {
        theme: 'snow',
        placeholder: 'Enter content in English...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'blockquote', 'code-block'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        }
    });

    const quillZh = new Quill('#editor-container-zh', {
        theme: 'snow',
        placeholder: '输入中文内容...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'blockquote', 'code-block'],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        }
    });

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
            const items = categories[category].filter(item => {
                const title = item.title[currentLang] || item.title['en'] || '';
                const content = item.content[currentLang] || item.content['en'] || '';
                return title.toLowerCase().includes(filter) || content.toLowerCase().includes(filter);
            });

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
                    link.textContent = item.title[currentLang] || item.title['en'];
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
            // Clear content area
            contentArea.innerHTML = '';

            // Edit Button Container
            const editBtnContainer = document.createElement('div');
            editBtnContainer.className = 'flex justify-end mb-4 border-b border-gray-200 pb-2';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'px-3 py-1.5 bg-slate-100 text-slate-700 rounded border border-slate-300 hover:bg-slate-200 flex items-center gap-2 text-xs font-medium transition-colors';
            editBtn.innerHTML = '<i data-lucide="edit" class="w-3 h-3"></i> Edit';
            editBtn.onclick = () => openEditModal(item);
            
            editBtnContainer.appendChild(editBtn);
            contentArea.appendChild(editBtnContainer);

            // Content
            const contentDiv = document.createElement('div');
            const content = item.content[currentLang] || item.content['en'] || '<p>Content not available in this language.</p>';
            contentDiv.innerHTML = content;
            contentArea.appendChild(contentDiv);
            
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
    function showModal() {
        addModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function openAddModal() {
        isEditing = false;
        editingId = null;
        const modalTitle = document.getElementById('modal-title');
        const submitBtnText = document.getElementById('submit-btn-text');
        if (modalTitle) modalTitle.textContent = 'Add New Topic';
        if (submitBtnText) submitBtnText.textContent = 'Add Topic';
        addTopicForm.reset();
        
        // Clear editors
        quillEn.setText('');
        quillZh.setText('');
        
        showModal();
    }

    function openEditModal(topic) {
        isEditing = true;
        editingId = topic.id;
        const modalTitle = document.getElementById('modal-title');
        const submitBtnText = document.getElementById('submit-btn-text');
        if (modalTitle) modalTitle.textContent = 'Edit Topic';
        if (submitBtnText) submitBtnText.textContent = 'Save Changes';
        
        document.getElementById('topic-title-en').value = topic.title.en || '';
        document.getElementById('topic-title-zh').value = topic.title.zh || '';
        document.getElementById('topic-category').value = topic.category || '';
        
        // Load HTML content directly into Quill
        const contentEn = topic.content.en || '';
        const contentZh = topic.content.zh || '';
        
        // Use clipboard to paste HTML
        quillEn.clipboard.dangerouslyPasteHTML(contentEn);
        quillZh.clipboard.dangerouslyPasteHTML(contentZh);

        showModal();
    }

    function closeModal() {
        addModal.classList.add('hidden');
        document.body.style.overflow = '';
        addTopicForm.reset();
        isEditing = false;
        editingId = null;
    }

    if (addTopicBtn) {
        addTopicBtn.addEventListener('click', openAddModal);
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
            
            const titleEn = document.getElementById('topic-title-en').value;
            const titleZh = document.getElementById('topic-title-zh').value;
            const category = document.getElementById('topic-category').value;
            
            // Get HTML content from Quill
            // root.innerHTML gives us the HTML representation of the editor content
            const contentEn = quillEn.root.innerHTML;
            const contentZh = quillZh.root.innerHTML;
            
            // Generate ID only if adding new
            const id = isEditing ? editingId : titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const newTopic = {
                id,
                category,
                title: {
                    en: titleEn,
                    zh: titleZh
                },
                content: {
                    en: contentEn,
                    zh: contentZh
                },
                // We no longer store markdown source as we use WYSIWYG
                markdown: null 
            };

            try {
                const url = isEditing ? `/api/topics/${id}` : '/api/topics';
                const method = isEditing ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTopic)
                });

                if (response.ok) {
                    // Refresh data
                    await fetchData();
                    closeModal();
                    navigateTo(id); // Navigate to topic
                    alert(isEditing ? 'Topic updated successfully!' : 'Topic added successfully!');
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
