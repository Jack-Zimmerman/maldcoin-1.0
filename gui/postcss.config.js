const tailwindcss = require("tailwindcss");
module.exports = {
    mode: "jit",
    plugins: [
        tailwindcss("./tailwind.config.js"),
        require("autoprefixer")
    ]
};