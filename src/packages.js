var EventEmitter = require("events").EventEmitter;
var Helper = require("./helper");
var path = require("path");
var colors = require("colors/safe");

function Packages() {
	EventEmitter.call(this);
	this.packages = [];
}

Packages.prototype = new EventEmitter();

Packages.prototype.forEachProp = function(prop, callback) {
	this.packages.forEach(function(package) {
		if (prop in package.exports) {
			callback(package.exports[prop], package);
		}
	});
};

var packages = module.exports = new Packages();

(function(config) {
	if ("packages" in config && config.packages instanceof Array) {
		config.packages.forEach(function(package) {
			var folder = path.join("..", "packages", package);
			var info = require(path.join(folder, "package.json"));

			packages.packages.push({
				exports: require(folder),
				info: info,
				path: package,
				webroot: "packages/" + package + "/",
			});

			log.info("Loaded package", colors.green(info.name + " v" + info.version));
		});
	}
})(Helper.getConfig());

packages.emit("packagesLoaded");
