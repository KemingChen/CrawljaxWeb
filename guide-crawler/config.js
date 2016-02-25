(function () {
    var self = this;

    self.path = require('path');
    self.fs = require('fs');

    module.exports = {
        CONFIGURATIONS_PATH: combineRootPath('../out/configurations'),
        RECORDS_PATH: combineRootPath('../out/crawl-records'),
        IMAGE_PATH: combineRootPath('./public/images')
    };

    function combineRootPath(path) {
        var object = {};
        object.value = self.path.join(process.env.PWD, path);
        object.getFileSync = getFileSync(object.value);
        object.getDirSync = getDirSync(object.value);

        return object;

        function getFileSync(rootPath) {
            return function (filename) {
                var filePath = self.path.join(rootPath, filename);
                if (self.fs.existsSync(filePath)) {
                    return self.fs.readFileSync(filePath, 'utf8');
                }
                else {
                    return "{}";
                }
            }
        }

        function getDirSync(rootPath) {
            return function (path) {
                if (!path)
                    path = "";
                return self.fs.readdirSync(self.path.join(rootPath, path));
            }
        }
    }
})();
