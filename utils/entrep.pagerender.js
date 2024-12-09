const fs = require("fs");
const path = require("path");

const renderPage = (pageContent, title = "My Website", activePage) => {
  const head = fs
    .readFileSync(path.join(__dirname, "../views/head_entrep.html"), "utf-8")
    .replace("<title>My Website</title>", `<title>${title}</title>`);

  const header = fs
    .readFileSync(path.join(__dirname, "../views/header_entrep.html"), "utf-8")
    .replace(/<%= activePage === 'sales' \? 'active' : '' %>/g, activePage === "sales" ? "active" : "")
    .replace(/<%= activePage === 'products' \? 'active' : '' %>/g, activePage === "products" ? "active" : "")
    .replace(/<%= activePage === 'orders' \? 'active' : '' %>/g, activePage === "orders" ? "active" : "");

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
