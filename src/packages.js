var EventEmitter = require("events").EventEmitter;
var fs = require("fs");
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

// TODO: Should also read packages folder in user config folder
var folder = path.resolve(path.join(__dirname, "..", "packages"));

fs.readdir(folder, function(err, files) {
	if (err) {
		throw new Error(err);
	}

	files.forEach(function(name) {
		var packagePath = path.join(folder, name);

		if (!fs.statSync(packagePath).isDirectory()) {
			return;
		}

		var info = require(path.join(packagePath, "package.json"));

		packages.packages.push({
			exports: require(packagePath),
			info: info,
			path: name,
			webroot: "packages/" + name + "/",
		});

		log.info("Loaded package", colors.green(info.name + " v" + info.version));
	});
});

packages.emit("packagesLoaded");
