module.exports = {};

module.exports.factory = function (require) {
  var plugin =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony import */ var _commands_deduplicate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

  const plugin = {
    commands: [_commands_deduplicate__WEBPACK_IMPORTED_MODULE_0__["default"]]
  }; // eslint-disable-next-line arca/no-default-export

  /* harmony default export */ __webpack_exports__["default"] = (plugin);

  /***/ }),
  /* 1 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DeduplicateCommand; });
  /* harmony import */ var _yarnpkg_cli__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
  /* harmony import */ var _yarnpkg_cli__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_cli__WEBPACK_IMPORTED_MODULE_0__);
  /* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
  /* harmony import */ var _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__);
  /* harmony import */ var clipanion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
  /* harmony import */ var clipanion__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(clipanion__WEBPACK_IMPORTED_MODULE_2__);
  /* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
  /* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(semver__WEBPACK_IMPORTED_MODULE_3__);
  var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };





   // eslint-disable-next-line arca/no-default-export

  class DeduplicateCommand extends _yarnpkg_cli__WEBPACK_IMPORTED_MODULE_0__["BaseCommand"] {
    async execute() {
      const configuration = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["Configuration"].find(this.context.cwd, this.context.plugins);
      const {
        project
      } = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["Project"].find(configuration, this.context.cwd);
      const deduplicateReport = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["StreamReport"].start({
        configuration,
        stdout: this.context.stdout,
        includeFooter: false
      }, async report => {
        report.startTimerSync("deduplication step", () => {
          deduplicate(project, report);
        });
      });
      if (deduplicateReport.hasErrors()) return deduplicateReport.exitCode();
      const cache = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["Cache"].find(configuration);
      const installReport = await _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["StreamReport"].start({
        configuration,
        stdout: this.context.stdout,
        includeLogs: true
      }, async report => {
        await project.install({
          cache,
          report
        });
      });
      return installReport.exitCode();
    }

  }
  DeduplicateCommand.usage = clipanion__WEBPACK_IMPORTED_MODULE_2__["Command"].Usage({
    category: `Workspace-related commands`,
    description: `Reduces dependencies with overlapping ranges to a smaller set of packages`,
    details: `https://github.com/atlassian/yarn-deduplicate for yarn v2`,
    examples: []
  });

  __decorate([clipanion__WEBPACK_IMPORTED_MODULE_2__["Command"].Path(`deduplicate`)], DeduplicateCommand.prototype, "execute", null);

  function deduplicate(project, report) {
    const locatorsByIdent = new Map();

    for (const [descriptorHash, locatorHash] of project.storedResolutions.entries()) {
      const value = locatorHash;
      const descriptor = project.storedDescriptors.get(descriptorHash);
      const key = descriptor.identHash;
      const locators = locatorsByIdent.get(key);

      if (locators === undefined) {
        locatorsByIdent.set(key, new Set([value]));
      } else {
        locatorsByIdent.set(key, locators.add(value));
      }
    }

    for (const descriptorHash of project.storedResolutions.keys()) {
      const descriptor = project.storedDescriptors.get(descriptorHash);
      const locatorHashes = locatorsByIdent.get(descriptor.identHash);
      const semverMatch = descriptor.range.match(/^npm:(.*)$/);
      if (semverMatch === null) continue;

      if (locatorHashes !== undefined && locatorHashes.size > 1) {
        const candidates = Array.from(locatorHashes).map(locatorHash => {
          const pkg = project.storedPackages.get(locatorHash);

          if (_yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["structUtils"].isVirtualLocator(pkg)) {
            const sourceLocator = _yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["structUtils"].devirtualizeLocator(pkg);
            return project.storedPackages.get(sourceLocator.locatorHash);
          }

          return pkg;
        }).filter(sourcePackage => {
          if (sourcePackage.version === null) return false;
          return semver__WEBPACK_IMPORTED_MODULE_3__["satisfies"](sourcePackage.version, semverMatch[1]);
        }).sort((a, b) => {
          return semver__WEBPACK_IMPORTED_MODULE_3__["gt"](a.version, b.version) ? -1 : 1;
        });

        if (candidates.length > 1) {
          const newLocatorHash = candidates[0].locatorHash;
          const oldLocatorHash = project.storedResolutions.get(descriptorHash);
          const newPkg = project.storedPackages.get(newLocatorHash);
          const oldPkg = project.storedPackages.get(oldLocatorHash);

          if (_yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["structUtils"].areLocatorsEqual(oldPkg, newPkg) === false) {
            report.reportInfo(_yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["MessageName"].UNNAMED, `${_yarnpkg_core__WEBPACK_IMPORTED_MODULE_1__["structUtils"].stringifyDescriptor(descriptor)} can be deduplicated from ${oldPkg.name}@${oldPkg.version} to ${newPkg.name}@${newPkg.version}`);
            project.storedResolutions.set(descriptorHash, newLocatorHash);
          }
        }
      }
    }
  }

  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  module.exports = require("@yarnpkg/cli");

  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {

  module.exports = require("@yarnpkg/core");

  /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

  module.exports = require("clipanion");

  /***/ }),
  /* 5 */
  /***/ (function(module, exports) {

  module.exports = require("semver");

  /***/ })
  /******/ ]);
  return plugin;
};

module.exports.name = "@yarnpkg/plugin-deduplicate";
