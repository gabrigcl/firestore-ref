export var validatePath = function (path) {
     return /^[^\s\/]+(?:\/[^\s\/]+)*$/.test(path);
};