# Jeevan Marshal - Portfolio Auto-Updater

Welcome to your new dynamically updated portfolio! This site is designed using pure modern HTML, Glassmorphic CSS, and JavaScript.

## 🚀 How It Works

It has a fully responsive UI built entirely without heavy frameworks, utilizing CSS variables, animations, and a sleek dark layout. Your projects are stored in `data/projects.json` which is automatically read by the frontend.

### Adding New Projects
When you finish a new project and upload it to GitHub, simply follow these steps to add it to your portfolio:

1. Open a terminal or command prompt in this directory (`f:/Programming/Project Portfolio`).
2. Run the Node.js script and pass your GitHub repository link:
   ```bash
   node add_project.js https://github.com/jeevanmarshal/Your-Project-Name
   ```
3. The script will automatically connect to the GitHub API, fetch the repository details (Title, Description, Tags/Languages, Repo Link, Dates), and append it to `data/projects.json` for you.
4. **Important**: By default, it will add an Unsplash placeholder image. To add a custom screenshot, manually edit `data/projects.json` and change the `"image"` field to your desired screenshot URL or local path.
5. Push the changes of this portfolio site to your GitHub portfolio repository so Vercel or GitHub Pages can update automatically!

**Note on Local Testing**:
If you open `index.html` directly by double-clicking it on your computer, Google Chrome might block fetching `data/projects.json` due to CORS/file protocol limits.
To test locally, it's best to run a local development server like this:
```bash
npx serve .
```
Or use the **Live Server** extension in VS Code.

## 🎯 Technology Stack
- **HTML5**: Semantic tags for accessibility
- **CSS3**: Custom properties, Glassmorphism, animations entirely custom-written
- **JavaScript (Vanilla JS)**: Async JSON fetching and DOM manipulation
- **Node.js Scripting**: Custom automated script to fetch data using GitHub's REST API.
