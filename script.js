// Task 2: Dynamic Data Rendering
// Fetch and render JSON data with reusable components

// Configuration
const API_URL = 'https://dev.deepthought.education/assets/uploads/files/files/others/ddugky_project.json';
const LOCAL_DATA_URL = './data.json';

// Fallback data for development/testing
const FALLBACK_DATA = {
    "status": "published",
    "tasks": [
        {
            "task_id": 18882,
            "task_title": "Explore the world of management",
            "task_description": "As a project manager, you play an important role in leading a project through initiation, planning, execution, monitoring, controlling and completion. How? Do you want to manage each and every step of your life?",
            "status": "notworkyet",
            "assets": [
                {
                    "asset_id": 18883,
                    "asset_title": "Technical Project Management",
                    "asset_description": "Story of Alignment Scope of Agility Specific Accountable Staggering Approach",
                    "asset_content": "https://www.youtube.com/embed/TiMRwri1xJ8",
                    "asset_type": "display_asset",
                    "asset_content_type": "video"
                },
                {
                    "asset_id": 18884,
                    "asset_title": "Threadbuild",
                    "asset_description": "Watch the video and thread build, and jot out key threads while watching that video.",
                    "asset_content": "Create threads and organize your thoughts while learning",
                    "asset_type": "interactive_asset",
                    "asset_content_type": "text"
                },
                {
                    "asset_id": 18885,
                    "asset_title": "Structure You Pointers",
                    "asset_description": "Write a 400-500 word article, from your thread. Publish your understanding, and showcase your learning to the entire world.",
                    "asset_content": "https://example.com/article-template.pdf",
                    "asset_type": "display_asset",
                    "asset_content_type": "document"
                },
                {
                    "asset_id": 18886,
                    "asset_title": "4SA Method",
                    "asset_description": "To explore more read more",
                    "asset_content": "https://example.com/4sa-method-diagram.png",
                    "asset_type": "display_asset",
                    "asset_content_type": "image"
                }
            ]
        },
        {
            "task_id": 18887,
            "task_title": "Advanced Project Management",
            "task_description": "Dive deeper into advanced project management techniques and methodologies.",
            "status": "in_progress",
            "assets": [
                {
                    "asset_id": 18888,
                    "asset_title": "Agile Methodology",
                    "asset_description": "Learn about Agile project management approaches",
                    "asset_content": "https://www.youtube.com/embed/9TycLR0TqFA",
                    "asset_type": "display_asset",
                    "asset_content_type": "video"
                },
                {
                    "asset_id": 18889,
                    "asset_title": "Risk Management",
                    "asset_description": "Understanding and managing project risks effectively",
                    "asset_content": "Risk management is a critical aspect of project management...",
                    "asset_type": "display_asset",
                    "asset_content_type": "text"
                }
            ]
        }
    ]
};

// Global variables
let projectData = null;
let currentTaskId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    console.log('JavaScript is working!');
    
    // Test if we can find the main elements
    const mainContent = document.querySelector('.main-content');
    const cardsGrid = document.querySelector('.cards-grid');
    const introSection = document.querySelector('.intro-section');
    console.log('Main content found:', !!mainContent);
    console.log('Cards grid found:', !!cardsGrid);
    console.log('Intro section found:', !!introSection);
    
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        initializeApp();
    }, 100);
});

async function initializeApp() {
    try {
        console.log('Starting app initialization...');
        showLoadingState();
        
        console.log('Fetching project data...');
        await fetchProjectData();
        
        console.log('Rendering project data...');
        renderProjectData();
        
        console.log('App initialization complete!');
        hideLoadingState();
    } catch (error) {
        console.error('Error initializing app:', error);
        showErrorState(error.message);
    }
}

// Fetch project data from API
async function fetchProjectData() {
    // Try multiple data sources in order of preference
    const dataSources = [
        { url: API_URL, name: 'Remote API' },
        { url: LOCAL_DATA_URL, name: 'Local JSON file' },
        { data: FALLBACK_DATA, name: 'Fallback data' }
    ];

    for (const source of dataSources) {
        try {
            if (source.data) {
                // Use fallback data directly
                projectData = source.data;
                console.log(`Using ${source.name}:`, projectData);
                showNotification(`Using ${source.name}`, 'warning');
                return;
            }

            console.log(`Attempting to fetch data from: ${source.url}`);
            
            const response = await fetch(source.url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            projectData = await response.json();
            console.log(`Project data loaded from ${source.name}:`, projectData);
            showNotification(`Data loaded from ${source.name}`, 'success');
            return;
            
        } catch (error) {
            console.warn(`${source.name} failed:`, error.message);
            continue; // Try next source
        }
    }
    
    // If all sources fail, throw error
    throw new Error('All data sources failed');
}

// Render the project data
function renderProjectData() {
    console.log('renderProjectData called with:', projectData);
    
    if (!projectData || !projectData.tasks) {
        throw new Error('No project data available');
    }

    // Get URL parameters to determine which task to show
    const urlParams = new URLSearchParams(window.location.search);
    currentTaskId = urlParams.get('taskId');
    
    console.log('Current task ID:', currentTaskId);

    if (currentTaskId) {
        // Show specific task
        console.log('Rendering single task:', currentTaskId);
        renderSingleTask(currentTaskId);
    } else {
        // Show all tasks (default behavior)
        console.log('Rendering all tasks');
        renderAllTasks();
    }
}

// Render a single task
function renderSingleTask(taskId) {
    const task = projectData.tasks.find(t => t.task_id == taskId);
    if (!task) {
        showErrorState(`Task with ID ${taskId} not found`);
        return;
    }

    // Update page title
    document.title = `${task.task_title} - Deep Thought`;
    
    // Update main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        mainTitle.textContent = task.task_title;
    }

    // Update intro section
    updateIntroSection(task);

    // Clear existing cards and render assets
    const cardsGrid = document.querySelector('.cards-grid');
    if (cardsGrid) {
        cardsGrid.innerHTML = '';
        renderAssetsForTask(task, cardsGrid);
    }
}

// Render all tasks
function renderAllTasks() {
    console.log('renderAllTasks called');
    
    // Update main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        mainTitle.textContent = 'Project Management';
        console.log('Updated main title');
    }

    // Update intro section with project description
    updateIntroSection(projectData);
    console.log('Updated intro section');

    // Clear existing cards and render all tasks
    const cardsGrid = document.querySelector('.cards-grid');
    if (cardsGrid) {
        console.log('Found cards grid, clearing and rendering tasks...');
        cardsGrid.innerHTML = '';
        
        projectData.tasks.forEach((task, index) => {
            console.log(`Rendering task ${index + 1}:`, task.task_title);
            renderAssetsForTask(task, cardsGrid);
        });
        
        console.log('All tasks rendered');
    } else {
        console.error('Cards grid not found! Trying to find alternative container...');
        
        // Try to find the main content area as fallback
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            console.log('Using main content as fallback container');
            projectData.tasks.forEach((task, index) => {
                console.log(`Rendering task ${index + 1}:`, task.task_title);
                renderAssetsForTask(task, mainContent);
            });
        } else {
            console.error('No suitable container found!');
        }
    }
}

// Update intro section with task/project description
function updateIntroSection(data) {
    console.log('updateIntroSection called with:', data);
    
    const introSection = document.querySelector('.intro-section');
    if (introSection) {
        const title = introSection.querySelector('h2');
        const description = introSection.querySelector('p');
        
        if (title) {
            // For project data, use a default title since there's no project-level title
            title.textContent = 'Explore the world of management';
            console.log('Updated intro title');
        }
        
        if (description) {
            // For project data, use a default description since there's no project-level description
            description.textContent = 'As a project manager, you play an important role in leading a project through initiation, planning, execution, monitoring, controlling and completion. How? Do you want to manage each and every step of your life?';
            console.log('Updated intro description');
        }
    } else {
        console.error('Intro section not found!');
    }
}

// Render assets for a specific task
function renderAssetsForTask(task, container) {
    if (!task.assets || task.assets.length === 0) {
        console.warn(`No assets found for task ${task.task_id}`);
        return;
    }

    task.assets.forEach(asset => {
        const assetElement = createAssetContainer(asset);
        container.appendChild(assetElement);
    });
}

// Reusable Asset Container Function
function createAssetContainer(asset) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-asset-id', asset.asset_id);

    // Create card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.innerHTML = `
        <span>${escapeHtml(asset.asset_title)}</span>
        <i class="fas fa-info-circle"></i>
    `;

    // Create card content based on asset type
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Add description
    if (asset.asset_description) {
        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = asset.asset_description;
        cardContent.appendChild(description);
    }

    // Render content based on asset type
    const contentElement = renderAssetContent(asset);
    if (contentElement) {
        cardContent.appendChild(contentElement);
    }

    card.appendChild(cardHeader);
    card.appendChild(cardContent);

    return card;
}

// Render asset content based on type
function renderAssetContent(asset) {
    const contentType = asset.asset_content_type;
    const content = asset.asset_content;

    switch (contentType) {
        case 'video':
            return createVideoPlayer(content, asset);
        case 'text':
            return createTextContent(content, asset);
        case 'image':
            return createImageContent(content, asset);
        case 'document':
            return createDocumentContent(content, asset);
        default:
            return createGenericContent(content, asset);
    }
}

// Create video player component
function createVideoPlayer(videoUrl, asset) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-player';

    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(videoUrl);
    
    if (videoId) {
        videoContainer.innerHTML = `
            <div class="video-header">
                <div class="video-title">
                    <i class="fas fa-play-circle"></i>
                    <span>${escapeHtml(asset.asset_title)}</span>
                </div>
                <div class="video-actions">
                    <button class="watch-later" onclick="addToWatchLater('${videoId}')">
                        <i class="fas fa-clock"></i>
                        Watch Later
                    </button>
                    <button class="share-btn" onclick="shareVideo('${videoId}')">Share</button>
                </div>
            </div>
            <div class="video-content">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
            <div class="video-footer">
                <button class="youtube-btn" onclick="openYouTube('${videoId}')">
                    Watch on YouTube
                </button>
                <div class="video-duration">Video Content</div>
            </div>
        `;
    } else {
        // Fallback for non-YouTube videos
        videoContainer.innerHTML = `
            <div class="video-header">
                <div class="video-title">
                    <i class="fas fa-video"></i>
                    <span>${escapeHtml(asset.asset_title)}</span>
                </div>
            </div>
            <div class="video-content">
                <video controls style="width: 100%; height: 200px;">
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
    }

    return videoContainer;
}

// Create text content component
function createTextContent(text, asset) {
    const textContainer = document.createElement('div');
    textContainer.className = 'text-content';
    
    // If it's a URL, create a link
    if (isUrl(text)) {
        textContainer.innerHTML = `
            <div class="text-header">
                <i class="fas fa-file-text"></i>
                <span>Text Content</span>
            </div>
            <div class="text-body">
                <a href="${text}" target="_blank" class="content-link">
                    <i class="fas fa-external-link-alt"></i>
                    Open Content
                </a>
            </div>
        `;
    } else {
        textContainer.innerHTML = `
            <div class="text-header">
                <i class="fas fa-file-text"></i>
                <span>Text Content</span>
            </div>
            <div class="text-body">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
    }

    return textContainer;
}

// Create image content component
function createImageContent(imageUrl, asset) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-content';
    
    imageContainer.innerHTML = `
        <div class="image-header">
            <i class="fas fa-image"></i>
            <span>Image Content</span>
        </div>
        <div class="image-body">
            <img src="${imageUrl}" alt="${escapeHtml(asset.asset_title)}" loading="lazy" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="image-error" style="display: none;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load image</p>
            </div>
        </div>
    `;

    return imageContainer;
}

// Create document content component
function createDocumentContent(docUrl, asset) {
    const docContainer = document.createElement('div');
    docContainer.className = 'document-content';
    
    docContainer.innerHTML = `
        <div class="document-header">
            <i class="fas fa-file-pdf"></i>
            <span>Document Content</span>
        </div>
        <div class="document-body">
            <a href="${docUrl}" target="_blank" class="document-link">
                <i class="fas fa-download"></i>
                Download Document
            </a>
        </div>
    `;

    return docContainer;
}

// Create generic content component
function createGenericContent(content, asset) {
    const genericContainer = document.createElement('div');
    genericContainer.className = 'generic-content';
    
    if (isUrl(content)) {
        genericContainer.innerHTML = `
            <div class="generic-header">
                <i class="fas fa-link"></i>
                <span>External Content</span>
            </div>
            <div class="generic-body">
                <a href="${content}" target="_blank" class="content-link">
                    <i class="fas fa-external-link-alt"></i>
                    Open Link
                </a>
            </div>
        `;
    } else {
        genericContainer.innerHTML = `
            <div class="generic-header">
                <i class="fas fa-file"></i>
                <span>Content</span>
            </div>
            <div class="generic-body">
                <p>${escapeHtml(content)}</p>
            </div>
        `;
    }

    return genericContainer;
}

// Utility Functions

// Extract YouTube video ID from URL
function extractYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Check if string is a URL
function isUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Video interaction functions
function addToWatchLater(videoId) {
    // Implement watch later functionality
    console.log('Added to watch later:', videoId);
    showNotification('Added to Watch Later');
}

function shareVideo(videoId) {
    // Implement share functionality
    const shareUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
        navigator.share({
            title: 'Check out this video',
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Link copied to clipboard');
        });
    }
}

function openYouTube(videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// UI State Management

function showLoadingState() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading project data...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // Loading state will be replaced by actual content
}

function showErrorState(message) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="error-container">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>Error Loading Content</h2>
                <p>${escapeHtml(message)}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Navigation functions for task switching
function navigateToTask(taskId) {
    const url = new URL(window.location);
    url.searchParams.set('taskId', taskId);
    window.location.href = url.toString();
}

function navigateToAllTasks() {
    const url = new URL(window.location);
    url.searchParams.delete('taskId');
    window.location.href = url.toString();
}

// Export functions for global access
window.addToWatchLater = addToWatchLater;
window.shareVideo = shareVideo;
window.openYouTube = openYouTube;
window.navigateToTask = navigateToTask;
window.navigateToAllTasks = navigateToAllTasks;
