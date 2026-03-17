const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const REPO_REGEX = /github\.com\/([^\/]+)\/([^\/]+)\/?/;
const JSON_PATH = path.join(__dirname, 'data', 'projects.json');

// Read args
const args = process.argv.slice(2);
const repoUrl = args[0];

if (!repoUrl) {
    console.error('❌ Please provide a GitHub repository link as an argument.');
    console.error('Example: node add_project.js https://github.com/user/repo');
    process.exit(1);
}

const match = repoUrl.match(REPO_REGEX);
if (!match) {
    console.error('❌ Invalid GitHub URL format.');
    process.exit(1);
}

const username = match[1];
let repoName = match[2];
if (repoName.endsWith('.git')) repoName = repoName.slice(0, -4);

console.log(`🔍 Fetching repository details for ${username}/${repoName}...`);

const options = {
    hostname: 'api.github.com',
    path: `/repos/${username}/${repoName}`,
    method: 'GET',
    headers: {
        'User-Agent': 'NodeJS Script',
        'Accept': 'application/vnd.github.v3+json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const repoData = JSON.parse(data);

                // Add to projects.json
                addProjectToJSON(repoData);
            } catch (err) {
                console.error('❌ Error parsing response data:', err);
            }
        } else {
            console.error(`❌ GitHub API request failed with status: ${res.statusCode}`);
            try {
                const errData = JSON.parse(data);
                console.error(`Message: ${errData.message}`);
            } catch (e) { }
        }
    });
});

req.on('error', (err) => {
    console.error('❌ Request Error:', err.message);
});

req.end();

function addProjectToJSON(repoData) {
    let projects = [];

    // Read existing
    try {
        if (fs.existsSync(JSON_PATH)) {
            const rawData = fs.readFileSync(JSON_PATH, 'utf-8');
            projects = JSON.parse(rawData);
        }
    } catch (e) {
        console.error('⚠️ Could not read existing projects.json, creating a new array.', e.message);
    }

    // Check for duplicates
    if (projects.some(p => p.id === repoData.id.toString())) {
        console.warn('⚠️ This project already exists in projects.json based on id. Updating details might be a manual task.');
        process.exit(0);
    }

    // Determine tags from languages_url or description or topics
    // repoData.topics is available in modern API with preview/standard Accept
    const tags = repoData.topics && repoData.topics.length > 0 ? repoData.topics : [repoData.language || "Unknown"];

    // Basic heuristics for nice defaults
    const newProject = {
        id: repoData.id.toString(),
        title: repoData.name.replace(/-/g, ' ').replace(/_/g, ' '),
        description: repoData.description || 'A custom project added via GitHub.',
        image: "https://images.unsplash.com/photo-1555066931-bf19f8fd1085?q=80&w=600&auto=format&fit=crop", // placeholder image since github api doesn't provide screenshots directly
        tags: tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
        demoLink: repoData.homepage || "#",
        repoLink: repoData.html_url,
        date: repoData.created_at ? repoData.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
    };

    projects.push(newProject);

    // Save to disk
    try {
        fs.writeFileSync(JSON_PATH, JSON.stringify(projects, null, 4));
        console.log(`✅ Successfully added "${newProject.title}" to portfolio!`);
        console.log(`👉 Note: A placeholder image has been set. Update 'data/projects.json' if you want a custom preview image.`);
    } catch (e) {
        console.error('❌ Error saving to projects.json:', e);
    }
}
