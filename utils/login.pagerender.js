const fs = require("fs");
const path = require("path");

const renderPage = (pageContent, title = "My Website", activePage) => {
  const head = fs
    .readFileSync(path.join(__dirname, "../views/head.html"), "utf-8")
    .replace("<title>My Website</title>", `<title>${title}</title>`);

  const header = fs
    .readFileSync(path.join(__dirname, "../views/header_login.html"), "utf-8");
  const footer = fs.readFileSync(
    path.join(__dirname, "../views/footer.html"),
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
