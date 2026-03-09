# AWS SAA-C03 Knowledge Base

This is a static website designed to be a comprehensive knowledge base for the AWS Certified Solutions Architect - Associate (SAA-C03) exam.

## Features

*   **Responsive Design:** Works on desktop and mobile devices.
*   **Search Functionality:** Quickly find topics by title or content.
*   **Categorized Content:** Organized by AWS domains (Compute, Storage, Database, etc.).
*   **Zero Build Step:** Built with vanilla HTML, CSS, and JavaScript. No npm install or build process required.
*   **Easy Customization:** Simply edit `data.js` to add or modify content.

## How to Run

Since this is a static site, you can open `index.html` directly in your browser. However, for the best experience (and to avoid CORS issues with some browsers), it's recommended to serve it via a local web server.

### Using Python (if installed)

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Using VS Code Live Server

If you use VS Code, install the "Live Server" extension and click "Go Live" at the bottom right.

## Project Structure

*   `index.html`: Main entry point and layout structure.
*   `styles.css`: Custom CSS styles and overrides.
*   `app.js`: Application logic for navigation, search, and content rendering.
*   `data.js`: The actual content of the knowledge base. Edit this file to add more topics.

## Adding Content

To add a new topic, open `data.js` and add a new object to the `knowledgeBaseData` array:

```javascript
{
    id: "unique-id",
    title: "Topic Title",
    category: "Category Name",
    content: `
        <h1>Topic Heading</h1>
        <p>Your content here...</p>
    `
}
```
