// Guard to disable admin UI and API calls on GitHub Pages
if (window.location.hostname.endsWith('github.io')) {  
    throw new Error('Admin UI and API calls are disabled on GitHub Pages.');
}

// Existing code continues...
// Your existing code here without changes
