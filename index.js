//
// Copy these directories to project, after install:
//
const fse = require("fs-extra");
const path = require("path");
const parentModule = require("parent-module");
const glob = require("glob");
const minify = require("html-minifier-terser").minify;
console.log(
  "\x1b[36m",
  "\n----------------------------\n-- Shopify Bones Injector --\n----------------------------",
  "\x1b[0m"
);
const dirOut = process.env.INIT_CWD; // project root (not parent package)
glob("injections/**", {}, (err, files) => {
  files.forEach((filePath) => {
    const extension = path.extname(filePath);
    // Ignore directories and such
    if (!path.extname(filePath)) return;
    const outputPath = path.resolve(
      dirOut,
      filePath.slice("injections/".length)
    );
    // console.log(` Considering: `, filePath, outputPath);
    // If .liquid, let's do a cheeky minification effort
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
          console.log(` Minified ${filePath} -> ${outputPath}`);
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
          console.log(` Injected ${filePath} -> ${outputPath}`);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
});
