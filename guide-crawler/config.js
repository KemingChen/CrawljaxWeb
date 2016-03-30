(function () {
    var self = this;

    self.path = require('path');
    self.fs = require('fs');

    module.exports = {
        configuration: combineRootPath('../out/configurations'),
        records: combineRootPath('../out/crawl-records'),
        public: combineRootPath('./public'),
        markInputsCSS: getMarkInputsCSS()
    };

    function getMarkInputsCSS() {
        var dir = combineRootPath('./');
        return dir.getFile('mark-inputs.css');
    }

    function combineRootPath(path) {
        var object = {};
        object.value = self.path.join(process.env.PWD, path);
        object.getFile = getFileSync;
        object.getDir = getDirSync;
        object.writeFile = writeFileSync;

        return object;

        function writeFileSync(filename, content) {
            var filePath = self.path.join(object.value, filename);
            return self.fs.writeFileSync(filePath, content, 'utf8');
        }

        function getFileSync(filename) {
            var filePath = self.path.join(object.value, filename);
            if (self.fs.existsSync(filePath)) {
                return self.fs.readFileSync(filePath, 'utf8');
            }
            else {
                return "{}";
            }
        }

        function getDirSync(path) {
            if (!path)
                path = "";
            return self.fs.readdirSync(self.path.join(object.value, path));
        }
    }
})();
