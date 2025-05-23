module.exports = function (eleventyConfig) {
    // Passthrough copy for assets
    eleventyConfig.addPassthroughCopy("src/photo");
    eleventyConfig.addPassthroughCopy("src/pdf");
    // If you have other static assets like favicons, add them here too
    // eleventyConfig.addPassthroughCopy("src/favicon.ico");

    return {
        dir: {
            input: "src",
            output: "_site"
            // Optional: Set layouts, includes, data directories if needed later
            // layouts: "_layouts",
            // includes: "_includes",
            // data: "_data"
        },

        templateFormats: ["html", "njk", "md"], // Add others like liquid, 11ty.js if you use them
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    };
};