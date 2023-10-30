const xunitViewer = require("xunit-viewer");

xunitViewer({
    server: false,
    results: "phpunit_reports/junit.xml",
    ignore: ["_thingy", "invalid"],
    title: "EZ League QC",
    brand: "ezactive_1024x1024.png",
    favicon: "ezactive_16x16.png",
    output: "public/qc.html",
    script: true,
});
