export var parseRefPath = function (path) {
     return /^[^\s\r\/]+(?:\/[^\s\r\/]+)*$/.test(path);
}