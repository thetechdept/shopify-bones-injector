//
// Copy these directories to project, after install:
//
const fse = require("fs-extra");
const path = require("path");
const parentModule = require("parent-module");
const glob = require("glob");
const minify = require("html-minifier-terser").minify;
console.log("\x1b[36m", " -- Shopify Bones Injector -- ", "\x1b[0m");

var parent = require("parent-package-json");
console.log("__dirname", __dirname);
console.log(
  "path.dirname(require.main.filename)",
  path.dirname(require.main.filename)
);
console.log(" path.resolve(__dirname)", path.resolve(__dirname));
console.log(" process.env.PWD", process.env.PWD);
console.log(" path.resolve(./)", path.resolve("./"));
console.log("------------------\n\n");
console.log("path.resolve(.)", path.resolve("."));
console.log("process.env.INIT_CWD", process.env.INIT_CWD);
console.log("process.env.PWD", process.env.PWD);
console.log("process.cwd()", process.cwd());
console.log("parentModule", parentModule());
var pathToParent = parent().path;
console.log("pathToParent", pathToParent);

console.log("module.parent", module.parent);

const dirOut = process.env.INIT_CWD; // project root
glob("injections/**", {}, (err, files) => {
  files.forEach((filePath) => {
    const extension = path.extname(filePath);
    // Ignore directories and such
    if (!path.extname(filePath)) return;
    const outputPath = path.resolve(
      dirOut,
      filePath.slice("injections/".length)
    );
    path.resolve(dirOut, filePath);
    // If .liquid, let's do a cheeky minification effort
    console.log(` Considering: `, filePath, outputPath);
    if (extension == ".liquid") {
      const contents = fse.readFileSync(filePath, "utf8");
      var minified = minify(contents, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: false,
        // Keep formatting for liquid comments with exclamation:
        //  {%- comment -%}!
        ignoreCustomFragments: [
          /{%\- comment \-%\}![\s\S]*?{%\- endcomment \-%\}/,
          /<\?[\s\S]*?\?>/,
        ],
      });
      fse
        .outputFile(outputPath, minified, {
          overwrite: true,
        })
        .then(() => {
          console.log(` Minified ${outputPath} -> ${filePath}`);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // Otherwise, straight up copy
    else {
      fse
        .copy(filePath, outputPath, {
          overwrite: true,
        })
        .then(() => {
          console.log(` Injected ${outputPath} -> ${filePath}`);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
});
