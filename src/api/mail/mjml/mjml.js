const fs = require("fs");
const path = require("path");
const mjml = require('mjml')

const mjmlFolder = path.join(__dirname, "/templates");

/**
 * This will convert all mjml files into hbs file
 * Inorder to convert mjml to hbs please run either $ npm run build:mjml or node mjml.js
 */
fs.readdir(mjmlFolder, (err, files) => {
  if (err) {
    return console.error(err);
  }
  let hbs;
  let fileContent;

  files.forEach(file => {
    console.warn("Template: " + file);
    fileContent = fs.readFileSync(path.join(__dirname, "/templates", file));
    fileContent = mjml(fileContent.toString());
    hbs = path.join(__dirname, "../templates/" + file.replace(".mjml", ".hbs"));
    fs.writeFileSync(hbs, fileContent.html);
  });
});
