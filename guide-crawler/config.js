(function () {
    var self = this;

    self.path = require('path');
    self.fs = require('fs');

    module.exports = {
        configuration: combineRootPath('../out/configurations'),
        records: combineRootPath('../out/crawl-records'),
        public: combineRootPath('./public')
    };

    function combineRootPath(path) {
        var object = {};
        object.value = self.path.join(process.env.PWD, path);
        object.getFileSync = getFileSync(object.value);
        object.getDirSync = getDirSync(object.value);
        object.writeFileSync = writeFileSync(object.value);

        return object;

        function writeFileSync(rootPath) {
            return function (filename, content) {
                console.log('save', filename);
                var filePath = self.path.join(rootPath, filename);
                return self.fs.writeFileSync(filePath, content, 'utf8');
            }
        }

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
