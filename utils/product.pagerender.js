const fs = require("fs");
const path = require("path");

const renderPage = (pageContent, title = "My Website", activePage) => {
  const head = fs
    .readFileSync(path.join(__dirname, "../views/head.html"), "utf-8")
    .replace("<title>My Website</title>", `<title>${title}</title>`);

  const header = fs
    .readFileSync(path.join(__dirname, "../views/header.html"), "utf-8")
    .replace(/<%= activePage === 'home' \? 'active' : '' %>/g, activePage === "home" ? "active" : "")
    .replace(/<%= activePage === 'about' \? 'active' : '' %>/g, activePage === "about" ? "active" : "")
    .replace(/<%= activePage === 'products' \? 'active' : '' %>/g, activePage === "products" ? "active" : "");

  const footer = fs.readFileSync(
    path.join(__dirname, "../views/footer2.html"),
    "utf-8"
  );

  return `<!DOCTYPE html>
    <html lang="en">
    ${head}
    <body>
      ${header}
      <main>
        ${pageContent}
      </main>
      ${footer}
    </body>
    </html>`;
};

module.exports = { renderPage };
