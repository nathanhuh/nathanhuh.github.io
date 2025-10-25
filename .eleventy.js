module.exports = function (eleventyConfig) {
    // Passthrough copy for assets
    eleventyConfig.addPassthroughCopy("src/photo");
    eleventyConfig.addPassthroughCopy("src/pdf");
    // If you have other static assets like favicons, add them here too
    // eleventyConfig.addPassthroughCopy("src/favicon.ico");

    // Blog collection
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/blog/*.md");
    });

    // Date filters
    eleventyConfig.addFilter("date", function(date, format) {
        const d = new Date(date);
        const months = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];

        if (format === "YYYY-MM-DD") {
            return d.toISOString().split('T')[0];
        } else if (format === "MMMM DD, YYYY") {
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        }
        return d.toLocaleDateString();
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes"
        },

        templateFormats: ["html", "njk", "md"], // Add others like liquid, 11ty.js if you use them
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    };
};