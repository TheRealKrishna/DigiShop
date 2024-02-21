const fs = require('fs');

const errorHandler = (error) => {
    const divider = "----------------------------------------------------\n"
    const date = new Date();
    const log = divider + date + "\n" + error.stack + divider + "\n\n\n";
    console.log(divider + String(error) + "\n" + divider)
    let existingContent = '';
    try {
        existingContent = fs.readFileSync("error_logs.txt", "utf8");
    } catch (readError) {
        console.error("Error reading the file:", readError);
    }
    const updatedContent = log + existingContent;
    try {
        fs.writeFileSync("error_logs.txt", updatedContent);
    } catch (writeError) {
        console.error("Error writing to the file:", writeError);
    }
};

module.exports = errorHandler;