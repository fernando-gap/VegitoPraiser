const fs = require("fs");
const path = require("path");

module.exports = (dirname, callback) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(__dirname, dirname);
    }

    fs.readdir(dirname, { recursive: true }, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            callback(`${dirname}/${file}`, dirname);
        }
    });
};