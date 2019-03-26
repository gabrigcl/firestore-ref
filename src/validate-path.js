export var validatePath = function (path) {
     return /^[^\s\r\/]+(?:\/[^\s\r\/]+)*$/.test(path);
};