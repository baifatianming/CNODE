/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "41d6efafa70d9e2cae37"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(43)(__webpack_require__.s = 43);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Vue // late bind
var version
var map = window.__VUE_HOT_MAP__ = Object.create(null)
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) return
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
      'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Vue.extend(options),
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot (id, options) {
  injectHook(options, initHookName, function () {
    map[id].instances.push(this)
  })
  injectHook(options, 'beforeDestroy', function () {
    var instances = map[id].instances
    instances.splice(instances.indexOf(this), 1)
  })
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook (options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook]
}

function tryWrap (fn) {
  return function (id, arg) {
    try { fn(id, arg) } catch (e) {
      console.error(e)
      console.warn('Something went wrong during Vue component hot-reload. Full reload required.')
    }
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  record.Ctor.options.render = options.render
  record.Ctor.options.staticRenderFns = options.staticRenderFns
  record.instances.slice().forEach(function (instance) {
    instance.$options.render = options.render
    instance.$options.staticRenderFns = options.staticRenderFns
    instance._staticTrees = [] // reset static trees
    instance.$forceUpdate()
  })
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (version[1] < 2) {
      // preserve pre 2.2 behavior for global mixin handling
      record.Ctor.extendOptions = options
    }
    var newCtor = record.Ctor.super.extend(options)
    record.Ctor.options = newCtor.options
    record.Ctor.cid = newCtor.cid
    record.Ctor.prototype = newCtor.prototype
    if (newCtor.release) {
      // temporary global mixin strategy used in < 2.0.0-alpha.6
      newCtor.release()
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn('Root or manually mounted instance modified. Full reload required.')
    }
  })
})


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.3.3
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}
/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    } )); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1);
    return
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      for (var i = 0; i < fns.length; i++) {
        fns[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // remove reference to DOM nodes (prevents leak)
    vm.$options._parentElm = vm.$options._refElm = null;
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render
  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    {
      observerState.isSettingProps = true;
    }
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    {
      observerState.isSettingProps = false;
    }
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdateHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdateHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  if (this.user) {
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    }
  } else {
    value = this.getter.call(vm, vm);
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch) { initWatch(vm, opts.watch); }
}

var isReservedProp = {
  key: 1,
  ref: 1,
  slot: 1
};

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      if (isReservedProp[key] || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !observerState.isSettingProps) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(keys[i])) {
      proxy(vm, "_data", keys[i]);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    {
      if (getter === undefined) {
        warn(
          ("No getter function has been defined for computed property \"" + key + "\"."),
          vm
        );
        getter = noop;
      }
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    // isArray here
    var isArray = Array.isArray(inject);
    var result = Object.create(null);
    var keys = isArray
      ? inject
      : hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = isArray ? key : inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (isUndef(Ctor.cid)) {
    Ctor = resolveAsyncComponent(Ctor, baseCtor, context);
    if (Ctor === undefined) {
      // return nothing if this is indeed an async component
      // wait for the callback to trigger parent update.
      return
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      extend(props, bindObject);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "development" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      for (var key in value) {
        if (key === 'class' || key === 'style') {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];
        }
      }
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return this
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode.ssrContext
  }
});

Vue$3.version = '2.3.3';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (isUndef(value)) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  var res = '';
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(value[i])) {
        if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (ref.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.elm = oldVnode.elm;
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }
    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ("development" !== 'production' &&
              typeof console !== 'undefined' &&
              !bailed
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
      "if (!Array.isArray($$exp)){" +
        value + "=" + assignment + "}" +
      "else{$$exp.splice($$idx, 1, " + assignment + ")}"
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if ((isDef(modifiers) && modifiers.number) || elm.type === 'number') {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || el.type === 'text' || el.type === 'password') {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\">";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

var decoder;

function decode (html) {
  decoder = decoder || document.createElement('div');
  decoder.innerHTML = html;
  return decoder.textContent
}

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest$1 = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest$1 = html.slice(textEnd);
        while (
          !endTag.test(rest$1) &&
          !startTagOpen.test(rest$1) &&
          !comment.test(rest$1) &&
          !conditionalComment.test(rest$1)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest$1.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest$1 = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      walkThroughConditionsBlocks(node.ifConditions, isInFor);
    }
  }
}

function walkThroughConditionsBlocks (conditionBlocks, isInFor) {
  for (var i = 1, len = conditionBlocks.length; i < len; i++) {
    markStaticRoots(conditionBlocks[i].block, isInFor);
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if ("development" !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  bind: bind$1,
  cloak: noop
};

/*  */

// configurable state
var warn$3;
var transforms$1;
var dataGenFns;
var platformDirectives$1;
var isPlatformReservedTag$1;
var staticRenderFns;
var onceCount;
var currentOptions;

function generate (
  ast,
  options
) {
  // save previous staticRenderFns so generate calls can be nested
  var prevStaticRenderFns = staticRenderFns;
  var currentStaticRenderFns = staticRenderFns = [];
  var prevOnceCount = onceCount;
  onceCount = 0;
  currentOptions = options;
  warn$3 = options.warn || baseWarn;
  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
  dataGenFns = pluckModuleFunction(options.modules, 'genData');
  platformDirectives$1 = options.directives || {};
  isPlatformReservedTag$1 = options.isReservedTag || no;
  var code = ast ? genElement(ast) : '_c("div")';
  staticRenderFns = prevStaticRenderFns;
  onceCount = prevOnceCount;
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: currentStaticRenderFns
  }
}

function genElement (el) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el)
  } else if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el);
    } else {
      var data = el.plain ? undefined : genData(el);

      var children = el.inlineTemplate ? null : genChildren(el, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < transforms$1.length; i++) {
      code = transforms$1[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el) {
  el.staticProcessed = true;
  staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
  return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && warn$3(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el)
    }
    return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el)
  }
}

function genIf (el) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice())
}

function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return el.once ? genOnce(el) : genElement(el)
  }
}

function genFor (el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (
    "development" !== 'production' &&
    maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key
  ) {
    warn$3(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genElement(el)) +
    '})'
}

function genData (el) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < dataGenFns.length; i++) {
    data += dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, warn$3)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, warn$3)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  return data
}

function genDirectives (el) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, warn$3);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    warn$3('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, currentOptions);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (slots) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) { return genScopedSlot(key, slots[key]); }).join(',')) + "])")
}

function genScopedSlot (key, el) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el)
  }
  return "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el) || 'void 0'
      : genElement(el)) + "}}"
}

function genForScopedSlot (key, el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el)) +
    '})'
}

function genChildren (el, checkSkip) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return genElement(el$1)
    }
    var normalizationType = checkSkip ? getNormalizationType(children) : 0;
    return ("[" + (children.map(genNode).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (children) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function maybeComponent (el) {
  return !isPlatformReservedTag$1(el.tag)
}

function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genSlot (el) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (componentName, el) {
  var children = el.inlineTemplate ? null : genChildren(el, true);
  return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

function makeFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompiler (baseOptions) {
  var functionCompileCache = Object.create(null);

  function compile (
    template,
    options
  ) {
    var finalOptions = Object.create(baseOptions);
    var errors = [];
    var tips = [];
    finalOptions.warn = function (msg, tip$$1) {
      (tip$$1 ? tips : errors).push(msg);
    };

    if (options) {
      // merge custom modules
      if (options.modules) {
        finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
      }
      // merge custom directives
      if (options.directives) {
        finalOptions.directives = extend(
          Object.create(baseOptions.directives),
          options.directives
        );
      }
      // copy other options
      for (var key in options) {
        if (key !== 'modules' && key !== 'directives') {
          finalOptions[key] = options[key];
        }
      }
    }

    var compiled = baseCompile(template, finalOptions);
    {
      errors.push.apply(errors, detectErrors(compiled.ast));
    }
    compiled.errors = errors;
    compiled.tips = tips;
    return compiled
  }

  function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (functionCompileCache[key]) {
      return functionCompileCache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = makeFunction(compiled.render, fnGenErrors);
    var l = compiled.staticRenderFns.length;
    res.staticRenderFns = new Array(l);
    for (var i = 0; i < l; i++) {
      res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
    }

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (functionCompileCache[key] = res)
  }

  return {
    compile: compile,
    compileToFunctions: compileToFunctions
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData$1
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$2 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$2
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(((this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".mu-paper-1 {\r\n    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);\r\n    height: 50px;\r\n    font-family: bold;\r\n    position: fixed;\r\n    left: 0px;\r\n    top: 0px;\r\n}\r\n.menuItem1 {\r\n    background: url(" + __webpack_require__(30) + ") no-repeat left center;\r\n    background-size: 20px 20px;\r\n    margin-left:10px;\r\n}\r\n.menuItem2{\r\n    background: url(" + __webpack_require__(25) + ") no-repeat left center;\r\n    background-size: 20px 20px;\r\n    margin-left: 10px;\r\n}\r\n.mu-menu-list {\r\n    padding: 8px 0;\r\n    -webkit-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    overflow-y: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n.mu-menu-item-title {\r\n    margin-left: 10px;\r\n}\r\n.mu-menu-item {\r\n    padding: 0 16px;\r\n    position: relative;\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: justify;\r\n    -webkit-justify-content: space-between;\r\n    -ms-flex-pack: justify;\r\n    justify-content: space-between;\r\n    -webkit-box-align: center;\r\n    -webkit-align-items: center;\r\n    -ms-flex-align: center;\r\n    align-items: center;\r\n}\r\n.totop {\r\n    position: fixed;\r\n    right: 10px;\r\n    bottom: 50px;\r\n    width: 50px;\r\n    height: 50px;\r\n    border-radius: 100%;\r\n    border: 4px solid #515151;\r\n}\r\n.totop img {\r\n    width: 32px;\r\n    height: 32px;\r\n    margin-top: 4px;\r\n    margin-left: 5px;\r\n}", "", {"version":3,"sources":["D:/vue/laoM/vueDemo/src/components/css/common.css"],"names":[],"mappings":"AAAA;IACI,yEAAyE;IACzE,aAAa;IACb,kBAAkB;IAClB,gBAAgB;IAChB,UAAU;IACV,SAAS;CACZ;AACD;IACI,gEAA8D;IAC9D,2BAA2B;IAC3B,iBAAiB;CACpB;AACD;IACI,gEAAiE;IACjE,2BAA2B;IAC3B,kBAAkB;CACrB;AACD;IACI,eAAe;IACf,0BAA0B;IAC1B,uBAAuB;IACvB,sBAAsB;IACtB,kBAAkB;IAClB,iBAAiB;IACjB,kCAAkC;CACrC;AACD;IACI,kBAAkB;CACrB;AACD;IACI,gBAAgB;IAChB,mBAAmB;IACnB,qBAAqB;IACrB,sBAAsB;IACtB,qBAAqB;IACrB,cAAc;IACd,0BAA0B;IAC1B,uCAAuC;IACvC,uBAAuB;IACvB,+BAA+B;IAC/B,0BAA0B;IAC1B,4BAA4B;IAC5B,uBAAuB;IACvB,oBAAoB;CACvB;AACD;IACI,gBAAgB;IAChB,YAAY;IACZ,aAAa;IACb,YAAY;IACZ,aAAa;IACb,oBAAoB;IACpB,0BAA0B;CAC7B;AACD;IACI,YAAY;IACZ,aAAa;IACb,gBAAgB;IAChB,iBAAiB;CACpB","file":"common.css","sourcesContent":[".mu-paper-1 {\r\n    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);\r\n    height: 50px;\r\n    font-family: bold;\r\n    position: fixed;\r\n    left: 0px;\r\n    top: 0px;\r\n}\r\n.menuItem1 {\r\n    background: url('../../images/ren.png') no-repeat left center;\r\n    background-size: 20px 20px;\r\n    margin-left:10px;\r\n}\r\n.menuItem2{\r\n    background: url('../../images/denglu.png') no-repeat left center;\r\n    background-size: 20px 20px;\r\n    margin-left: 10px;\r\n}\r\n.mu-menu-list {\r\n    padding: 8px 0;\r\n    -webkit-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    overflow-y: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n}\r\n.mu-menu-item-title {\r\n    margin-left: 10px;\r\n}\r\n.mu-menu-item {\r\n    padding: 0 16px;\r\n    position: relative;\r\n    display: -webkit-box;\r\n    display: -webkit-flex;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: justify;\r\n    -webkit-justify-content: space-between;\r\n    -ms-flex-pack: justify;\r\n    justify-content: space-between;\r\n    -webkit-box-align: center;\r\n    -webkit-align-items: center;\r\n    -ms-flex-align: center;\r\n    align-items: center;\r\n}\r\n.totop {\r\n    position: fixed;\r\n    right: 10px;\r\n    bottom: 50px;\r\n    width: 50px;\r\n    height: 50px;\r\n    border-radius: 100%;\r\n    border: 4px solid #515151;\r\n}\r\n.totop img {\r\n    width: 32px;\r\n    height: 32px;\r\n    margin-top: 4px;\r\n    margin-left: 5px;\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "\r\nbutton, input, select, textarea {\r\n    font: inherit;\r\n    margin: 0;\r\n}\r\nh2.topic-title {\r\n    font-size: 16px;\r\n    line-height: 1.7;\r\n    color: #333;\r\n    margin-top: 50px;\r\n    padding: 10px;\r\n}\r\n.section {\r\n    padding: 10px !important;\r\n    background-color:#f0f0f0;\r\n}\r\n.status{\r\n    position: relative;\r\n}\r\n.status > img.avatar {\r\n    width: 50px;\r\n    height: 50px;\r\n    position: absolute;\r\n    top: 50%;\r\n    margin: -25px 0;\r\n    border-radius: 30px;\r\n    border: 1px solid #ccc;\r\n}\r\n.status > div.detail{\r\n    margin-left: 50px;\r\n    padding-left: 5px;\r\n}\r\n.status > div.detail > div {\r\n    height: 30px;\r\n    line-height: 30px;\r\n}\r\n.status > div.detail > div > span:first-child {\r\n    width: 100px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    color: #333;\r\n    float: right;\r\n    text-align: right;\r\n    font-size: 12px;\r\n}\r\n.status > div.detail > div > span:nth-child(2) {\r\n    height: 30px;\r\n    line-height: 30px;\r\n    margin-right: 100px;\r\n    display: block;\r\n    font-size: 12px;\r\n    color: #06a;\r\n    font-family: arial,verdana,microsoft yahei;\r\n}\r\n.markdown-body {\r\n    padding: 10px;\r\n    color: #333;\r\n    font-weight: 300;\r\n    font-size: 16px;\r\n    line-height: 1.6;\r\n    word-wrap: break-word;\r\n    box-sizing: border-box;\r\n    /* background: red; */\r\n    max-width: 100%;\r\n}\r\n.markdown-body *, .markdown-text * {\r\n    box-sizing: border-box;\r\n    font-family: arial, verdana, microsoft yahei;\r\n}\r\n.markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul, .markdown-text blockquote, .markdown-text dl, .markdown-text ol, .markdown-text p, .markdown-text pre, .markdown-text table, .markdown-text ul {\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    font-size: 14px;\r\n}\r\nul {\r\n    padding-left: 20px;\r\n}\r\n.markdown-text p img{\r\n\tdisplay: block;\r\n    margin: 10px auto;\r\n    border: none;\r\n    border-radius: 10px;\r\n    max-width: 100%;\r\n    box-sizing: content-box;\r\n    background-color: #fff;\r\n}\r\n.markdown-body ol li:before, .markdown-body ul li:before, .markdown-text ol li:before, .markdown-text ul li:before {\r\n    content: \"\\25CB\";\r\n    font-weight: 700;\r\n    color: #aaa;\r\n    float: left;\r\n    margin-left: -13px;\r\n}\r\n.markdown-body h1, .markdown-text h1 {\r\n    font-size: 20px;\r\n}\r\n.markdown-body h3, .markdown-text h3 {\r\n    font-size: 16px;\r\n}\r\n\r\n.markdown-body .mu-circular-progress{\r\n\tleft:120px;\r\n\tmargin-top:80px;\r\n\tmargin-bottom: 10px;\r\n\tdisplay:block;\r\n}\r\n.markdown-body a, .markdown-text a {\r\n    font-size: 14px;\r\n    color: #4078c0;\r\n    background-color: transparent;\r\n    text-decoration: none;\r\n    outline: 0;\r\n}\r\n.myReply {\r\n    position: fixed;\r\n    left: 0;\r\n    bottom: 0;\r\n    height: 40px;\r\n    width: 100%;\r\n    border: 1px solid #ddd;\r\n}\r\n.myReply input{\r\n    width: 80%;\r\n    height: 100%;\r\n    padding-left: 20px;\r\n    border: none;\r\n}\r\n.myReply button {\r\n    width: 18%;\r\n    height: 100%;\r\n    background: rgba(153, 102, 255, 0.9);\r\n    color: white;\r\n    border: none;\r\n    display:inline-block;\r\n}\r\n.reply-list {\r\n    width: 100%;\r\n    padding: 0 10px;\r\n    margin-bottom: 50px;\r\n}\r\nhr{\r\n    border-bottom: 1px solid #ddd;\r\n    margin: 10px;\r\n    height: 0;\r\n}\r\n.reply-list > .reply-box {\r\n    list-style: none;\r\n    background: #f5f5f5;\r\n    border-radius: 15px;\r\n    margin: 10px auto;\r\n    padding: 10px;\r\n    box-shadow: 0 0 6px #999;\r\n}\r\n.reply-list > .reply-box i{\r\n    width: 60px;\r\n    height: 60px;\r\n    line-height: 60px;\r\n    float: right;\r\n    text-align: center;\r\n    font-size: 22px;\r\n}\r\n.reply-list > .reply-box .icon-like{\r\n    font-size: 16px;\r\n}\r\n.icon-repost span {\r\n    display: inline-block;\r\n    width: 20px;\r\n    height: 20px;\r\n    background: url(" + __webpack_require__(27) + ") no-repeat;\r\n    background-size: 20px 20px;\r\n}\r\n.icon-like span {\r\n    display: inline-block;\r\n    width: 20px;\r\n    height: 20px;\r\n    background: url(" + __webpack_require__(26) + ") no-repeat;\r\n    background-size: 20px 20px;\r\n}\r\n.markdown-body pre, .markdown-text pre {\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    font: 12px Consolas, Liberation Mono, Menlo, Courier, monospace;\r\n    padding: 10px;\r\n    overflow: auto;\r\n    font-size: 85%;\r\n    line-height: 1.45;\r\n    background-color: #333!important;\r\n    border-radius: 10px;\r\n    color: #999;\r\n    border: 1px solid #666;\r\n    word-wrap: normal;\r\n}\r\n.markdown-body pre code, .markdown-text pre code {\r\n    font-size: 12px;\r\n    word-break: normal;\r\n    white-space: pre;\r\n    background: transparent;\r\n    display: inline;\r\n    max-width: none;\r\n    padding: 0;\r\n    margin: 0;\r\n    overflow: initial;\r\n    line-height: inherit;\r\n    word-wrap: normal;\r\n    background-color: transparent;\r\n    border: 0;\r\n    color: #f8f8f2;\r\n}\r\n.markdown-body code, .markdown-text code {\r\n    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;\r\n    border-radius: 3px;\r\n}\r\n.markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul, .markdown-text blockquote, .markdown-text dl, .markdown-text ol, .markdown-text p, .markdown-text pre, .markdown-text table, .markdown-text ul {\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    font-size: 14px;\r\n}", "", {"version":3,"sources":["D:/vue/laoM/vueDemo/src/components/css/detailComponent.css"],"names":[],"mappings":"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","file":"detailComponent.css","sourcesContent":["\r\nbutton, input, select, textarea {\r\n    font: inherit;\r\n    margin: 0;\r\n}\r\nh2.topic-title {\r\n    font-size: 16px;\r\n    line-height: 1.7;\r\n    color: #333;\r\n    margin-top: 50px;\r\n    padding: 10px;\r\n}\r\n.section {\r\n    padding: 10px !important;\r\n    background-color:#f0f0f0;\r\n}\r\n.status{\r\n    position: relative;\r\n}\r\n.status > img.avatar {\r\n    width: 50px;\r\n    height: 50px;\r\n    position: absolute;\r\n    top: 50%;\r\n    margin: -25px 0;\r\n    border-radius: 30px;\r\n    border: 1px solid #ccc;\r\n}\r\n.status > div.detail{\r\n    margin-left: 50px;\r\n    padding-left: 5px;\r\n}\r\n.status > div.detail > div {\r\n    height: 30px;\r\n    line-height: 30px;\r\n}\r\n.status > div.detail > div > span:first-child {\r\n    width: 100px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    color: #333;\r\n    float: right;\r\n    text-align: right;\r\n    font-size: 12px;\r\n}\r\n.status > div.detail > div > span:nth-child(2) {\r\n    height: 30px;\r\n    line-height: 30px;\r\n    margin-right: 100px;\r\n    display: block;\r\n    font-size: 12px;\r\n    color: #06a;\r\n    font-family: arial,verdana,microsoft yahei;\r\n}\r\n.markdown-body {\r\n    padding: 10px;\r\n    color: #333;\r\n    font-weight: 300;\r\n    font-size: 16px;\r\n    line-height: 1.6;\r\n    word-wrap: break-word;\r\n    box-sizing: border-box;\r\n    /* background: red; */\r\n    max-width: 100%;\r\n}\r\n.markdown-body *, .markdown-text * {\r\n    box-sizing: border-box;\r\n    font-family: arial, verdana, microsoft yahei;\r\n}\r\n.markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul, .markdown-text blockquote, .markdown-text dl, .markdown-text ol, .markdown-text p, .markdown-text pre, .markdown-text table, .markdown-text ul {\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    font-size: 14px;\r\n}\r\nul {\r\n    padding-left: 20px;\r\n}\r\n.markdown-text p img{\r\n\tdisplay: block;\r\n    margin: 10px auto;\r\n    border: none;\r\n    border-radius: 10px;\r\n    max-width: 100%;\r\n    box-sizing: content-box;\r\n    background-color: #fff;\r\n}\r\n.markdown-body ol li:before, .markdown-body ul li:before, .markdown-text ol li:before, .markdown-text ul li:before {\r\n    content: \"\\25CB\";\r\n    font-weight: 700;\r\n    color: #aaa;\r\n    float: left;\r\n    margin-left: -13px;\r\n}\r\n.markdown-body h1, .markdown-text h1 {\r\n    font-size: 20px;\r\n}\r\n.markdown-body h3, .markdown-text h3 {\r\n    font-size: 16px;\r\n}\r\n\r\n.markdown-body .mu-circular-progress{\r\n\tleft:120px;\r\n\tmargin-top:80px;\r\n\tmargin-bottom: 10px;\r\n\tdisplay:block;\r\n}\r\n.markdown-body a, .markdown-text a {\r\n    font-size: 14px;\r\n    color: #4078c0;\r\n    background-color: transparent;\r\n    text-decoration: none;\r\n    outline: 0;\r\n}\r\n.myReply {\r\n    position: fixed;\r\n    left: 0;\r\n    bottom: 0;\r\n    height: 40px;\r\n    width: 100%;\r\n    border: 1px solid #ddd;\r\n}\r\n.myReply input{\r\n    width: 80%;\r\n    height: 100%;\r\n    padding-left: 20px;\r\n    border: none;\r\n}\r\n.myReply button {\r\n    width: 18%;\r\n    height: 100%;\r\n    background: rgba(153, 102, 255, 0.9);\r\n    color: white;\r\n    border: none;\r\n    display:inline-block;\r\n}\r\n.reply-list {\r\n    width: 100%;\r\n    padding: 0 10px;\r\n    margin-bottom: 50px;\r\n}\r\nhr{\r\n    border-bottom: 1px solid #ddd;\r\n    margin: 10px;\r\n    height: 0;\r\n}\r\n.reply-list > .reply-box {\r\n    list-style: none;\r\n    background: #f5f5f5;\r\n    border-radius: 15px;\r\n    margin: 10px auto;\r\n    padding: 10px;\r\n    box-shadow: 0 0 6px #999;\r\n}\r\n.reply-list > .reply-box i{\r\n    width: 60px;\r\n    height: 60px;\r\n    line-height: 60px;\r\n    float: right;\r\n    text-align: center;\r\n    font-size: 22px;\r\n}\r\n.reply-list > .reply-box .icon-like{\r\n    font-size: 16px;\r\n}\r\n.icon-repost span {\r\n    display: inline-block;\r\n    width: 20px;\r\n    height: 20px;\r\n    background: url(\"../../images/huifu.png\") no-repeat;\r\n    background-size: 20px 20px;\r\n}\r\n.icon-like span {\r\n    display: inline-block;\r\n    width: 20px;\r\n    height: 20px;\r\n    background: url('../../images/dianzan.png') no-repeat;\r\n    background-size: 20px 20px;\r\n}\r\n.markdown-body pre, .markdown-text pre {\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    font: 12px Consolas, Liberation Mono, Menlo, Courier, monospace;\r\n    padding: 10px;\r\n    overflow: auto;\r\n    font-size: 85%;\r\n    line-height: 1.45;\r\n    background-color: #333!important;\r\n    border-radius: 10px;\r\n    color: #999;\r\n    border: 1px solid #666;\r\n    word-wrap: normal;\r\n}\r\n.markdown-body pre code, .markdown-text pre code {\r\n    font-size: 12px;\r\n    word-break: normal;\r\n    white-space: pre;\r\n    background: transparent;\r\n    display: inline;\r\n    max-width: none;\r\n    padding: 0;\r\n    margin: 0;\r\n    overflow: initial;\r\n    line-height: inherit;\r\n    word-wrap: normal;\r\n    background-color: transparent;\r\n    border: 0;\r\n    color: #f8f8f2;\r\n}\r\n.markdown-body code, .markdown-text code {\r\n    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;\r\n    border-radius: 3px;\r\n}\r\n.markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul, .markdown-text blockquote, .markdown-text dl, .markdown-text ol, .markdown-text p, .markdown-text pre, .markdown-text table, .markdown-text ul {\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    font-size: 14px;\r\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\nul li{\r\n\tlist-style: none;\r\n}\r\n.mu-list{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\n.list {\r\n    border: 0;\r\n    font-size: 100%;\r\n    vertical-align: baseline;\r\n    margin: 0;\r\n    padding: 0px 5px;\r\n    margin-top: 60px;\r\n}\r\n.logo {\r\n    background: url(" + __webpack_require__(29) + ") no-repeat;\r\n    background-size: 200px 200px;\r\n    width: 200px;\r\n    height: 200px;\r\n    display: inline-block;\r\n    margin-left: 27px;\r\n    margin-top: 15px;\r\n    margin-bottom: 15px;\r\n}\r\n.list li {\r\n    background-color: #fff;\r\n    padding: 5px 10px;\r\n    margin: 10px auto;\r\n    border-radius: 10px;\r\n    box-shadow: 0 0 5px #999;\r\n    list-style: none;\r\n}\r\n.list li .top{\r\n\theight: 25px;\r\n    line-height: 25px;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: #333;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    margin: 0;\r\n}\r\n.list li .top span {\r\n    background: #96f;\r\n    color: #fff;\r\n    padding: 3px 5px;\r\n    margin-right: 5px;\r\n    border-radius: 10px;\r\n    font-weight: 400;\r\n    font-size: 12px;\r\n}\r\n.list .top .topics{\r\n\tbackground-color:red;\r\n}\r\n.list li .top .ask{\r\n\tbackground-color: rgb(102, 204, 255)\r\n}\r\n.list li .top .job{\r\n\tbackground-color: rgb(153, 153, 153);\r\n}\r\n.list li .top .good{\r\n   background-color: rgb(255, 119, 0);\r\n}\r\n.list li .status{\r\n    position: relative;\r\n    height:60px;\r\n}\r\n.list li .status .detail {\r\n    margin-left: 50px;\r\n    padding-left: 5px;\r\n}\r\n.list li .status .detail div {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    height: 30px;\r\n    line-height: 30px;\r\n}\r\n.list li .status img {\r\n    width: 50px;\r\n    height: 50px;\r\n    position: absolute;\r\n    top: 50%;\r\n    margin: -25px 0;\r\n    border-radius: 30px;\r\n    border:1px solid #ccc;\r\n}\r\n.list li .status .detail div span:first-child {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    width: 100px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    color: #333;\r\n    float: right;\r\n    text-align: right;\r\n    font-size: 12px;\r\n}\r\n.list li .status .detail div span:last-child {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    margin-right: 100px;\r\n    display: block;\r\n    font-size: 12px;\r\n    color: #06a;\r\n    font-family: arial,verdana,microsoft yahei;\r\n}\r\n\r\n.demo-infinite-container{\r\n  width: 256px;\r\n  height: 300px;\r\n  overflow: auto;\r\n  -webkit-overflow-scrolling: touch;\r\n  border: 1px solid #d9d9d9;\r\n}\r\n.updata{\r\n\ttext-align:center;\r\n\tfont-size:16px;\r\n}\r\n.alert-matte{\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n    background-color: #000;\r\n    opacity: .7;\r\n    z-index: 15000;\r\n    top: 0px;\r\n}\r\n.alert{\r\n    width: 280px;\r\n    left: 50%;\r\n    margin-left: -140px;\r\n    margin-top: 50px;\r\n    position: fixed;\r\n    padding: 20px;\r\n    background: #fff;\r\n    border-radius: 5px;\r\n    box-sizing: border-box;\r\n    box-shadow: 0 5px 15px #555;\r\n    text-align: center;\r\n    color: #f70;\r\n    z-index: 20000;\r\n}\r\n.login-dialog input {\r\n    margin-bottom: 10px;\r\n    width: 100%;\r\n    line-height: 30px;\r\n    padding: 5px;\r\n    display: block;\r\n}\r\n.login-dialog input[type=text]{\r\n    border: 2px solid rgba(153, 102, 255, 0.9);\r\n    border-radius: 5px;\r\n    color: rgba(153, 102, 255, 0.9);\r\n    -webkit-transition: all .2s ease;\r\n    transition: all .2s ease;\r\n}\r\n.count {\r\n    outline: none;\r\n}\r\n.subtitle {\r\n    width: 150px;\r\n    line-height: 1.8;\r\n    margin: 20px auto !important;\r\n    padding: 10px !important;\r\n    border-bottom: 2px solid #42b983;\r\n    text-align: center;\r\n    position: relative;\r\n}\r\n.subtitle strong{\r\n    color: #42b983;\r\n}\r\n.btn, .lbtn {\r\n    margin: 10px auto;\r\n    padding: 0;\r\n    display: block;\r\n    background-color: rgba(153, 102, 255, 0.9);\r\n    color: #fff;\r\n    font-size: 14px;\r\n}\r\n.lbtn{\r\n    width: 100%;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    border: none;\r\n    border-radius: 5px;\r\n}\r\n.isSuccess {\r\n    width: 100px;\r\n    height: 30px;\r\n    background: rgba(51, 51, 51, 0.8);\r\n    color: white;\r\n    position: fixed;\r\n    left: 140px;\r\n    top: 300px;\r\n    line-height: 30px;\r\n    border-radius: 20px;\r\n    text-align: center;\r\n}\r\n\r\n", "", {"version":3,"sources":["D:/vue/laoM/vueDemo/src/components/css/indexComponent.css"],"names":[],"mappings":"AAAA;CACC,UAAU;CACV,WAAW;CACX;AACD;CACC,iBAAiB;CACjB;AACD;CACC,UAAU;CACV,WAAW;CACX;AACD;IACI,UAAU;IACV,gBAAgB;IAChB,yBAAyB;IACzB,UAAU;IACV,iBAAiB;IACjB,iBAAiB;CACpB;AACD;IACI,oDAAiD;IACjD,6BAA6B;IAC7B,aAAa;IACb,cAAc;IACd,sBAAsB;IACtB,kBAAkB;IAClB,iBAAiB;IACjB,oBAAoB;CACvB;AACD;IACI,uBAAuB;IACvB,kBAAkB;IAClB,kBAAkB;IAClB,oBAAoB;IACpB,yBAAyB;IACzB,iBAAiB;CACpB;AACD;CACC,aAAa;IACV,kBAAkB;IAClB,gBAAgB;IAChB,iBAAiB;IACjB,YAAY;IACZ,iBAAiB;IACjB,wBAAwB;IACxB,oBAAoB;IACpB,UAAU;CACb;AACD;IACI,iBAAiB;IACjB,YAAY;IACZ,iBAAiB;IACjB,kBAAkB;IAClB,oBAAoB;IACpB,iBAAiB;IACjB,gBAAgB;CACnB;AACD;CACC,qBAAqB;CACrB;AACD;CACC,oCAAoC;CACpC;AACD;CACC,qCAAqC;CACrC;AACD;GACG,mCAAmC;CACrC;AACD;IACI,mBAAmB;IACnB,YAAY;CACf;AACD;IACI,kBAAkB;IAClB,kBAAkB;CACrB;AACD;IACI,iBAAiB;IACjB,wBAAwB;IACxB,oBAAoB;IACpB,aAAa;IACb,kBAAkB;CACrB;AACD;IACI,YAAY;IACZ,aAAa;IACb,mBAAmB;IACnB,SAAS;IACT,gBAAgB;IAChB,oBAAoB;IACpB,sBAAsB;CACzB;AACD;IACI,iBAAiB;IACjB,wBAAwB;IACxB,oBAAoB;IACpB,aAAa;IACb,aAAa;IACb,kBAAkB;IAClB,YAAY;IACZ,aAAa;IACb,kBAAkB;IAClB,gBAAgB;CACnB;AACD;IACI,iBAAiB;IACjB,wBAAwB;IACxB,oBAAoB;IACpB,aAAa;IACb,kBAAkB;IAClB,oBAAoB;IACpB,eAAe;IACf,gBAAgB;IAChB,YAAY;IACZ,2CAA2C;CAC9C;;AAED;EACE,aAAa;EACb,cAAc;EACd,eAAe;EACf,kCAAkC;EAClC,0BAA0B;CAC3B;AACD;CACC,kBAAkB;CAClB,eAAe;CACf;AACD;IACI,YAAY;IACZ,aAAa;IACb,gBAAgB;IAChB,uBAAuB;IACvB,YAAY;IACZ,eAAe;IACf,SAAS;CACZ;AACD;IACI,aAAa;IACb,UAAU;IACV,oBAAoB;IACpB,iBAAiB;IACjB,gBAAgB;IAChB,cAAc;IACd,iBAAiB;IACjB,mBAAmB;IACnB,uBAAuB;IACvB,4BAA4B;IAC5B,mBAAmB;IACnB,YAAY;IACZ,eAAe;CAClB;AACD;IACI,oBAAoB;IACpB,YAAY;IACZ,kBAAkB;IAClB,aAAa;IACb,eAAe;CAClB;AACD;IACI,2CAA2C;IAC3C,mBAAmB;IACnB,gCAAgC;IAChC,iCAAiC;IACjC,yBAAyB;CAC5B;AACD;IACI,cAAc;CACjB;AACD;IACI,aAAa;IACb,iBAAiB;IACjB,6BAA6B;IAC7B,yBAAyB;IACzB,iCAAiC;IACjC,mBAAmB;IACnB,mBAAmB;CACtB;AACD;IACI,eAAe;CAClB;AACD;IACI,kBAAkB;IAClB,WAAW;IACX,eAAe;IACf,2CAA2C;IAC3C,YAAY;IACZ,gBAAgB;CACnB;AACD;IACI,YAAY;IACZ,aAAa;IACb,kBAAkB;IAClB,aAAa;IACb,mBAAmB;CACtB;AACD;IACI,aAAa;IACb,aAAa;IACb,kCAAkC;IAClC,aAAa;IACb,gBAAgB;IAChB,YAAY;IACZ,WAAW;IACX,kBAAkB;IAClB,oBAAoB;IACpB,mBAAmB;CACtB","file":"indexComponent.css","sourcesContent":["*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\nul li{\r\n\tlist-style: none;\r\n}\r\n.mu-list{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\n.list {\r\n    border: 0;\r\n    font-size: 100%;\r\n    vertical-align: baseline;\r\n    margin: 0;\r\n    padding: 0px 5px;\r\n    margin-top: 60px;\r\n}\r\n.logo {\r\n    background: url(../../images/logo.jpg) no-repeat;\r\n    background-size: 200px 200px;\r\n    width: 200px;\r\n    height: 200px;\r\n    display: inline-block;\r\n    margin-left: 27px;\r\n    margin-top: 15px;\r\n    margin-bottom: 15px;\r\n}\r\n.list li {\r\n    background-color: #fff;\r\n    padding: 5px 10px;\r\n    margin: 10px auto;\r\n    border-radius: 10px;\r\n    box-shadow: 0 0 5px #999;\r\n    list-style: none;\r\n}\r\n.list li .top{\r\n\theight: 25px;\r\n    line-height: 25px;\r\n    font-size: 12px;\r\n    font-weight: 600;\r\n    color: #333;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    margin: 0;\r\n}\r\n.list li .top span {\r\n    background: #96f;\r\n    color: #fff;\r\n    padding: 3px 5px;\r\n    margin-right: 5px;\r\n    border-radius: 10px;\r\n    font-weight: 400;\r\n    font-size: 12px;\r\n}\r\n.list .top .topics{\r\n\tbackground-color:red;\r\n}\r\n.list li .top .ask{\r\n\tbackground-color: rgb(102, 204, 255)\r\n}\r\n.list li .top .job{\r\n\tbackground-color: rgb(153, 153, 153);\r\n}\r\n.list li .top .good{\r\n   background-color: rgb(255, 119, 0);\r\n}\r\n.list li .status{\r\n    position: relative;\r\n    height:60px;\r\n}\r\n.list li .status .detail {\r\n    margin-left: 50px;\r\n    padding-left: 5px;\r\n}\r\n.list li .status .detail div {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    height: 30px;\r\n    line-height: 30px;\r\n}\r\n.list li .status img {\r\n    width: 50px;\r\n    height: 50px;\r\n    position: absolute;\r\n    top: 50%;\r\n    margin: -25px 0;\r\n    border-radius: 30px;\r\n    border:1px solid #ccc;\r\n}\r\n.list li .status .detail div span:first-child {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    width: 100px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    color: #333;\r\n    float: right;\r\n    text-align: right;\r\n    font-size: 12px;\r\n}\r\n.list li .status .detail div span:last-child {\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    margin-right: 100px;\r\n    display: block;\r\n    font-size: 12px;\r\n    color: #06a;\r\n    font-family: arial,verdana,microsoft yahei;\r\n}\r\n\r\n.demo-infinite-container{\r\n  width: 256px;\r\n  height: 300px;\r\n  overflow: auto;\r\n  -webkit-overflow-scrolling: touch;\r\n  border: 1px solid #d9d9d9;\r\n}\r\n.updata{\r\n\ttext-align:center;\r\n\tfont-size:16px;\r\n}\r\n.alert-matte{\r\n    width: 100%;\r\n    height: 100%;\r\n    position: fixed;\r\n    background-color: #000;\r\n    opacity: .7;\r\n    z-index: 15000;\r\n    top: 0px;\r\n}\r\n.alert{\r\n    width: 280px;\r\n    left: 50%;\r\n    margin-left: -140px;\r\n    margin-top: 50px;\r\n    position: fixed;\r\n    padding: 20px;\r\n    background: #fff;\r\n    border-radius: 5px;\r\n    box-sizing: border-box;\r\n    box-shadow: 0 5px 15px #555;\r\n    text-align: center;\r\n    color: #f70;\r\n    z-index: 20000;\r\n}\r\n.login-dialog input {\r\n    margin-bottom: 10px;\r\n    width: 100%;\r\n    line-height: 30px;\r\n    padding: 5px;\r\n    display: block;\r\n}\r\n.login-dialog input[type=text]{\r\n    border: 2px solid rgba(153, 102, 255, 0.9);\r\n    border-radius: 5px;\r\n    color: rgba(153, 102, 255, 0.9);\r\n    -webkit-transition: all .2s ease;\r\n    transition: all .2s ease;\r\n}\r\n.count {\r\n    outline: none;\r\n}\r\n.subtitle {\r\n    width: 150px;\r\n    line-height: 1.8;\r\n    margin: 20px auto !important;\r\n    padding: 10px !important;\r\n    border-bottom: 2px solid #42b983;\r\n    text-align: center;\r\n    position: relative;\r\n}\r\n.subtitle strong{\r\n    color: #42b983;\r\n}\r\n.btn, .lbtn {\r\n    margin: 10px auto;\r\n    padding: 0;\r\n    display: block;\r\n    background-color: rgba(153, 102, 255, 0.9);\r\n    color: #fff;\r\n    font-size: 14px;\r\n}\r\n.lbtn{\r\n    width: 100%;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    border: none;\r\n    border-radius: 5px;\r\n}\r\n.isSuccess {\r\n    width: 100px;\r\n    height: 30px;\r\n    background: rgba(51, 51, 51, 0.8);\r\n    color: white;\r\n    position: fixed;\r\n    left: 140px;\r\n    top: 300px;\r\n    line-height: 30px;\r\n    border-radius: 20px;\r\n    text-align: center;\r\n}\r\n\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "/*!\n * Muse UI v2.0.3 (https://github.com/myronliu347/vue-carbon)\n * (c) 2017 Myron Liu \n * Released under the MIT License.\n */\n/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block}audio:not([controls]){display:none;height:0}progress{vertical-align:baseline}[hidden],template{display:none}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit;font-weight:bolder}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}svg:not(:root){overflow:hidden}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}button,input,select,textarea{font:inherit;margin:0}optgroup{font-weight:700}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-input-placeholder{color:inherit;opacity:.54}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}*,:after,:before{box-sizing:border-box}html{font-size:62.5%}body{font-family:Roboto,Lato,sans-serif;line-height:1.5;font-size:14px;font-weight:400;width:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);background-color:#fff;color:rgba(0,0,0,.87)}body,html{overflow-x:hidden;overflow-y:auto}pre{white-space:pre-wrap;word-break:break-all;margin:0}a{text-decoration:none;color:#ff4081;user-select:none;-webkit-user-select:none}.mu-icon{font-size:24px;cursor:inherit}.mu-badge-container{display:inline-block;position:relative}.mu-badge{font-size:10px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:0 6px;line-height:1.5;font-size:12px;font-style:normal;background-color:#bdbdbd;color:#fff;border-radius:3px;overflow:hidden}.mu-badge-float{position:absolute;top:-12px;right:-12px}.mu-badge-circle{border-radius:50%;padding:0;width:24px;height:24px;overflow:hidden}.mu-badge-primary{background-color:#7e57c2}.mu-badge-secondary{background-color:#ff4081}.mu-appbar{-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start;color:#fff;background-color:#7e57c2;height:56px;padding:0 8px;width:100%;z-index:3}.mu-appbar,.mu-appbar>.left,.mu-appbar>.right{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0}.mu-appbar>.left,.mu-appbar>.right{height:100%}.mu-appbar .mu-icon-button{color:inherit}.mu-appbar .mu-flat-button{color:inherit;height:100%;line-height:100%;min-width:auto}.mu-appbar-title{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;padding-left:8px;padding-right:8px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:20px;font-weight:400;line-height:56px}@media (min-width:480px){.mu-appbar-title{line-height:64px}.mu-appbar{height:64px}.mu-appbar-title{font-size:24px}}.mu-icon-button{position:relative;display:inline-block;overflow:visible;line-height:1;width:48px;height:48px;border-radius:50%;font-size:24px;padding:12px;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;color:inherit;text-decoration:none;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;cursor:pointer}.mu-icon-button .mu-circle-ripple{color:rgba(0,0,0,.87)}.mu-icon-button.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-ripple-wrapper{overflow:hidden}.mu-circle-ripple,.mu-ripple-wrapper{height:100%;width:100%;position:absolute;top:0;left:0}.mu-circle-ripple{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-radius:50%;background-color:currentColor;background-clip:padding-box;opacity:.1}.mu-ripple-enter-active,.mu-ripple-leave-active{-webkit-transition:opacity 2s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity 2s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity 2s cubic-bezier(.23,1,.32,1),transform .45s cubic-bezier(.23,1,.32,1);transition:opacity 2s cubic-bezier(.23,1,.32,1),transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-ripple-enter{-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0)}.mu-ripple-leave-active{opacity:0!important}.mu-focus-ripple-wrapper{height:100%;width:100%;position:absolute;top:0;left:0;overflow:hidden}.mu-focus-ripple{position:absolute;height:100%;width:100%;border-radius:50%;opacity:.16;background-color:currentColor;-webkit-animation:a .75s cubic-bezier(.445,.05,.55,.95);animation:a .75s cubic-bezier(.445,.05,.55,.95);-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-direction:alternate;animation-direction:alternate}@-webkit-keyframes a{0%{-webkit-transform:scale(.72);transform:scale(.72)}to{-webkit-transform:scale(.85);transform:scale(.85)}}@keyframes a{0%{-webkit-transform:scale(.72);transform:scale(.72)}to{-webkit-transform:scale(.85);transform:scale(.85)}}.mu-tooltip{position:absolute;font-size:10px;line-height:22px;padding:0 8px;z-index:5;color:#fff;overflow:hidden;top:-1000px;border-radius:2px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:0;-webkit-transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip.when-shown{opacity:.9;-webkit-transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip.touched{font-size:14px;line-height:32px;padding:0 16px}.mu-tooltip-ripple{position:absolute;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);border-radius:50%;background-color:transparent;-webkit-transition:width 0ms cubic-bezier(.23,1,.32,1) .45s,height 0ms cubic-bezier(.23,1,.32,1) .45s,background-color .45s cubic-bezier(.23,1,.32,1) 0ms;transition:width 0ms cubic-bezier(.23,1,.32,1) .45s,height 0ms cubic-bezier(.23,1,.32,1) .45s,background-color .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip-ripple.when-shown{background-color:#616161;-webkit-transition:width .45s cubic-bezier(.23,1,.32,1) 0ms,height .45s cubic-bezier(.23,1,.32,1) 0ms,background-color .45s cubic-bezier(.23,1,.32,1) 0ms;transition:width .45s cubic-bezier(.23,1,.32,1) 0ms,height .45s cubic-bezier(.23,1,.32,1) 0ms,background-color .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip-label{white-space:nowrap;position:relative}.mu-flat-button{display:inline-block;overflow:hidden;position:relative;border-radius:2px;height:36px;line-height:36px;min-width:88px;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);text-decoration:none;text-transform:uppercase;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;color:rgba(0,0,0,.87);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;padding:0;cursor:pointer}.mu-flat-button.hover{background-color:rgba(0,0,0,.1)}.mu-flat-button.disabled{color:rgba(0,0,0,.38);cursor:not-allowed;background:none}.mu-flat-button .mu-icon{vertical-align:middle;margin-left:12px;margin-right:0}.mu-flat-button .mu-icon+.mu-flat-button-label{padding-left:8px}.mu-flat-button.no-label .mu-icon{margin-left:0}.mu-flat-button .mu-circle-ripple{color:rgba(0,0,0,.87)}.mu-flat-button.label-before{padding-right:8px}.mu-flat-button.label-before .mu-icon{margin-right:4px;margin-left:0}.mu-flat-button.label-before .mu-flat-button-label{padding-right:8px}.mu-flat-button-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;width:100%;height:100%}.mu-flat-button-primary{color:#7e57c2}.mu-flat-button-secondary{color:#ff4081}.mu-flat-button-label{vertical-align:middle;padding-right:16px;padding-left:16px;font-size:14px}.mu-raised-button{display:inline-block;overflow:hidden;position:relative;border-radius:2px;height:36px;line-height:36px;min-width:88px;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);text-decoration:none;text-transform:uppercase;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;color:rgba(0,0,0,.87);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;padding:0;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-raised-button.focus{box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-raised-button.hover .mu-raised-button-wrapper{background-color:rgba(0,0,0,.1)}.mu-raised-button.disabled{color:rgba(0,0,0,.3);cursor:not-allowed;background-color:#e6e6e6;box-shadow:none}.mu-raised-button.disabled.hover,.mu-raised-button.disabled:active,.mu-raised-button.disabled:hover{box-shadow:none}.mu-raised-button.disabled.hover .mu-raised-button-wrapper,.mu-raised-button.disabled:active .mu-raised-button-wrapper,.mu-raised-button.disabled:hover .mu-raised-button-wrapper{background-color:transparent}.mu-raised-button .mu-icon{vertical-align:middle;margin-left:12px;margin-right:0}.mu-raised-button .mu-icon+.mu-raised-button-label{padding-left:8px}.mu-raised-button.no-label .mu-icon{margin:0}.mu-raised-button.label-before .mu-raised-button-wrapper{padding-right:8px}.mu-raised-button.label-before .mu-icon{margin-right:4px;margin-left:0}.mu-raised-button.label-before .mu-raised-button-label{padding-right:8px}.mu-raised-button:active{box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-raised-button-wrapper{border-radius:2px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;width:100%;height:100%}.mu-raised-button-primary{background-color:#7e57c2}.mu-raised-button-secondary{background-color:#ff4081}.mu-raised-button-full{width:100%}.mu-raised-button.mu-raised-button-inverse{color:#fff}.mu-raised-button.mu-raised-button-inverse .mu-circle-ripple{opacity:.3}.mu-raised-button.mu-raised-button-inverse.hover .mu-raised-button-wrapper{background-color:hsla(0,0%,100%,.3)}.mu-raised-button-label{vertical-align:middle;padding-right:16px;padding-left:16px}.mu-float-button{position:relative;display:inline-block;overflow:visible;line-height:1;width:56px;height:56px;border-radius:50%;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#7e57c2;color:#fff;text-decoration:none;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;padding:0;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-float-button .mu-circle-ripple{opacity:.3}.mu-float-button.disabled{color:rgba(0,0,0,.3);cursor:not-allowed;background-color:#e6e6e6;box-shadow:none}.mu-float-button.disabled.hover,.mu-float-button.disabled:active,.mu-float-button.disabled:hover{box-shadow:none}.mu-float-button.disabled.hover .mu-float-button-wrapper,.mu-float-button.disabled:active .mu-float-button-wrapper,.mu-float-button.disabled:hover .mu-float-button-wrapper{background-color:transparent}.mu-float-button.hover,.mu-float-button:active{box-shadow:0 10px 30px rgba(0,0,0,.188235),0 6px 10px rgba(0,0,0,.227451)}.mu-float-button.hover .mu-float-button-wrapper,.mu-float-button:active .mu-float-button-wrapper{background-color:hsla(0,0%,100%,.3)}.mu-float-button-wrapper{border-radius:50%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:absolute;left:0;top:0;right:0;bottom:0}.mu-float-button-mini{width:40px;height:40px}.mu-float-button-secondary{background-color:#ff4081}.mu-content-block{padding:8px 16px;width:100%}.mu-content-block p{margin-top:1em;margin-bottom:1em}.mu-content-block p:first-child{margin-top:0}.mu-content-block p:last-child{margin-bottom:0}.mu-list{padding:8px 0;width:100%;position:relative;overflow-x:hidden;overflow-y:visible}.mu-list .mu-sub-header:first-child{margin-top:-8px}.mu-item-wrapper{display:block;color:inherit;position:relative;outline:none;cursor:pointer}.mu-item-wrapper.hover{background-color:rgba(0,0,0,.1)}.mu-item-wrapper.disabled{cursor:default}.mu-item{min-height:48px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:16px;color:rgba(0,0,0,.87);position:relative}.mu-item.show-left{padding-left:72px}.mu-item.show-right{padding-right:56px}.mu-item.has-avatar{min-height:56px}.mu-item.selected{color:#7e57c2}.mu-item-toggle-button{color:rgba(0,0,0,.87);position:absolute;right:4px;top:0}.mu-item-left,.mu-item-right{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:40px;height:100%;position:absolute;color:#757575;top:0;max-height:72px}.mu-item-left{left:16px}.mu-item.selected .mu-item-left{color:#7e57c2}.mu-item-right{right:12px;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.mu-item-right>.mu-icon-button,.mu-item-right>.mu-icon-menu{-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start}.mu-item-content{width:100%;-webkit-align-self:center;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.mu-item-title-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;width:100%;line-height:1}.mu-item-title{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;display:block;font-size:16px;max-width:100%}.mu-item-sub-title{line-height:1;margin-top:4px}.mu-item-after{margin-left:auto;color:rgba(0,0,0,.54);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-item-text{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;position:relative;overflow:hidden;font-size:14px;line-height:18px;margin-top:4px;max-height:40px;max-width:100%;text-overflow:ellipsis;word-break:break-all;color:rgba(0,0,0,.54)}.mu-item-svg-icon{display:inline-block;width:24px;height:24px;stroke-width:2;fill:none;stroke:currentColor;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-expand-enter-active,.mu-expand-leave-active{-webkit-transition:height .45s cubic-bezier(.23,1,.32,1),padding .45s cubic-bezier(.23,1,.32,1);transition:height .45s cubic-bezier(.23,1,.32,1),padding .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translateZ(0);transform:translateZ(0)}.mu-sub-header{color:rgba(0,0,0,.54);font-size:14px;line-height:48px;padding-left:16px;width:100%}.mu-sub-header.inset{padding-left:72px}.mu-divider{margin:0;height:1px;border:none;background-color:rgba(0,0,0,.12);width:100%}.mu-divider.inset{margin-left:72px}.mu-divider.shallow-inset{margin-left:16px}html.pixel-ratio-2 .mu-divider{-webkit-transform:scaleY(.5);-ms-transform:scaleY(.5);transform:scaleY(.5)}html.pixel-ratio-3 .mu-divider{-webkit-transform:scaleY(.33);-ms-transform:scaleY(.33);transform:scaleY(.33)}.mu-refresh-control{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;margin:0 auto;width:40px;height:40px;color:#7e57c2;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;background-color:#fff;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647);position:absolute;left:50%;margin-left:-18px;margin-top:24px;z-index:2}.mu-refresh-control .mu-icon{display:inline-block;vertical-align:middle}.mu-refresh-svg-icon{display:inline-block;width:28px;height:28px;fill:currentColor;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-refresh-control-animate{-webkit-transition:all .45s ease;transition:all .45s ease}.mu-refresh-control-hide{opacity:1;-webkit-transform:translate3d(0,-68px,0);transform:translate3d(0,-68px,0)}.mu-refresh-control-noshow{opacity:0;-webkit-transform:scale(.01);-ms-transform:scale(.01);transform:scale(.01)}.mu-refresh-control-refreshing{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);opacity:1}.mu-circle-wrapper{display:inline-block;position:relative;width:48px;height:48px}.mu-circle-wrapper.active{-webkit-animation:e 1568ms linear infinite;animation:e 1568ms linear infinite}.mu-circle-wrapper .mu-circle{border-radius:50%}.mu-circle-wrapper .left{float:left!important}.mu-circle-wrapper .right{float:right!important}.mu-circle-spinner{position:absolute;width:100%;height:100%;opacity:0;border-color:#7e57c2;opacity:1;-webkit-animation:b 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:b 5332ms cubic-bezier(.4,0,.2,1) infinite both}.mu-circle-secondary{border-color:#ff4081}.mu-circle-clipper{display:inline-block;position:relative;width:50%}.mu-circle-clipper,.mu-circle-gap-patch{height:100%;overflow:hidden;border-color:inherit}.mu-circle-gap-patch{position:absolute;top:0;left:45%;width:10%}.mu-circle-gap-patch .mu-circle{width:1000%;left:-450%}.mu-circle-clipper .mu-circle{width:200%;height:100%;border-width:3px;border-style:solid;border-color:inherit;border-bottom-color:transparent!important;border-radius:50%;-webkit-animation:none;animation:none;position:absolute;top:0;right:0;bottom:0}.mu-circle-spinner.active .mu-circle-clipper.left .mu-circle{-webkit-animation:c 1333ms cubic-bezier(.4,0,.2,1) infinite both;animation:c 1333ms cubic-bezier(.4,0,.2,1) infinite both}.mu-circle-spinner.active .mu-circle-clipper.right .mu-circle{-webkit-animation:d 1333ms cubic-bezier(.4,0,.2,1) infinite both;animation:d 1333ms cubic-bezier(.4,0,.2,1) infinite both}.mu-circle-clipper.left .mu-circle{left:0;border-right-color:transparent!important;-webkit-transform:rotate(129deg);-ms-transform:rotate(129deg);transform:rotate(129deg)}.mu-circle-clipper.right .mu-circle{left:-100%;border-left-color:transparent!important;-webkit-transform:rotate(-129deg);-ms-transform:rotate(-129deg);transform:rotate(-129deg)}@-webkit-keyframes b{12.5%{-webkit-transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg)}to{-webkit-transform:rotate(3turn)}}@keyframes b{12.5%{-webkit-transform:rotate(135deg);transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg);transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg);transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg);transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg);transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg);transform:rotate(945deg)}to{-webkit-transform:rotate(3turn);transform:rotate(3turn)}}@-webkit-keyframes c{0%{-webkit-transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg)}}@keyframes c{0%{-webkit-transform:rotate(130deg);transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg);transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg);transform:rotate(130deg)}}@-webkit-keyframes d{0%{-webkit-transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg)}}@keyframes d{0%{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg);transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}}@-webkit-keyframes e{to{-webkit-transform:rotate(1turn)}}@keyframes e{to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.mu-infinite-scroll{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding-bottom:8px;line-height:36px;width:100%}.mu-infinite-scroll-text{margin-left:16px;font-size:16px}.mu-avatar{display:inline-block;height:40px;width:40px;font-size:20px;color:#fff;background-color:#bdbdbd;text-align:center;border-radius:50%}.mu-avatar img{border-radius:50%;width:100%;height:100%;display:block}.mu-avatar-inner{height:100%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.mu-avatar-inner,.mu-tabs{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-tabs{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;background-color:#7e57c2;color:#fff;text-align:center;position:relative;z-index:3}.mu-tab-link-highlight{position:absolute;left:0;bottom:0;height:2px;background-color:#ff4081;-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-tab-link{min-height:48px;padding-top:12px;padding-bottom:12px;font-size:14px;background:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;text-decoration:none;border:none;outline:none;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;color:inherit;position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;line-height:normal;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;color:hsla(0,0%,100%,.7);-webkit-transition:all .45s cubic-bezier(.445,.05,.55,.95);transition:all .45s cubic-bezier(.445,.05,.55,.95);cursor:pointer}.mu-tab-active{color:#fff}.mu-tab-text.has-icon{margin-top:8px}.mu-paper{-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.87);background-color:#fff;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-paper-round{border-radius:2px}.mu-paper-circle{border-radius:50%}.mu-paper-1{box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-paper-2{box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-paper-3,.mu-paper-4{box-shadow:0 14px 45px rgba(0,0,0,.247059),0 10px 18px rgba(0,0,0,.219608)}.mu-paper-5{box-shadow:0 19px 60px rgba(0,0,0,.298039),0 15px 20px rgba(0,0,0,.219608)}.mu-bottom-nav{height:56px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;background-color:#fff;text-align:center;position:relative;width:100%;color:#fff}.mu-bottom-nav-shift{background-color:#7e57c2}.mu-bottom-nav-shift-wrapper{height:100%;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;text-align:center}.mu-buttom-item{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;min-width:80px;max-width:168px;position:relative;height:100%;color:rgba(0,0,0,.54);padding:0;background:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;text-decoration:none;border:none;outline:none;-webkit-transition:all .4s cubic-bezier(.445,.05,.55,.95);transition:all .4s cubic-bezier(.445,.05,.55,.95);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding:6px}.mu-bottom-nav-shift .mu-buttom-item{color:hsla(0,0%,100%,.7);padding:8px 12px 10px;min-width:56px;max-width:168px}.mu-buttom-item-wrapper{display:block;height:100%}.mu-bottom-item-active{padding-top:6px;padding-bottom:5px}.mu-bottom-item-active .mu-bottom-item-text{font-size:14px}.mu-bottom-nav-shift .mu-bottom-item-active{-webkit-box-flex:1.7;-webkit-flex:1.7;-ms-flex:1.7;flex:1.7;min-width:96px;max-width:168px;padding-top:6px;padding-bottom:5px}.mu-bottom-item-text{display:block;text-align:center;font-size:12px;-webkit-transition:all .4s cubic-bezier(.23,1,.32,1),color .3s,font-size .3s;transition:all .4s cubic-bezier(.23,1,.32,1),color .3s,font-size .3s;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-bottom-item-active .mu-bottom-item-text{color:#7e57c2}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-text{color:#fff}.mu-bottom-nav-shift .mu-bottom-item-text{opacity:0;-webkit-transform:scale(1) translate3d(0,6px,0);transform:scale(1) translate3d(0,6px,0)}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-text{-webkit-transform:scale(1) translate3d(0,2px,0);transform:scale(1) translate3d(0,2px,0);opacity:1}.mu-bottom-item-icon{display:block;margin:auto;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden;width:24px}.mu-bottom-item-active .mu-bottom-item-icon{color:#7e57c2}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-icon{color:#fff}.mu-bottom-nav-shift .mu-bottom-item-icon{-webkit-transform:translate3d(0,8px,0);transform:translate3d(0,8px,0)}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-icon{-webkit-transform:scale(1) translateZ(0);transform:scale(1) translateZ(0)}.mu-card{background-color:#fff;position:relative;border-radius:2px;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-card-header{padding:16px;font-weight:500;position:relative;white-space:nowrap}.mu-card-header .mu-avatar{margin-right:16px}.mu-card-header-title{display:inline-block;vertical-align:top;white-space:normal;padding-right:90px}.mu-card-header-title .mu-card-title{font-size:15px;color:rgba(0,0,0,.87)}.mu-card-header-title .mu-card-sub-title{font-size:14px;color:rgba(0,0,0,.57)}.mu-card-media{position:relative}.mu-card-media>img{width:100%;max-width:100%;min-width:100%;display:block;vertical-align:top}.mu-card-media-title{position:absolute;left:0;right:0;bottom:0;padding:16px;background-color:rgba(0,0,0,.54)}.mu-card-media-title .mu-card-title{font-size:24px;color:hsla(0,0%,100%,.87);line-height:36px}.mu-card-media-title .mu-card-sub-title{color:hsla(0,0%,100%,.54);font-size:14px}.mu-card-title-container{padding:16px;position:relative}.mu-card-title-container .mu-card-title{font-size:24px;color:rgba(0,0,0,.87);line-height:36px}.mu-card-title-container .mu-card-sub-title{font-size:14px;color:rgba(0,0,0,.54);display:block}.mu-card-text{padding:16px;font-size:14px;color:rgba(0,0,0,.87)}.mu-card-actions{padding:8px;position:relative}.mu-chip{border-radius:16px;line-height:32px;white-space:nowrap;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;background-color:#e0e0e0;color:rgba(0,0,0,.87);padding:0 12px;cursor:default}.mu-chip .mu-avatar:first-child{margin-left:-12px;margin-right:4px}.mu-chip.active{box-shadow:0 1px 6px rgba(0,0,0,.12),0 1px 4px rgba(0,0,0,.12)}.mu-chip.hover{background-color:#cecece;cursor:pointer}.mu-chip.hover .mu-chip-delete-icon{color:rgba(0,0,0,.4)}.mu-chip-delete-icon{display:inline-block;margin-right:-8px;margin-left:4px;color:rgba(0,0,0,.26);fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-overlay{position:absolute;left:0;right:0;top:0;bottom:0;background-color:#000;opacity:.4;z-index:6}.mu-overlay-fade-enter-active,.mu-overlay-fade-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1)}.mu-overlay-fade-enter,.mu-overlay-fade-leave-active{opacity:0!important}.mu-dialog-wrapper{position:fixed;left:0;top:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-dialog{width:75%;max-width:768px;padding:0;background-color:#fff;border-radius:2px;font-size:16px;box-shadow:0 19px 60px rgba(0,0,0,.298039),0 15px 20px rgba(0,0,0,.219608)}.mu-dialog-title{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:24px 24px 20px;margin:0;font-size:22px;font-weight:400;line-height:32px;color:rgba(0,0,0,.87)}.mu-dialog-title+.mu-dialog-body{padding-top:0}.mu-dialog-title.scrollable{border-bottom:1px solid rgba(0,0,0,.12)}.mu-dialog-body{padding:24px 24px 20px;color:rgba(0,0,0,.6)}.mu-dialog-actions{min-height:48px;padding:8px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end}.mu-dialog-actions .mu-raised-button+.mu-raised-button{margin-left:10px}.mu-dialog-actions.scrollable{border-top:1px solid rgba(0,0,0,.12)}.mu-dialog-slide-enter-active,.mu-dialog-slide-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1)}.mu-dialog-slide-enter-active .mu-dialog,.mu-dialog-slide-leave-active .mu-dialog{-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-dialog-slide-enter,.mu-dialog-slide-leave-active{opacity:0}.mu-dialog-slide-enter .mu-dialog{-webkit-transform:translate3d(0,-64px,0);transform:translate3d(0,-64px,0)}.mu-dialog-slide-leave-active .mu-dialog{-webkit-transform:translate3d(0,64px,0);transform:translate3d(0,64px,0)}.mu-toast{height:48px;line-height:48px;padding:0 24px;background-color:rgba(0,0,0,.87);color:#fff;border-radius:24px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;word-wrap:break-word;max-width:568px;width:100%;position:fixed;left:0;bottom:0}@media only screen and (max-width:992px) and (min-width:601px){.mu-toast{width:auto;min-width:288px;left:5%;bottom:7%}}@media only screen and (min-width:993px){.mu-toast{width:auto;min-width:8%;top:10%;right:7%;left:auto;bottom:auto;min-width:288px}}.mu-toast-enter-active,.mu-toast-leave-active{-webkit-transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-toast-enter,.mu-toast-leave-active{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0}.mu-snackbar{position:fixed;bottom:0;left:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;color:#fff;background-color:rgba(0,0,0,.87);padding:0 24px;min-height:48px;width:100%;max-width:568px}.mu-snackbar-action{margin:0 -16px 0 24px}.mu-snackbar-message{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;padding-top:8px;padding-bottom:8px}@media only screen and (max-width:992px) and (min-width:601px){.mu-snackbar{width:auto;min-width:288px;left:5%;bottom:7%}}@media only screen and (min-width:993px){.mu-snackbar{width:auto;min-width:8%;top:10%;right:7%;left:auto;bottom:auto;min-width:288px}}.mu-snackbar-enter-active,.mu-snackbar-leave-active{-webkit-transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-snackbar-enter,.mu-snackbar-leave-active{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0}.mu-popup{position:fixed;background-color:#fff;top:50%;left:50%;-webkit-transform:translate3d(-50%,-50%,0);transform:translate3d(-50%,-50%,0);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-popup-top{top:0;right:auto;bottom:auto;left:50%;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0)}.mu-popup-right{top:50%;right:0;bottom:auto;left:auto;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.mu-popup-bottom{top:auto;right:auto;bottom:0;left:50%;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0)}.mu-popup-left{top:50%;right:auto;bottom:auto;left:0;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.popup-slide-bottom-enter-active,.popup-slide-bottom-leave-active,.popup-slide-left-enter-active,.popup-slide-left-leave-active,.popup-slide-right-enter-active,.popup-slide-right-leave-active,.popup-slide-top-enter-active,.popup-slide-top-leave-active{-webkit-transition:-webkit-transform .3s ease;transition:-webkit-transform .3s ease;transition:transform .3s ease;transition:transform .3s ease,-webkit-transform .3s ease}.popup-slide-top-enter,.popup-slide-top-leave-active{-webkit-transform:translate3d(-50%,-100%,0);transform:translate3d(-50%,-100%,0)}.popup-slide-right-enter,.popup-slide-right-leave-active{-webkit-transform:translate3d(100%,-50%,0);transform:translate3d(100%,-50%,0)}.popup-slide-bottom-enter,.popup-slide-bottom-leave-active{-webkit-transform:translate3d(-50%,100%,0);transform:translate3d(-50%,100%,0)}.popup-slide-left-enter,.popup-slide-left-leave-active{-webkit-transform:translate3d(-100%,-50%,0);transform:translate3d(-100%,-50%,0)}.popup-fade-enter-active,.popup-fade-leave-active{-webkit-transition:opacity .3s;transition:opacity .3s}.popup-fade-enter,.popup-fade-leave-active{opacity:0}.mu-menu{z-index:2;outline:none}.mu-menu-list{padding:8px 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow-y:auto;-webkit-overflow-scrolling:touch}.mu-menu-list>.mu-divider{margin:7px 0 8px}.mu-menu-list>.mu-sub-header{padding-left:24px;margin-top:-8px}.mu-menu-destop{padding:16px 0}.mu-menu-destop>.mu-sub-header{margin-top:-16px}.mu-menu-item-wrapper{display:block;font-size:16px;height:48px;line-height:48px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.87);position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-menu-destop .mu-menu-item-wrapper{height:32px;line-height:32px;font-size:15px}.mu-menu-item-wrapper.hover{background-color:rgba(0,0,0,.1)}.mu-menu-item-wrapper.active{color:#ff4081}.mu-menu-item-wrapper.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-menu-item{padding:0 16px;position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-menu-destop .mu-menu-item{padding:0 24px}.mu-menu-item.have-left-icon{padding-left:72px}.mu-menu-item-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;word-wrap:break-word}.mu-menu-item-left-icon{position:absolute;top:0;left:4px;margin:12px;color:#757575}.mu-menu-destop .mu-menu-item-left-icon{top:4px;left:24px;margin:0}.mu-menu-item-right-icon{position:absolute;top:0;right:4px;margin:12px;color:#757575}.mu-menu-destop .mu-menu-item-right-icon{top:4px;right:24px;margin:0}.mu-popover{position:fixed;background:#fff;border-radius:2px;max-height:100%;overflow:visible;-webkit-overflow-scrolling:touch;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647);-webkit-transform-origin:center top;-ms-transform-origin:center top;transform-origin:center top}.mu-popover-enter-active,.mu-popover-leave-active{-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-property:opacity,-webkit-transform;transition-property:opacity,-webkit-transform;transition-property:opacity,transform;transition-property:opacity,transform,-webkit-transform}.mu-popover-enter,.mu-popover-leave-active{-webkit-transform:scaleY(0);-ms-transform:scaleY(0);transform:scaleY(0);opacity:0}.mu-bottom-sheet{background-color:#fff;position:fixed;left:0;right:0;bottom:0}.mu-bottom-sheet-enter-active,.mu-bottom-sheet-leave-active{-webkit-transition:-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-bottom-sheet-enter,.mu-bottom-sheet-leave-active{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}.mu-dropDown-menu,.mu-icon-menu{display:inline-block;position:relative}.mu-dropDown-menu{font-size:15px;height:48px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);cursor:pointer;overflow:hidden}.mu-dropDown-menu.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-dropDown-menu-icon{position:absolute;right:16px;top:16px;color:rgba(0,0,0,.12);fill:currentColor;display:inline-block;width:24px;height:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-dropDown-menu-text{padding-left:24px;padding-right:48px;line-height:56px;opacity:1;position:relative;color:rgba(0,0,0,.87)}.mu-dropDown-menu.disabled .mu-dropDown-menu-text{color:rgba(0,0,0,.38)}.mu-dropDown-menu-text-overflow{white-space:nowrap;overflow:hidden;width:100%}.mu-dropDown-menu-line{bottom:1px;left:0;margin:-1px 24px;right:0;position:absolute;height:1px;background-color:rgba(0,0,0,.12);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}html.pixel-ratio-2 .mu-dropDown-menu-line{-webkit-transform:scaleY(.5);-ms-transform:scaleY(.5);transform:scaleY(.5)}html.pixel-ratio-3 .mu-dropDown-menu-line{-webkit-transform:scaleY(.33);-ms-transform:scaleY(.33);transform:scaleY(.33)}.mu-drawer{width:256px;position:fixed;top:0;bottom:0;overflow:auto;-webkit-overflow-scrolling:touch;-webkit-transition-property:visibility,-webkit-transform;transition-property:visibility,-webkit-transform;transition-property:transform,visibility;transition-property:transform,visibility,-webkit-transform;-webkit-transition-duration:.45s;transition-duration:.45s;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);border-radius:0;left:0;visibility:hidden;z-index:4}.mu-drawer::-webkit-scrollbar{display:none!important;width:0!important;height:0!important;-webkit-appearance:none;opacity:0!important}.mu-drawer.right{right:0;left:auto;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.mu-drawer.open{-webkit-transform:translateZ(0);transform:translateZ(0);visibility:visible}.mu-picker{background:#fff;overflow:hidden;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;-webkit-mask-box-image:-webkit-linear-gradient(bottom,transparent,transparent 5%,#fff 20%,#fff 80%,transparent 95%,transparent);-webkit-mask-box-image:linear-gradient(0deg,transparent,transparent 5%,#fff 20%,#fff 80%,transparent 95%,transparent)}.mu-picker-center-highlight{height:36px;box-sizing:border-box;position:absolute;left:0;width:100%;top:50%;margin-top:-18px;pointer-events:none;border-top:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12)}.mu-picker-center-highlight:before{left:0;top:0;bottom:auto;right:auto}.mu-picker-center-highlight:after{left:0;bottom:0;right:auto;top:auto}.mu-picker-slot{-webkit-box-flex:1;-webkit-flex-shrink:1;-ms-flex:0 1 auto;-ms-flex-negative:1;flex-shrink:1;font-size:18px;overflow:hidden;position:relative;max-height:100%;text-align:center}.mu-picker-slot.mu-picker-slot-divider{color:rgba(0,0,0,.87);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;line-height:36px}.mu-picker-slot-wrapper.animate{-webkit-transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-picker-item,.mu-picker-slot-wrapper.animate{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-picker-item{line-height:36px;padding:0 10px;font-size:20px;white-space:nowrap;position:relative;overflow:hidden;text-overflow:ellipsis;color:rgba(0,0,0,.54);left:0;top:0;width:100%;box-sizing:border-box;-webkit-transition-duration:.3s;transition-duration:.3s}.mu-picker-item.selected{color:rgba(0,0,0,.87);-webkit-transform:translateZ(0) rotateX(0);transform:translateZ(0) rotateX(0)}.mu-text-field{font-size:16px;width:256px;min-height:48px;display:inline-block;position:relative;color:rgba(0,0,0,.54);margin-bottom:8px}.mu-text-field.full-width{width:100%}.mu-text-field.has-icon{padding-left:56px}.mu-text-field.focus-state{color:#7e57c2}.mu-text-field.focus-state.error{color:#f44336}.mu-text-field.has-label{min-height:72px}.mu-text-field-icon{position:absolute;left:16px;top:12px}.mu-text-field.has-label .mu-text-field-icon{top:36px}.mu-text-field-content{display:block;height:100%;padding-bottom:12px;padding-top:4px}.mu-text-field.disabled .mu-text-field-content{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-text-field.has-label .mu-text-field-content{padding-top:28px;padding-bottom:12px}.mu-text-field-input{-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;border:none;background:none;border-radius:0 0 0 0;box-shadow:none;display:block;padding:0;margin:0;width:100%;height:32px;font-style:inherit;font-variant:inherit;font-weight:inherit;font-stretch:inherit;font-size:inherit;color:rgba(0,0,0,.87);font-family:inherit;position:relative}.mu-text-field-help{position:absolute;margin-top:6px;font-size:12px;line-height:12px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;left:0;right:0}.mu-text-field.has-icon .mu-text-field-help{left:56px}.mu-text-field.error .mu-text-field-help{color:#f44336}.mu-text-field.disabled .mu-text-field-help{color:inherit}.mu-text-field-line{margin:0;height:1px;border:none;background-color:rgba(0,0,0,.12);left:0;right:0;position:absolute}.mu-text-field.has-icon .mu-text-field-line{left:56px}.mu-text-field-line.disabled{height:auto;background-color:transparent;border-bottom:2px dotted rgba(0,0,0,.38)}.mu-text-field-focus-line{margin:0;height:2px;border:none;background-color:#7e57c2;position:absolute;left:0;right:0;margin-top:-1px;-webkit-transform:scaleX(0);-ms-transform:scaleX(0);transform:scaleX(0);-webkit-transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-text-field.has-icon .mu-text-field-focus-line{left:56px}.mu-text-field-focus-line.error,.mu-text-field-focus-line.focus{-webkit-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1)}.mu-text-field-focus-line.error{background-color:#f44336}.mu-text-field-textarea{resize:vertical;line-height:1.5;position:relative;height:100%;resize:none}.mu-text-field-multiline{width:100%;position:relative}.mu-text-field-textarea-hide{width:100%;height:auto;resize:none;position:absolute;padding:0;overflow:auto;visibility:hidden}.mu-text-field-label{line-height:20px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);z-index:1;cursor:text;-webkit-transform:translateZ(0) scale(.75);transform:translateZ(0) scale(.75);-webkit-transform-origin:left top;-ms-transform-origin:left top;transform-origin:left top;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-text-field.has-label .mu-text-field-label{top:8px;position:absolute}.mu-text-field.has-label .mu-text-field-label.float{-webkit-transform:translate3d(0,28px,0) scale(1);transform:translate3d(0,28px,0) scale(1);color:rgba(0,0,0,.38)}.mu-text-field-hint{position:absolute;opacity:0;-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.38);line-height:34px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:text}.mu-text-field-hint.show{opacity:1}.mu-text-field.multi-line .mu-text-field-hint{line-height:1.5}.mu-select-field .mu-dropDown-menu{display:block;width:100%;height:32px}.mu-select-field .mu-dropDown-menu-text{line-height:32px;height:32px;padding-left:0;padding-right:24px;word-wrap:break-word;overflow:hidden}.mu-select-field .mu-dropDown-menu-line{display:none}.mu-select-field .mu-dropDown-menu-icon{right:0;top:6px}.mu-checkbox{position:relative;display:inline-block;height:24px;line-height:24px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-checkbox input[type=checkbox]{display:none}.mu-checkbox input[type=checkbox]:checked+.mu-checkbox-wrapper .mu-checkbox-icon-uncheck{opacity:0;-webkit-transition:opacity .65s cubic-bezier(.23,1,.32,1) .15s;transition:opacity .65s cubic-bezier(.23,1,.32,1) .15s;color:#7e57c2}.mu-checkbox input[type=checkbox]:checked+.mu-checkbox-wrapper .mu-checkbox-icon-checked{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);-webkit-transition:opacity 0ms cubic-bezier(.23,1,.32,1),-webkit-transform .8s cubic-bezier(.23,1,.32,1);transition:opacity 0ms cubic-bezier(.23,1,.32,1),-webkit-transform .8s cubic-bezier(.23,1,.32,1);transition:opacity 0ms cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1);transition:opacity 0ms cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1),-webkit-transform .8s cubic-bezier(.23,1,.32,1)}.mu-checkbox input[type=checkbox]:checked+.mu-checkbox-wrapper .mu-checkbox-ripple-wrapper{color:#7e57c2}.mu-checkbox *{pointer-events:none}.mu-checkbox.disabled{cursor:not-allowed}.mu-checkbox-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:24px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-checkbox-icon{width:24px;height:24px;vertical-align:middle;position:relative;margin-right:16px}.mu-checkbox.label-left .mu-checkbox-icon{margin-right:0;margin-left:16px}.mu-checkbox.no-label .mu-checkbox-icon{margin-left:0;margin-right:0}.mu-checkbox-label{color:rgba(0,0,0,.87)}.mu-checkbox.disabled .mu-checkbox-label{color:rgba(0,0,0,.38)}.mu-checkbox-svg-icon{display:inline-block;fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-checkbox-icon-uncheck{position:absolute;left:0;top:0;opacity:1;-webkit-transition:opacity 1s cubic-bezier(.23,1,.32,1) .2s;transition:opacity 1s cubic-bezier(.23,1,.32,1) .2s;color:rgba(0,0,0,.87)}.mu-checkbox.disabled .mu-checkbox-icon-uncheck{color:rgba(0,0,0,.38)}.mu-checkbox-icon-checked{position:absolute;left:0;top:0;opacity:0;color:#7e57c2;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform 0ms cubic-bezier(.23,1,.32,1) .45s;transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform 0ms cubic-bezier(.23,1,.32,1) .45s;transition:opacity .45s cubic-bezier(.23,1,.32,1),transform 0ms cubic-bezier(.23,1,.32,1) .45s;transition:opacity .45s cubic-bezier(.23,1,.32,1),transform 0ms cubic-bezier(.23,1,.32,1) .45s,-webkit-transform 0ms cubic-bezier(.23,1,.32,1) .45s}.mu-checkbox.disabled .mu-checkbox-icon-checked{color:rgba(0,0,0,.38)}.mu-checkbox-ripple-wrapper{width:48px;height:48px;top:-12px;left:-12px}.mu-checkbox.label-left .mu-checkbox-ripple-wrapper{right:-12px;left:auto}.mu-radio{position:relative;display:inline-block;height:24px;line-height:24px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-radio input[type=radio]{display:none}.mu-radio input[type=radio]:checked+.mu-radio-wrapper .mu-radio-icon-uncheck{opacity:0;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);color:#7e57c2}.mu-radio input[type=radio]:checked+.mu-radio-wrapper .mu-radio-icon-checked{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}.mu-radio input[type=radio]:checked+.mu-radio-wrapper .mu-radio-ripple-wrapper{color:#7e57c2}.mu-radio *{pointer-events:none}.mu-radio.disabled{cursor:not-allowed}.mu-radio-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:24px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-radio-icon{width:24px;height:24px;vertical-align:middle;position:relative;margin-right:16px}.mu-radio.label-left .mu-radio-icon{margin-right:0;margin-left:16px}.mu-radio.no-label .mu-radio-icon{margin-left:0;margin-right:0}.mu-radio-label{color:rgba(0,0,0,.87);-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;font-size:16px}.mu-radio.disabled .mu-radio-label{color:rgba(0,0,0,.38)}.mu-radio-svg-icon{display:inline-block;fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-radio-icon-uncheck{position:absolute;left:0;top:0;opacity:1;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.87)}.mu-radio.disabled .mu-radio-icon-uncheck{color:rgba(0,0,0,.38)}.mu-radio-icon-checked{position:absolute;left:0;top:0;opacity:0;color:#7e57c2;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-radio.disabled .mu-radio-icon-checked{color:rgba(0,0,0,.38)}.mu-radio-ripple-wrapper{width:48px;height:48px;top:-12px;left:-12px}.mu-radio.label-left .mu-radio-ripple-wrapper{right:-12px;left:auto}.mu-switch{position:relative;display:inline-block;height:24px;line-height:24px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-switch input[type=checkbox]{display:none}.mu-switch input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-track{background-color:rgba(126,87,194,.5)}.mu-switch input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-thumb{background-color:#7e57c2;color:#7e57c2;-webkit-transform:translate3d(18px,0,0);transform:translate3d(18px,0,0)}.mu-switch.disabled input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-track{background-color:#bdbdbd}.mu-switch.disabled input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-thumb{background-color:#e0e0e0}.mu-switch *{pointer-events:none}.mu-switch.disabled{cursor:not-allowed}.mu-switch-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:24px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-switch-container{width:38px;padding:4px 0 4px 2px;position:relative;margin-right:8px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-switch.label-left .mu-switch-container{margin-right:0;margin-left:8px}.mu-switch.no-label .mu-switch-container{margin-left:0;margin-right:0}.mu-switch-label{color:rgba(0,0,0,.87)}.mu-switch.disabled .mu-switch-label{color:rgba(0,0,0,.38)}.mu-switch-track{width:100%;height:14px;border-radius:30px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-switch-track,.mu-switch.disabled .mu-switch-track{background-color:#bdbdbd}.mu-switch-thumb{position:absolute;top:1px;left:0;width:20px;height:20px;line-height:24px;color:rgba(0,0,0,.87);background-color:#f5f5f5;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-switch.disabled .mu-switch-thumb{background-color:#e0e0e0}.mu-switch-ripple-wrapper{height:200%;width:200%;top:-10px;left:-10px}.mu-slider{width:100%;position:relative;height:24px;margin-bottom:16px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none}.mu-slider-track{right:0;background-color:#bdbdbd}.mu-slider-fill,.mu-slider-track{position:absolute;height:2px;left:0;top:50%;margin-top:-1px}.mu-slider-fill{width:100%;background-color:#7e57c2}.mu-slider.disabled .mu-slider-fill{background-color:#bdbdbd}.mu-slider-thumb{position:absolute;top:50%;width:12px;height:12px;background-color:#7e57c2;color:#7e57c2;border-radius:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transition:background .45s cubic-bezier(.23,1,.32,1),border-color .45s cubic-bezier(.23,1,.32,1),width .45s cubic-bezier(.23,1,.32,1),height .45s cubic-bezier(.23,1,.32,1);transition:background .45s cubic-bezier(.23,1,.32,1),border-color .45s cubic-bezier(.23,1,.32,1),width .45s cubic-bezier(.23,1,.32,1),height .45s cubic-bezier(.23,1,.32,1);cursor:pointer}.mu-slider.active .mu-slider-thumb{width:20px;height:20px}.mu-slider.disabled .mu-slider-thumb,.mu-slider.zero .mu-slider-thumb{border:2px solid #bdbdbd;color:#bdbdbd;background-color:#fff}.mu-slider.disabled .mu-slider-thumb .mu-focus-ripple-wrapper,.mu-slider.zero .mu-slider-thumb .mu-focus-ripple-wrapper{top:-14px;left:-14px}.mu-slider.disabled .mu-slider-thumb{cursor:default}.mu-slider-thumb .mu-focus-ripple-wrapper{width:36px;height:36px;top:-12px;left:-12px}.mu-linear-progress{position:relative;height:4px;display:block;width:100%;background-color:#bdbdbd;border-radius:2px;margin:0;overflow:hidden}.mu-linear-progress-indeterminate{width:40%;-webkit-animation:f .84s cubic-bezier(.445,.05,.55,.95);animation:f .84s cubic-bezier(.445,.05,.55,.95);-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.mu-linear-progress-determinate,.mu-linear-progress-indeterminate{position:absolute;top:0;bottom:0;border-radius:2px;background-color:#7e57c2}.mu-linear-progress-determinate{left:0;-webkit-transition:width .3s linear;transition:width .3s linear}@-webkit-keyframes f{0%{left:-40%}to{left:100%}}@keyframes f{0%{left:-40%}to{left:100%}}.mu-circular-progress{display:inline-block;position:relative;overflow:hidden}.mu-circular-progress-determinate{position:relative}.mu-circular-progress-determinate-path{stroke:#7e57c2;stroke-linecap:round;-webkit-transition:all .3s linear;transition:all .3s linear}.mu-grid-list{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.mu-grid-tile{position:relative;display:block;height:100%;overflow:hidden}.mu-grid-tile>img{height:100%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);position:relative;left:50%}.mu-grid-tile-titlebar{position:absolute;left:0;right:0;bottom:0;height:48px;background-color:rgba(0,0,0,.4);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-grid-tile.multiline .mu-grid-tile-titlebar{height:68px}.mu-grid-tile.top .mu-grid-tile-titlebar{bottom:auto;top:0}.mu-grid-tile-title-container{margin-left:16px;margin-right:0;color:#fff;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;overflow:hidden}.mu-grid-tile.action-left .mu-grid-tile-title-container{margin-right:16px;margin-left:0}.mu-grid-tile-action{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}.mu-grid-tile.action-left .mu-grid-tile-action{-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.mu-grid-tile-action .mu-icon{color:#fff}.mu-grid-tile-title{font-size:16px}.mu-grid-tile-subtitle,.mu-grid-tile-title{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;word-wrap:break-word}.mu-grid-tile-subtitle{font-size:12px}.mu-table{background-color:#fff;padding:0 24px;width:100%;border-collapse:collapse;border-spacing:0;table-layout:fixed}.mu-thead,.mu-tr{border-bottom:1px solid rgba(0,0,0,.12)}.mu-tr{color:rgba(0,0,0,.87);height:48px}.mu-tr:last-child{border-bottom:none}.mu-tr.selected{background-color:#f5f5f5}.mu-tr.hover{background-color:#eee}.mu-tr.stripe{background-color:hsla(0,0%,100%,.4)}.mu-tfoot .mu-tr{border-top:1px solid rgba(0,0,0,.12)}.mu-tr .mu-checkbox{vertical-align:middle}.mu-checkbox-col{width:72px}.mu-td{height:48px;font-size:13px;white-space:nowrap;text-overflow:ellipsis}.mu-td,.mu-th{padding-left:24px;padding-right:24px;text-align:left}.mu-th{font-weight:400;font-size:12px;height:56px;color:rgba(0,0,0,.54);position:relative}.mu-th-wrapper{position:relative;padding-top:12px;padding-bottom:12px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mu-date-picker{display:inline-block;position:relative;width:256px}.mu-date-picker.fullWidth{width:100%}.mu-date-picker-dialog{width:310px}.mu-date-picker-dialog.landscape{width:479px}.mu-date-picker-dialog.landscape .mu-dialog-body{min-height:330px;min-width:479px}.mu-date-picker-dialog .mu-dialog-body{padding:0;min-height:434px;min-width:310px}.mu-calendar{color:rgba(0,0,0,.87);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:310px}.mu-calendar-landspace{width:479px}.mu-calendar-container{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.mu-calendar-container,.mu-calendar-monthday-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal}.mu-calendar-monthday-container{-webkit-align-content:space-between;-ms-flex-line-pack:justify;align-content:space-between;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;font-size:12px;font-weight:400;padding:0 8px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-calendar-monthday-container,.mu-calendar-week{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-calendar-week{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;font-weight:500;height:20px;line-height:15px;opacity:.5;text-align:center}.mu-calendar-week-day{width:42px}.mu-calendar-monthday{position:relative;overflow:hidden;height:214px}.mu-calendar-monthday-slide{height:100%;width:100%}.mu-calendar-actions{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;margin:0;max-height:48px;padding:0}.mu-calendar-actions .mu-flat-button{min-width:64px;margin:4px 8px 8px 0}.mu-calendar-slide-next-enter-active,.mu-calendar-slide-next-leave-active,.mu-calendar-slide-prev-enter-active,.mu-calendar-slide-prev-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden;position:absolute;left:0;right:0;top:0}.mu-calendar-slide-next-enter{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.mu-calendar-slide-next-leave-active{opacity:0}.mu-calendar-slide-next-leave-active,.mu-calendar-slide-prev-enter{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.mu-calendar-slide-prev-leave-active{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);opacity:0}.mu-date-display{width:100%;font-weight:700;display:block;background-color:#7e57c2;border-top-left-radius:2px;border-top-right-radius:2px;border-bottom-left-radius:0;color:#fff;padding:20px}.mu-calendar-landspace .mu-date-display{width:165px;height:330px;float:left;border-top-right-radius:0;border-bottom-left-radius:2px}.mu-date-display-year{position:relative;overflow:hidden;margin:0;font-size:16px;font-weight:500;line-height:16px;height:16px;opacity:.7;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);margin-bottom:10px}.mu-date-display.selected-year .mu-date-display-year{opacity:1}.mu-date-display-year-title{cursor:pointer}.mu-date-display-year.disabled .mu-date-display-year-title{cursor:not-allowed}.mu-date-display-year-title .mu-date-display.selected-year{cursor:default}.mu-date-display-monthday{position:relative;display:block;overflow:hidden;font-size:36px;line-height:36px;height:38px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);width:100%;font-weight:500}.mu-date-display.selected-year .mu-date-display-monthday{opacity:.7}.mu-calendar-landspace .mu-date-display-monthday{height:100%}.mu-date-display-slideIn-wrapper{position:absolute;height:100%;width:100%;top:0;left:0}.mu-date-display-monthday-title{cursor:default;width:100%;display:block}.mu-date-display.selected-year .mu-date-display-monthday-title{cursor:pointer}.mu-date-display-next-enter-active,.mu-date-display-next-leave-active,.mu-date-display-prev-enter-active,.mu-date-display-prev-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-date-display-next-enter{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);opacity:0}.mu-date-display-next-leave-active,.mu-date-display-prev-enter{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0}.mu-date-display-prev-leave-active{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);opacity:0}.mu-calendar-toolbar{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;height:48px}.mu-calendar-toolbar-title-wrapper{position:relative;overflow:hidden;height:100%;font-size:14px;font-weight:500;text-align:center;width:100%}.mu-calendar-toolbar-title{position:absolute;height:100%;width:100%;top:0;left:0;line-height:48px}.mu-calendar-svg-icon{display:block;fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-calendar-monthday-content{-webkit-box-orient:vertical;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;font-weight:400;height:228px;line-height:2;position:relative;text-align:center}.mu-calendar-monthday-content,.mu-calendar-monthday-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-direction:normal}.mu-calendar-monthday-row{-webkit-box-orient:horizontal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;height:34px;margin-bottom:2px}.mu-day-button{display:inline-block;background:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;text-decoration:none;cursor:pointer;margin:0;padding:4px 0;font-size:inherit;font-weight:400;position:relative;border:10px;width:42px}.mu-day-button.disabled{opacity:.4}.mu-day-empty{font-weight:400;padding:4px 0;position:relative;width:42px}.mu-day-button-bg{position:absolute;top:0;left:4px;height:34px;background-color:#7e57c2;border-radius:50%;opacity:0;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);width:34px}.mu-day-button.hover .mu-day-button-bg,.mu-day-button.selected .mu-day-button-bg{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}.mu-day-button.hover .mu-day-button-bg{opacity:.6}.mu-day-button.selected .mu-day-button-bg{opacity:1}.mu-day-button-text{font-weight:400;position:relative;color:rgba(0,0,0,.87)}.mu-day-button.now .mu-day-button-text{color:#7e57c2}.mu-day-button.hover .mu-day-button-text,.mu-day-button.selected .mu-day-button-text{color:#fff}.mu-calendar-year-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;margin-top:10px;width:310px;height:272px;overflow:hidden}.mu-calendar-year{background-color:#fff;height:inherit;line-height:35px;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;position:relative}.mu-calendar-year-list{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;min-height:100%}.mu-year-button{position:relative;display:block;background:none;cursor:pointer;outline:none;text-decoration:none;margin:0 auto;padding:0;border:10px;font-size:14px;font-weight:inherit;text-align:center;line-height:inherit}.mu-year-button-text{-webkit-align-self:center;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center;color:rgba(0,0,0,.87);font-size:17px;font-weight:400;position:relative;top:-1px}.mu-year-button.selected .mu-year-button-text{color:#7e57c2;font-size:26px;font-weight:500}.mu-year-button.hover .mu-year-button-text{color:#7e57c2}.mu-time-picker{display:inline-block;position:relative;width:256px}.mu-time-picker.fullWidth{width:100%}.mu-time-picker-dialog{width:280px}.mu-time-picker-dialog.landscape{width:479px}.mu-time-picker-dialog.landscape .mu-dialog-body{min-height:352px;min-width:479px}.mu-time-picker-dialog .mu-dialog-body{padding:0;min-height:450px;min-width:280px}.mu-clock{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:280px}.mu-clock-landspace{width:479px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-clock-container{height:280px;padding:10px;box-sizing:content-box;position:relative;padding-bottom:62px}.mu-clock-landspace .mu-clock-container{width:300px}.mu-clock-circle{position:absolute;top:20px;width:260px;height:260px;border-radius:100%;background-color:rgba(0,0,0,.07)}.mu-clock-landspace .mu-clock-circle{left:50%;margin-left:-130px}.mu-clock-actions{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;padding:8px;position:absolute;left:0;bottom:0;right:0}.mu-time-display{padding:14px 0;border-top-left-radius:2px;border-top-right-radius:2px;background-color:#7e57c2;color:#fff}.mu-clock-landspace .mu-time-display{width:179px;position:relative}.mu-time-display-text{margin:6px 0;line-height:58px;height:58px;font-size:58px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:baseline;-webkit-align-items:baseline;-ms-flex-align:baseline;align-items:baseline}.mu-clock-landspace .mu-time-display-text,.mu-time-display-text{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.mu-clock-landspace .mu-time-display-text{margin:0;position:absolute;left:0;right:0;top:0;bottom:0;height:auto;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;font-size:48px}.mu-time-display-affix{-webkit-box-flex:1;-webkit-flex:1 1;-ms-flex:1 1;flex:1 1;position:relative;line-height:17px;height:17px;font-size:17px}.mu-clock-landspace .mu-time-display-affix{-webkit-box-flex:0;-webkit-flex:none;-ms-flex:none;flex:none;height:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.mu-time-display-time{margin:0 10px}.mu-clock-landspace .mu-time-display-time{margin-top:-28px}.mu-time-display-clickable{cursor:pointer}.mu-time-display-clickable.inactive{opacity:.7}.mu-clock-landspace .mu-time-display-clickable{margin-top:8px}.mu-time-display-affix-top{position:absolute;top:-20px;left:0}.mu-clock-landspace .mu-time-display-affix-top{position:static;-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.mu-clock-hours{height:100%;width:100%;border-radius:100%;position:relative;pointer-events:none;box-sizing:border-box}.mu-clock-hours-mask{height:100%;width:100%;pointer-events:auto}.mu-clock-number{display:inline-block;width:32px;height:32px;line-height:24px;position:absolute;top:10px;text-align:center;padding-top:5px;font-size:1.1em;pointer-events:none;border-radius:100%;box-sizing:border-box;-webkit-transform:translateY(5px);-ms-transform:translateY(5px);transform:translateY(5px);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-clock-number.selected{background-color:#7e57c2;color:#fff}.mu-clock-number.inner{width:28px;height:28px}.mu-clock-pointer{height:40%;background-color:#7e57c2;width:2px;left:49%;position:absolute;bottom:50%;-webkit-transform-origin:center bottom 0;-ms-transform-origin:center bottom 0;transform-origin:center bottom 0;pointer-events:none}.mu-clock-pointer.inner{height:30%}.mu-clock-pointer-mark{box-sizing:content-box;background-color:#fff;border:4px solid #7e57c2;width:7px;height:7px;position:absolute;top:-5px;left:-6px;border-radius:100%}.mu-clock-pointer-mark.has-selected{display:none}.mu-clock-minutes{height:100%;width:100%;border-radius:100%;position:relative;pointer-events:none;box-sizing:border-box}.mu-clock-minutes-mask{height:100%;width:100%;pointer-events:auto}.mu-step{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;margin-left:-6px}.mu-stepper-vertical .mu-step{margin-top:-14px;margin-left:0}.mu-step:first-child{margin-left:0}.mu-step-button{border:10px;display:inline-block;cursor:pointer;text-decoration:none;margin:0;padding:0;outline:none;font-size:inherit;font-weight:inherit;-webkit-transform:translate(0);-ms-transform:translate(0);transform:translate(0);background-color:transparent;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1) 0ms;transition:all .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-stepper-vertical .mu-step-button{width:100%}.mu-step-button.hover{background-color:rgba(0,0,0,.06)}.mu-step-label{height:72px;color:rgba(0,0,0,.87);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:14px;padding-left:14px;padding-right:14px}.mu-stepper-vertical .mu-step-label{height:64px}.mu-step-label.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-step-label.active{font-weight:500}.mu-step-label-icon-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin-right:8px;width:24px}.mu-step-label-icon{display:block;font-size:24px;width:24px;height:24px;color:#9e9e9e;fill:currentColor}.mu-step-label.disabled .mu-step-label-icon{color:#9e9e9e}.mu-step-label.active .mu-step-label-icon,.mu-step-label.completed .mu-step-label-icon{color:#7e57c2}.mu-step-label-circle{width:20px;height:20px;font-size:12px;line-height:20px;text-align:center;overflow:hidden;border-radius:100%;color:#fff}.mu-step-label-circle,.mu-step-label.disabled .mu-step-label-circle{background-color:#9e9e9e}.mu-step-label.active .mu-step-label-circle,.mu-step-label.completed .mu-step-label-circle{background-color:#7e57c2}.mu-step-content{margin-top:-14px;margin-left:25px;padding-left:21px;padding-right:16px;overflow:hidden}.mu-stepper-vertical .mu-step-content{border-left:1px solid #bdbdbd}.mu-step-content.last{border-left:none}.mu-step-content-inner{position:relative;width:100%;top:0;left:0;overflow:hidden}.mu-stepper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-content:center;-ms-flex-line-pack:center;align-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-stepper-vertical{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch}.mu-step-connector{-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}.mu-stepper-vertical .mu-step-connector{margin-left:25px}.mu-step-connector-line{display:block;border-color:#bdbdbd;margin-left:-6px;border-top-style:solid;border-top-width:1px}.mu-stepper-vertical .mu-step-connector-line{border-top:none;border-left-style:solid;border-left-width:1px;min-height:28px;margin-left:0}.mu-auto-complete{display:inline-block;position:relative;width:256px}.mu-auto-complete.fullWidth{width:100%}.mu-auto-complete-menu-item{width:100%;overflow:hidden}.mu-pagination{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-pagination-svg-icon{display:inline-block;width:24px;height:24px;fill:currentColor;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-pagination-item,.mu-pagination-svg-icon{-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-pagination-item{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:16px;height:32px;min-width:32px;padding-left:8px;padding-right:8px;line-height:32px;margin:0 8px;color:rgba(0,0,0,.87);position:relative;cursor:pointer;border-radius:2px}.mu-pagination-item.hover{background-color:rgba(0,0,0,.1)}.mu-pagination-item.active{color:#fff;background-color:#7e57c2}.mu-pagination-item.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-pagination-item.circle,.mu-pagination-item.circle .mu-ripple-wrapper{border-radius:50%}.mu-pagination-item-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:100%;width:100%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.row{display:flex;justify-content:space-between;flex-wrap:wrap;align-items:flex-start}.row>[class*=col-]{box-sizing:border-box}@media (max-width:600px){.row .col-auto{width:100%}.row .col-100{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .col-100{width:100%}.row .col-95{width:95%;width:calc((100% - 16px*0.05263157894736836) / 1.0526315789473684)}.row.no-gutter .col-95{width:95%}.row .col-90{width:90%;width:calc((100% - 16px*0.11111111111111116) / 1.1111111111111112)}.row.no-gutter .col-90{width:90%}.row .col-85{width:85%;width:calc((100% - 16px*0.17647058823529416) / 1.1764705882352942)}.row.no-gutter .col-85{width:85%}.row .col-80{width:80%;width:calc((100% - 16px*0.25) / 1.25)}.row.no-gutter .col-80{width:80%}.row .col-75{width:75%;width:calc((100% - 16px*0.33333333333333326) / 1.3333333333333333)}.row.no-gutter .col-75{width:75%}.row .col-70{width:70%;width:calc((100% - 16px*0.4285714285714286) / 1.4285714285714286)}.row.no-gutter .col-70{width:70%}.row .col-66{width:66.66666666666666%;width:calc((100% - 16px*0.5000000000000002) / 1.5000000000000002)}.row.no-gutter .col-66{width:66.66666666666666%}.row .col-65{width:65%;width:calc((100% - 16px*0.5384615384615385) / 1.5384615384615385)}.row.no-gutter .col-65{width:65%}.row .col-60{width:60%;width:calc((100% - 16px*0.6666666666666667) / 1.6666666666666667)}.row.no-gutter .col-60{width:60%}.row .col-55{width:55%;width:calc((100% - 16px*0.8181818181818181) / 1.8181818181818181)}.row.no-gutter .col-55{width:55%}.row .col-50{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .col-50{width:50%}.row .col-45{width:45%;width:calc((100% - 16px*1.2222222222222223) / 2.2222222222222223)}.row.no-gutter .col-45{width:45%}.row .col-40{width:40%;width:calc((100% - 16px*1.5) / 2.5)}.row.no-gutter .col-40{width:40%}.row .col-35{width:35%;width:calc((100% - 16px*1.8571428571428572) / 2.857142857142857)}.row.no-gutter .col-35{width:35%}.row .col-33{width:33.333333333333336%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .col-33{width:33.333333333333336%}.row .col-30{width:30%;width:calc((100% - 16px*2.3333333333333335) / 3.3333333333333335)}.row.no-gutter .col-30{width:30%}.row .col-25{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .col-25{width:25%}.row .col-20{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .col-20{width:20%}.row .col-15{width:15%;width:calc((100% - 16px*5.666666666666667) / 6.666666666666667)}.row.no-gutter .col-15{width:15%}.row .col-10{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .col-10{width:10%}.row .col-5{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .col-5{width:5%}.row .col-auto:last-child,.row .col-auto:last-child~.col-auto{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .col-auto:last-child,.row.no-gutter .col-auto:last-child~.col-auto{width:100%}.row .col-auto:nth-last-child(2),.row .col-auto:nth-last-child(2)~.col-auto{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .col-auto:nth-last-child(2),.row.no-gutter .col-auto:nth-last-child(2)~.col-auto{width:50%}.row .col-auto:nth-last-child(3),.row .col-auto:nth-last-child(3)~.col-auto{width:33.33333333%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .col-auto:nth-last-child(3),.row.no-gutter .col-auto:nth-last-child(3)~.col-auto{width:33.33333333%}.row .col-auto:nth-last-child(4),.row .col-auto:nth-last-child(4)~.col-auto{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .col-auto:nth-last-child(4),.row.no-gutter .col-auto:nth-last-child(4)~.col-auto{width:25%}.row .col-auto:nth-last-child(5),.row .col-auto:nth-last-child(5)~.col-auto{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .col-auto:nth-last-child(5),.row.no-gutter .col-auto:nth-last-child(5)~.col-auto{width:20%}.row .col-auto:nth-last-child(6),.row .col-auto:nth-last-child(6)~.col-auto{width:16.66666667%;width:calc((100% - 16px*5) / 6)}.row.no-gutter .col-auto:nth-last-child(6),.row.no-gutter .col-auto:nth-last-child(6)~.col-auto{width:16.66666667%}.row .col-auto:nth-last-child(7),.row .col-auto:nth-last-child(7)~.col-auto{width:14.28571429%;width:calc((100% - 16px*6) / 7)}.row.no-gutter .col-auto:nth-last-child(7),.row.no-gutter .col-auto:nth-last-child(7)~.col-auto{width:14.28571429%}.row .col-auto:nth-last-child(8),.row .col-auto:nth-last-child(8)~.col-auto{width:12.5%;width:calc((100% - 16px*7) / 8)}.row.no-gutter .col-auto:nth-last-child(8),.row.no-gutter .col-auto:nth-last-child(8)~.col-auto{width:12.5%}.row .col-auto:nth-last-child(9),.row .col-auto:nth-last-child(9)~.col-auto{width:11.11111111%;width:calc((100% - 16px*8) / 9)}.row.no-gutter .col-auto:nth-last-child(9),.row.no-gutter .col-auto:nth-last-child(9)~.col-auto{width:11.11111111%}.row .col-auto:nth-last-child(10),.row .col-auto:nth-last-child(10)~.col-auto{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .col-auto:nth-last-child(10),.row.no-gutter .col-auto:nth-last-child(10)~.col-auto{width:10%}.row .col-auto:nth-last-child(11),.row .col-auto:nth-last-child(11)~.col-auto{width:9.09090909%;width:calc((100% - 16px*10) / 11)}.row.no-gutter .col-auto:nth-last-child(11),.row.no-gutter .col-auto:nth-last-child(11)~.col-auto{width:9.09090909%}.row .col-auto:nth-last-child(12),.row .col-auto:nth-last-child(12)~.col-auto{width:8.33333333%;width:calc((100% - 16px*11) / 12)}.row.no-gutter .col-auto:nth-last-child(12),.row.no-gutter .col-auto:nth-last-child(12)~.col-auto{width:8.33333333%}.row .col-auto:nth-last-child(13),.row .col-auto:nth-last-child(13)~.col-auto{width:7.69230769%;width:calc((100% - 16px*12) / 13)}.row.no-gutter .col-auto:nth-last-child(13),.row.no-gutter .col-auto:nth-last-child(13)~.col-auto{width:7.69230769%}.row .col-auto:nth-last-child(14),.row .col-auto:nth-last-child(14)~.col-auto{width:7.14285714%;width:calc((100% - 16px*13) / 14)}.row.no-gutter .col-auto:nth-last-child(14),.row.no-gutter .col-auto:nth-last-child(14)~.col-auto{width:7.14285714%}.row .col-auto:nth-last-child(15),.row .col-auto:nth-last-child(15)~.col-auto{width:6.66666667%;width:calc((100% - 16px*14) / 15)}.row.no-gutter .col-auto:nth-last-child(15),.row.no-gutter .col-auto:nth-last-child(15)~.col-auto{width:6.66666667%}.row .col-auto:nth-last-child(16),.row .col-auto:nth-last-child(16)~.col-auto{width:6.25%;width:calc((100% - 16px*15) / 16)}.row.no-gutter .col-auto:nth-last-child(16),.row.no-gutter .col-auto:nth-last-child(16)~.col-auto{width:6.25%}.row .col-auto:nth-last-child(17),.row .col-auto:nth-last-child(17)~.col-auto{width:5.88235294%;width:calc((100% - 16px*16) / 17)}.row.no-gutter .col-auto:nth-last-child(17),.row.no-gutter .col-auto:nth-last-child(17)~.col-auto{width:5.88235294%}.row .col-auto:nth-last-child(18),.row .col-auto:nth-last-child(18)~.col-auto{width:5.55555556%;width:calc((100% - 16px*17) / 18)}.row.no-gutter .col-auto:nth-last-child(18),.row.no-gutter .col-auto:nth-last-child(18)~.col-auto{width:5.55555556%}.row .col-auto:nth-last-child(19),.row .col-auto:nth-last-child(19)~.col-auto{width:5.26315789%;width:calc((100% - 16px*18) / 19)}.row.no-gutter .col-auto:nth-last-child(19),.row.no-gutter .col-auto:nth-last-child(19)~.col-auto{width:5.26315789%}.row .col-auto:nth-last-child(20),.row .col-auto:nth-last-child(20)~.col-auto{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .col-auto:nth-last-child(20),.row.no-gutter .col-auto:nth-last-child(20)~.col-auto{width:5%}.row .col-auto:nth-last-child(21),.row .col-auto:nth-last-child(21)~.col-auto{width:4.76190476%;width:calc((100% - 16px*20) / 21)}.row.no-gutter .col-auto:nth-last-child(21),.row.no-gutter .col-auto:nth-last-child(21)~.col-auto{width:4.76190476%}}@media (max-width:992px) and (min-width:601px){.row .tablet-100{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .tablet-100{width:100%}.row .tablet-95{width:95%;width:calc((100% - 16px*0.05263157894736836) / 1.0526315789473684)}.row.no-gutter .tablet-95{width:95%}.row .tablet-90{width:90%;width:calc((100% - 16px*0.11111111111111116) / 1.1111111111111112)}.row.no-gutter .tablet-90{width:90%}.row .tablet-85{width:85%;width:calc((100% - 16px*0.17647058823529416) / 1.1764705882352942)}.row.no-gutter .tablet-85{width:85%}.row .tablet-80{width:80%;width:calc((100% - 16px*0.25) / 1.25)}.row.no-gutter .tablet-80{width:80%}.row .tablet-75{width:75%;width:calc((100% - 16px*0.33333333333333326) / 1.3333333333333333)}.row.no-gutter .tablet-75{width:75%}.row .tablet-70{width:70%;width:calc((100% - 16px*0.4285714285714286) / 1.4285714285714286)}.row.no-gutter .tablet-70{width:70%}.row .tablet-66{width:66.66666666666666%;width:calc((100% - 16px*0.5000000000000002) / 1.5000000000000002)}.row.no-gutter .tablet-66{width:66.66666666666666%}.row .tablet-65{width:65%;width:calc((100% - 16px*0.5384615384615385) / 1.5384615384615385)}.row.no-gutter .tablet-65{width:65%}.row .tablet-60{width:60%;width:calc((100% - 16px*0.6666666666666667) / 1.6666666666666667)}.row.no-gutter .tablet-60{width:60%}.row .tablet-55{width:55%;width:calc((100% - 16px*0.8181818181818181) / 1.8181818181818181)}.row.no-gutter .tablet-55{width:55%}.row .tablet-50{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .tablet-50{width:50%}.row .tablet-45{width:45%;width:calc((100% - 16px*1.2222222222222223) / 2.2222222222222223)}.row.no-gutter .tablet-45{width:45%}.row .tablet-40{width:40%;width:calc((100% - 16px*1.5) / 2.5)}.row.no-gutter .tablet-40{width:40%}.row .tablet-35{width:35%;width:calc((100% - 16px*1.8571428571428572) / 2.857142857142857)}.row.no-gutter .tablet-35{width:35%}.row .tablet-33{width:33.333333333333336%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .tablet-33{width:33.333333333333336%}.row .tablet-30{width:30%;width:calc((100% - 16px*2.3333333333333335) / 3.3333333333333335)}.row.no-gutter .tablet-30{width:30%}.row .tablet-25{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .tablet-25{width:25%}.row .tablet-20{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .tablet-20{width:20%}.row .tablet-15{width:15%;width:calc((100% - 16px*5.666666666666667) / 6.666666666666667)}.row.no-gutter .tablet-15{width:15%}.row .tablet-10{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .tablet-10{width:10%}.row .tablet-5{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .tablet-5{width:5%}.row .tablet-auto:last-child,.row .tablet-auto:last-child~.col-auto{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .tablet-auto:last-child,.row.no-gutter .tablet-auto:last-child~.tablet-auto{width:100%}.row .tablet-auto:nth-last-child(2),.row .tablet-auto:nth-last-child(2)~.col-auto{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .tablet-auto:nth-last-child(2),.row.no-gutter .tablet-auto:nth-last-child(2)~.tablet-auto{width:50%}.row .tablet-auto:nth-last-child(3),.row .tablet-auto:nth-last-child(3)~.col-auto{width:33.33333333%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .tablet-auto:nth-last-child(3),.row.no-gutter .tablet-auto:nth-last-child(3)~.tablet-auto{width:33.33333333%}.row .tablet-auto:nth-last-child(4),.row .tablet-auto:nth-last-child(4)~.col-auto{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .tablet-auto:nth-last-child(4),.row.no-gutter .tablet-auto:nth-last-child(4)~.tablet-auto{width:25%}.row .tablet-auto:nth-last-child(5),.row .tablet-auto:nth-last-child(5)~.col-auto{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .tablet-auto:nth-last-child(5),.row.no-gutter .tablet-auto:nth-last-child(5)~.tablet-auto{width:20%}.row .tablet-auto:nth-last-child(6),.row .tablet-auto:nth-last-child(6)~.col-auto{width:16.66666667%;width:calc((100% - 16px*5) / 6)}.row.no-gutter .tablet-auto:nth-last-child(6),.row.no-gutter .tablet-auto:nth-last-child(6)~.tablet-auto{width:16.66666667%}.row .tablet-auto:nth-last-child(7),.row .tablet-auto:nth-last-child(7)~.col-auto{width:14.28571429%;width:calc((100% - 16px*6) / 7)}.row.no-gutter .tablet-auto:nth-last-child(7),.row.no-gutter .tablet-auto:nth-last-child(7)~.tablet-auto{width:14.28571429%}.row .tablet-auto:nth-last-child(8),.row .tablet-auto:nth-last-child(8)~.col-auto{width:12.5%;width:calc((100% - 16px*7) / 8)}.row.no-gutter .tablet-auto:nth-last-child(8),.row.no-gutter .tablet-auto:nth-last-child(8)~.tablet-auto{width:12.5%}.row .tablet-auto:nth-last-child(9),.row .tablet-auto:nth-last-child(9)~.col-auto{width:11.11111111%;width:calc((100% - 16px*8) / 9)}.row.no-gutter .tablet-auto:nth-last-child(9),.row.no-gutter .tablet-auto:nth-last-child(9)~.tablet-auto{width:11.11111111%}.row .tablet-auto:nth-last-child(10),.row .tablet-auto:nth-last-child(10)~.col-auto{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .tablet-auto:nth-last-child(10),.row.no-gutter .tablet-auto:nth-last-child(10)~.tablet-auto{width:10%}.row .tablet-auto:nth-last-child(11),.row .tablet-auto:nth-last-child(11)~.col-auto{width:9.09090909%;width:calc((100% - 16px*10) / 11)}.row.no-gutter .tablet-auto:nth-last-child(11),.row.no-gutter .tablet-auto:nth-last-child(11)~.tablet-auto{width:9.09090909%}.row .tablet-auto:nth-last-child(12),.row .tablet-auto:nth-last-child(12)~.col-auto{width:8.33333333%;width:calc((100% - 16px*11) / 12)}.row.no-gutter .tablet-auto:nth-last-child(12),.row.no-gutter .tablet-auto:nth-last-child(12)~.tablet-auto{width:8.33333333%}.row .tablet-auto:nth-last-child(13),.row .tablet-auto:nth-last-child(13)~.col-auto{width:7.69230769%;width:calc((100% - 16px*12) / 13)}.row.no-gutter .tablet-auto:nth-last-child(13),.row.no-gutter .tablet-auto:nth-last-child(13)~.tablet-auto{width:7.69230769%}.row .tablet-auto:nth-last-child(14),.row .tablet-auto:nth-last-child(14)~.col-auto{width:7.14285714%;width:calc((100% - 16px*13) / 14)}.row.no-gutter .tablet-auto:nth-last-child(14),.row.no-gutter .tablet-auto:nth-last-child(14)~.tablet-auto{width:7.14285714%}.row .tablet-auto:nth-last-child(15),.row .tablet-auto:nth-last-child(15)~.col-auto{width:6.66666667%;width:calc((100% - 16px*14) / 15)}.row.no-gutter .tablet-auto:nth-last-child(15),.row.no-gutter .tablet-auto:nth-last-child(15)~.tablet-auto{width:6.66666667%}.row .tablet-auto:nth-last-child(16),.row .tablet-auto:nth-last-child(16)~.col-auto{width:6.25%;width:calc((100% - 16px*15) / 16)}.row.no-gutter .tablet-auto:nth-last-child(16),.row.no-gutter .tablet-auto:nth-last-child(16)~.tablet-auto{width:6.25%}.row .tablet-auto:nth-last-child(17),.row .tablet-auto:nth-last-child(17)~.col-auto{width:5.88235294%;width:calc((100% - 16px*16) / 17)}.row.no-gutter .tablet-auto:nth-last-child(17),.row.no-gutter .tablet-auto:nth-last-child(17)~.tablet-auto{width:5.88235294%}.row .tablet-auto:nth-last-child(18),.row .tablet-auto:nth-last-child(18)~.col-auto{width:5.55555556%;width:calc((100% - 16px*17) / 18)}.row.no-gutter .tablet-auto:nth-last-child(18),.row.no-gutter .tablet-auto:nth-last-child(18)~.tablet-auto{width:5.55555556%}.row .tablet-auto:nth-last-child(19),.row .tablet-auto:nth-last-child(19)~.col-auto{width:5.26315789%;width:calc((100% - 16px*18) / 19)}.row.no-gutter .tablet-auto:nth-last-child(19),.row.no-gutter .tablet-auto:nth-last-child(19)~.tablet-auto{width:5.26315789%}.row .tablet-auto:nth-last-child(20),.row .tablet-auto:nth-last-child(20)~.col-auto{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .tablet-auto:nth-last-child(20),.row.no-gutter .tablet-auto:nth-last-child(20)~.tablet-auto{width:5%}.row .tablet-auto:nth-last-child(21),.row .tablet-auto:nth-last-child(21)~.col-auto{width:4.76190476%;width:calc((100% - 16px*20) / 21)}.row.no-gutter .tablet-auto:nth-last-child(21),.row.no-gutter .tablet-auto:nth-last-child(21)~.tablet-auto{width:4.76190476%}}@media (min-width:993px){.row .desktop-100{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .desktop-100{width:100%}.row .desktop-95{width:95%;width:calc((100% - 16px*0.05263157894736836) / 1.0526315789473684)}.row.no-gutter .desktop-95{width:95%}.row .desktop-90{width:90%;width:calc((100% - 16px*0.11111111111111116) / 1.1111111111111112)}.row.no-gutter .desktop-90{width:90%}.row .desktop-85{width:85%;width:calc((100% - 16px*0.17647058823529416) / 1.1764705882352942)}.row.no-gutter .desktop-85{width:85%}.row .desktop-80{width:80%;width:calc((100% - 16px*0.25) / 1.25)}.row.no-gutter .desktop-80{width:80%}.row .desktop-75{width:75%;width:calc((100% - 16px*0.33333333333333326) / 1.3333333333333333)}.row.no-gutter .desktop-75{width:75%}.row .desktop-70{width:70%;width:calc((100% - 16px*0.4285714285714286) / 1.4285714285714286)}.row.no-gutter .desktop-70{width:70%}.row .desktop-66{width:66.66666666666666%;width:calc((100% - 16px*0.5000000000000002) / 1.5000000000000002)}.row.no-gutter .desktop-66{width:66.66666666666666%}.row .desktop-65{width:65%;width:calc((100% - 16px*0.5384615384615385) / 1.5384615384615385)}.row.no-gutter .desktop-65{width:65%}.row .desktop-60{width:60%;width:calc((100% - 16px*0.6666666666666667) / 1.6666666666666667)}.row.no-gutter .desktop-60{width:60%}.row .desktop-55{width:55%;width:calc((100% - 16px*0.8181818181818181) / 1.8181818181818181)}.row.no-gutter .desktop-55{width:55%}.row .desktop-50{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .desktop-50{width:50%}.row .desktop-45{width:45%;width:calc((100% - 16px*1.2222222222222223) / 2.2222222222222223)}.row.no-gutter .desktop-45{width:45%}.row .desktop-40{width:40%;width:calc((100% - 16px*1.5) / 2.5)}.row.no-gutter .desktop-40{width:40%}.row .desktop-35{width:35%;width:calc((100% - 16px*1.8571428571428572) / 2.857142857142857)}.row.no-gutter .desktop-35{width:35%}.row .desktop-33{width:33.333333333333336%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .desktop-33{width:33.333333333333336%}.row .desktop-30{width:30%;width:calc((100% - 16px*2.3333333333333335) / 3.3333333333333335)}.row.no-gutter .desktop-30{width:30%}.row .desktop-25{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .desktop-25{width:25%}.row .desktop-20{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .desktop-20{width:20%}.row .desktop-15{width:15%;width:calc((100% - 16px*5.666666666666667) / 6.666666666666667)}.row.no-gutter .desktop-15{width:15%}.row .desktop-10{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .desktop-10{width:10%}.row .desktop-5{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .desktop-5{width:5%}.row .desktop-auto:last-child,.row .desktop-auto:last-child~.col-auto{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .desktop-auto:last-child,.row.no-gutter .desktop-auto:last-child~.desktop-auto{width:100%}.row .desktop-auto:nth-last-child(2),.row .desktop-auto:nth-last-child(2)~.col-auto{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .desktop-auto:nth-last-child(2),.row.no-gutter .desktop-auto:nth-last-child(2)~.desktop-auto{width:50%}.row .desktop-auto:nth-last-child(3),.row .desktop-auto:nth-last-child(3)~.col-auto{width:33.33333333%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .desktop-auto:nth-last-child(3),.row.no-gutter .desktop-auto:nth-last-child(3)~.desktop-auto{width:33.33333333%}.row .desktop-auto:nth-last-child(4),.row .desktop-auto:nth-last-child(4)~.col-auto{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .desktop-auto:nth-last-child(4),.row.no-gutter .desktop-auto:nth-last-child(4)~.desktop-auto{width:25%}.row .desktop-auto:nth-last-child(5),.row .desktop-auto:nth-last-child(5)~.col-auto{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .desktop-auto:nth-last-child(5),.row.no-gutter .desktop-auto:nth-last-child(5)~.desktop-auto{width:20%}.row .desktop-auto:nth-last-child(6),.row .desktop-auto:nth-last-child(6)~.col-auto{width:16.66666667%;width:calc((100% - 16px*5) / 6)}.row.no-gutter .desktop-auto:nth-last-child(6),.row.no-gutter .desktop-auto:nth-last-child(6)~.desktop-auto{width:16.66666667%}.row .desktop-auto:nth-last-child(7),.row .desktop-auto:nth-last-child(7)~.col-auto{width:14.28571429%;width:calc((100% - 16px*6) / 7)}.row.no-gutter .desktop-auto:nth-last-child(7),.row.no-gutter .desktop-auto:nth-last-child(7)~.desktop-auto{width:14.28571429%}.row .desktop-auto:nth-last-child(8),.row .desktop-auto:nth-last-child(8)~.col-auto{width:12.5%;width:calc((100% - 16px*7) / 8)}.row.no-gutter .desktop-auto:nth-last-child(8),.row.no-gutter .desktop-auto:nth-last-child(8)~.desktop-auto{width:12.5%}.row .desktop-auto:nth-last-child(9),.row .desktop-auto:nth-last-child(9)~.col-auto{width:11.11111111%;width:calc((100% - 16px*8) / 9)}.row.no-gutter .desktop-auto:nth-last-child(9),.row.no-gutter .desktop-auto:nth-last-child(9)~.desktop-auto{width:11.11111111%}.row .desktop-auto:nth-last-child(10),.row .desktop-auto:nth-last-child(10)~.col-auto{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .desktop-auto:nth-last-child(10),.row.no-gutter .desktop-auto:nth-last-child(10)~.desktop-auto{width:10%}.row .desktop-auto:nth-last-child(11),.row .desktop-auto:nth-last-child(11)~.col-auto{width:9.09090909%;width:calc((100% - 16px*10) / 11)}.row.no-gutter .desktop-auto:nth-last-child(11),.row.no-gutter .desktop-auto:nth-last-child(11)~.desktop-auto{width:9.09090909%}.row .desktop-auto:nth-last-child(12),.row .desktop-auto:nth-last-child(12)~.col-auto{width:8.33333333%;width:calc((100% - 16px*11) / 12)}.row.no-gutter .desktop-auto:nth-last-child(12),.row.no-gutter .desktop-auto:nth-last-child(12)~.desktop-auto{width:8.33333333%}.row .desktop-auto:nth-last-child(13),.row .desktop-auto:nth-last-child(13)~.col-auto{width:7.69230769%;width:calc((100% - 16px*12) / 13)}.row.no-gutter .desktop-auto:nth-last-child(13),.row.no-gutter .desktop-auto:nth-last-child(13)~.desktop-auto{width:7.69230769%}.row .desktop-auto:nth-last-child(14),.row .desktop-auto:nth-last-child(14)~.col-auto{width:7.14285714%;width:calc((100% - 16px*13) / 14)}.row.no-gutter .desktop-auto:nth-last-child(14),.row.no-gutter .desktop-auto:nth-last-child(14)~.desktop-auto{width:7.14285714%}.row .desktop-auto:nth-last-child(15),.row .desktop-auto:nth-last-child(15)~.col-auto{width:6.66666667%;width:calc((100% - 16px*14) / 15)}.row.no-gutter .desktop-auto:nth-last-child(15),.row.no-gutter .desktop-auto:nth-last-child(15)~.desktop-auto{width:6.66666667%}.row .desktop-auto:nth-last-child(16),.row .desktop-auto:nth-last-child(16)~.col-auto{width:6.25%;width:calc((100% - 16px*15) / 16)}.row.no-gutter .desktop-auto:nth-last-child(16),.row.no-gutter .desktop-auto:nth-last-child(16)~.desktop-auto{width:6.25%}.row .desktop-auto:nth-last-child(17),.row .desktop-auto:nth-last-child(17)~.col-auto{width:5.88235294%;width:calc((100% - 16px*16) / 17)}.row.no-gutter .desktop-auto:nth-last-child(17),.row.no-gutter .desktop-auto:nth-last-child(17)~.desktop-auto{width:5.88235294%}.row .desktop-auto:nth-last-child(18),.row .desktop-auto:nth-last-child(18)~.col-auto{width:5.55555556%;width:calc((100% - 16px*17) / 18)}.row.no-gutter .desktop-auto:nth-last-child(18),.row.no-gutter .desktop-auto:nth-last-child(18)~.desktop-auto{width:5.55555556%}.row .desktop-auto:nth-last-child(19),.row .desktop-auto:nth-last-child(19)~.col-auto{width:5.26315789%;width:calc((100% - 16px*18) / 19)}.row.no-gutter .desktop-auto:nth-last-child(19),.row.no-gutter .desktop-auto:nth-last-child(19)~.desktop-auto{width:5.26315789%}.row .desktop-auto:nth-last-child(20),.row .desktop-auto:nth-last-child(20)~.col-auto{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .desktop-auto:nth-last-child(20),.row.no-gutter .desktop-auto:nth-last-child(20)~.desktop-auto{width:5%}.row .desktop-auto:nth-last-child(21),.row .desktop-auto:nth-last-child(21)~.col-auto{width:4.76190476%;width:calc((100% - 16px*20) / 21)}.row.no-gutter .desktop-auto:nth-last-child(21),.row.no-gutter .desktop-auto:nth-last-child(21)~.desktop-auto{width:4.76190476%}}.mu-flexbox{width:100%;text-align:left;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;box-align:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-flexbox .mu-flexbox-item{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;min-width:20px;width:0}.mu-flexbox-item>.mu-flexbox{width:100%}.mu-flexbox .mu-flexbox-item:first-child{margin-left:0!important;margin-top:0!important}.mu-flex-col{box-orient:vertical;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.mu-flex-col>.mu-flexbox-item{width:100%}.mu-flex-row{box-direction:row;box-orient:horizontal;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}", "", {"version":3,"sources":["D:/vue/laoM/vueDemo/src/css/muse-ui.css"],"names":[],"mappings":"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","file":"muse-ui.css","sourcesContent":["/*!\n * Muse UI v2.0.3 (https://github.com/myronliu347/vue-carbon)\n * (c) 2017 Myron Liu \n * Released under the MIT License.\n */\n/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block}audio:not([controls]){display:none;height:0}progress{vertical-align:baseline}[hidden],template{display:none}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit;font-weight:bolder}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}svg:not(:root){overflow:hidden}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}button,input,select,textarea{font:inherit;margin:0}optgroup{font-weight:700}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-input-placeholder{color:inherit;opacity:.54}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}*,:after,:before{box-sizing:border-box}html{font-size:62.5%}body{font-family:Roboto,Lato,sans-serif;line-height:1.5;font-size:14px;font-weight:400;width:100%;-webkit-tap-highlight-color:rgba(0,0,0,0);background-color:#fff;color:rgba(0,0,0,.87)}body,html{overflow-x:hidden;overflow-y:auto}pre{white-space:pre-wrap;word-break:break-all;margin:0}a{text-decoration:none;color:#ff4081;user-select:none;-webkit-user-select:none}.mu-icon{font-size:24px;cursor:inherit}.mu-badge-container{display:inline-block;position:relative}.mu-badge{font-size:10px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding:0 6px;line-height:1.5;font-size:12px;font-style:normal;background-color:#bdbdbd;color:#fff;border-radius:3px;overflow:hidden}.mu-badge-float{position:absolute;top:-12px;right:-12px}.mu-badge-circle{border-radius:50%;padding:0;width:24px;height:24px;overflow:hidden}.mu-badge-primary{background-color:#7e57c2}.mu-badge-secondary{background-color:#ff4081}.mu-appbar{-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start;color:#fff;background-color:#7e57c2;height:56px;padding:0 8px;width:100%;z-index:3}.mu-appbar,.mu-appbar>.left,.mu-appbar>.right{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0}.mu-appbar>.left,.mu-appbar>.right{height:100%}.mu-appbar .mu-icon-button{color:inherit}.mu-appbar .mu-flat-button{color:inherit;height:100%;line-height:100%;min-width:auto}.mu-appbar-title{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;padding-left:8px;padding-right:8px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:20px;font-weight:400;line-height:56px}@media (min-width:480px){.mu-appbar-title{line-height:64px}.mu-appbar{height:64px}.mu-appbar-title{font-size:24px}}.mu-icon-button{position:relative;display:inline-block;overflow:visible;line-height:1;width:48px;height:48px;border-radius:50%;font-size:24px;padding:12px;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;color:inherit;text-decoration:none;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;cursor:pointer}.mu-icon-button .mu-circle-ripple{color:rgba(0,0,0,.87)}.mu-icon-button.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-ripple-wrapper{overflow:hidden}.mu-circle-ripple,.mu-ripple-wrapper{height:100%;width:100%;position:absolute;top:0;left:0}.mu-circle-ripple{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-radius:50%;background-color:currentColor;background-clip:padding-box;opacity:.1}.mu-ripple-enter-active,.mu-ripple-leave-active{-webkit-transition:opacity 2s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity 2s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity 2s cubic-bezier(.23,1,.32,1),transform .45s cubic-bezier(.23,1,.32,1);transition:opacity 2s cubic-bezier(.23,1,.32,1),transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-ripple-enter{-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0)}.mu-ripple-leave-active{opacity:0!important}.mu-focus-ripple-wrapper{height:100%;width:100%;position:absolute;top:0;left:0;overflow:hidden}.mu-focus-ripple{position:absolute;height:100%;width:100%;border-radius:50%;opacity:.16;background-color:currentColor;-webkit-animation:a .75s cubic-bezier(.445,.05,.55,.95);animation:a .75s cubic-bezier(.445,.05,.55,.95);-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-direction:alternate;animation-direction:alternate}@-webkit-keyframes a{0%{-webkit-transform:scale(.72);transform:scale(.72)}to{-webkit-transform:scale(.85);transform:scale(.85)}}@keyframes a{0%{-webkit-transform:scale(.72);transform:scale(.72)}to{-webkit-transform:scale(.85);transform:scale(.85)}}.mu-tooltip{position:absolute;font-size:10px;line-height:22px;padding:0 8px;z-index:5;color:#fff;overflow:hidden;top:-1000px;border-radius:2px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:0;-webkit-transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) .45s,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip.when-shown{opacity:.9;-webkit-transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms;transition:top 0ms cubic-bezier(.23,1,.32,1) 0ms,transform .45s cubic-bezier(.23,1,.32,1) 0ms,opacity .45s cubic-bezier(.23,1,.32,1) 0ms,-webkit-transform .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip.touched{font-size:14px;line-height:32px;padding:0 16px}.mu-tooltip-ripple{position:absolute;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);border-radius:50%;background-color:transparent;-webkit-transition:width 0ms cubic-bezier(.23,1,.32,1) .45s,height 0ms cubic-bezier(.23,1,.32,1) .45s,background-color .45s cubic-bezier(.23,1,.32,1) 0ms;transition:width 0ms cubic-bezier(.23,1,.32,1) .45s,height 0ms cubic-bezier(.23,1,.32,1) .45s,background-color .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip-ripple.when-shown{background-color:#616161;-webkit-transition:width .45s cubic-bezier(.23,1,.32,1) 0ms,height .45s cubic-bezier(.23,1,.32,1) 0ms,background-color .45s cubic-bezier(.23,1,.32,1) 0ms;transition:width .45s cubic-bezier(.23,1,.32,1) 0ms,height .45s cubic-bezier(.23,1,.32,1) 0ms,background-color .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-tooltip-label{white-space:nowrap;position:relative}.mu-flat-button{display:inline-block;overflow:hidden;position:relative;border-radius:2px;height:36px;line-height:36px;min-width:88px;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);text-decoration:none;text-transform:uppercase;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;color:rgba(0,0,0,.87);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;padding:0;cursor:pointer}.mu-flat-button.hover{background-color:rgba(0,0,0,.1)}.mu-flat-button.disabled{color:rgba(0,0,0,.38);cursor:not-allowed;background:none}.mu-flat-button .mu-icon{vertical-align:middle;margin-left:12px;margin-right:0}.mu-flat-button .mu-icon+.mu-flat-button-label{padding-left:8px}.mu-flat-button.no-label .mu-icon{margin-left:0}.mu-flat-button .mu-circle-ripple{color:rgba(0,0,0,.87)}.mu-flat-button.label-before{padding-right:8px}.mu-flat-button.label-before .mu-icon{margin-right:4px;margin-left:0}.mu-flat-button.label-before .mu-flat-button-label{padding-right:8px}.mu-flat-button-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;width:100%;height:100%}.mu-flat-button-primary{color:#7e57c2}.mu-flat-button-secondary{color:#ff4081}.mu-flat-button-label{vertical-align:middle;padding-right:16px;padding-left:16px;font-size:14px}.mu-raised-button{display:inline-block;overflow:hidden;position:relative;border-radius:2px;height:36px;line-height:36px;min-width:88px;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);text-decoration:none;text-transform:uppercase;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;color:rgba(0,0,0,.87);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;padding:0;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-raised-button.focus{box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-raised-button.hover .mu-raised-button-wrapper{background-color:rgba(0,0,0,.1)}.mu-raised-button.disabled{color:rgba(0,0,0,.3);cursor:not-allowed;background-color:#e6e6e6;box-shadow:none}.mu-raised-button.disabled.hover,.mu-raised-button.disabled:active,.mu-raised-button.disabled:hover{box-shadow:none}.mu-raised-button.disabled.hover .mu-raised-button-wrapper,.mu-raised-button.disabled:active .mu-raised-button-wrapper,.mu-raised-button.disabled:hover .mu-raised-button-wrapper{background-color:transparent}.mu-raised-button .mu-icon{vertical-align:middle;margin-left:12px;margin-right:0}.mu-raised-button .mu-icon+.mu-raised-button-label{padding-left:8px}.mu-raised-button.no-label .mu-icon{margin:0}.mu-raised-button.label-before .mu-raised-button-wrapper{padding-right:8px}.mu-raised-button.label-before .mu-icon{margin-right:4px;margin-left:0}.mu-raised-button.label-before .mu-raised-button-label{padding-right:8px}.mu-raised-button:active{box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-raised-button-wrapper{border-radius:2px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;width:100%;height:100%}.mu-raised-button-primary{background-color:#7e57c2}.mu-raised-button-secondary{background-color:#ff4081}.mu-raised-button-full{width:100%}.mu-raised-button.mu-raised-button-inverse{color:#fff}.mu-raised-button.mu-raised-button-inverse .mu-circle-ripple{opacity:.3}.mu-raised-button.mu-raised-button-inverse.hover .mu-raised-button-wrapper{background-color:hsla(0,0%,100%,.3)}.mu-raised-button-label{vertical-align:middle;padding-right:16px;padding-left:16px}.mu-float-button{position:relative;display:inline-block;overflow:visible;line-height:1;width:56px;height:56px;border-radius:50%;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#7e57c2;color:#fff;text-decoration:none;-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:cubic-bezier(.23,1,.32,1);transition-timing-function:cubic-bezier(.23,1,.32,1);-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-box-flex:0;-webkit-flex-shrink:0;-ms-flex:0 0 auto;-ms-flex-negative:0;flex-shrink:0;margin:0;outline:0;padding:0;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-float-button .mu-circle-ripple{opacity:.3}.mu-float-button.disabled{color:rgba(0,0,0,.3);cursor:not-allowed;background-color:#e6e6e6;box-shadow:none}.mu-float-button.disabled.hover,.mu-float-button.disabled:active,.mu-float-button.disabled:hover{box-shadow:none}.mu-float-button.disabled.hover .mu-float-button-wrapper,.mu-float-button.disabled:active .mu-float-button-wrapper,.mu-float-button.disabled:hover .mu-float-button-wrapper{background-color:transparent}.mu-float-button.hover,.mu-float-button:active{box-shadow:0 10px 30px rgba(0,0,0,.188235),0 6px 10px rgba(0,0,0,.227451)}.mu-float-button.hover .mu-float-button-wrapper,.mu-float-button:active .mu-float-button-wrapper{background-color:hsla(0,0%,100%,.3)}.mu-float-button-wrapper{border-radius:50%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:absolute;left:0;top:0;right:0;bottom:0}.mu-float-button-mini{width:40px;height:40px}.mu-float-button-secondary{background-color:#ff4081}.mu-content-block{padding:8px 16px;width:100%}.mu-content-block p{margin-top:1em;margin-bottom:1em}.mu-content-block p:first-child{margin-top:0}.mu-content-block p:last-child{margin-bottom:0}.mu-list{padding:8px 0;width:100%;position:relative;overflow-x:hidden;overflow-y:visible}.mu-list .mu-sub-header:first-child{margin-top:-8px}.mu-item-wrapper{display:block;color:inherit;position:relative;outline:none;cursor:pointer}.mu-item-wrapper.hover{background-color:rgba(0,0,0,.1)}.mu-item-wrapper.disabled{cursor:default}.mu-item{min-height:48px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;padding:16px;color:rgba(0,0,0,.87);position:relative}.mu-item.show-left{padding-left:72px}.mu-item.show-right{padding-right:56px}.mu-item.has-avatar{min-height:56px}.mu-item.selected{color:#7e57c2}.mu-item-toggle-button{color:rgba(0,0,0,.87);position:absolute;right:4px;top:0}.mu-item-left,.mu-item-right{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:40px;height:100%;position:absolute;color:#757575;top:0;max-height:72px}.mu-item-left{left:16px}.mu-item.selected .mu-item-left{color:#7e57c2}.mu-item-right{right:12px;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.mu-item-right>.mu-icon-button,.mu-item-right>.mu-icon-menu{-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start}.mu-item-content{width:100%;-webkit-align-self:center;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.mu-item-title-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;width:100%;line-height:1}.mu-item-title{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;display:block;font-size:16px;max-width:100%}.mu-item-sub-title{line-height:1;margin-top:4px}.mu-item-after{margin-left:auto;color:rgba(0,0,0,.54);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-item-text{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;position:relative;overflow:hidden;font-size:14px;line-height:18px;margin-top:4px;max-height:40px;max-width:100%;text-overflow:ellipsis;word-break:break-all;color:rgba(0,0,0,.54)}.mu-item-svg-icon{display:inline-block;width:24px;height:24px;stroke-width:2;fill:none;stroke:currentColor;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-expand-enter-active,.mu-expand-leave-active{-webkit-transition:height .45s cubic-bezier(.23,1,.32,1),padding .45s cubic-bezier(.23,1,.32,1);transition:height .45s cubic-bezier(.23,1,.32,1),padding .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translateZ(0);transform:translateZ(0)}.mu-sub-header{color:rgba(0,0,0,.54);font-size:14px;line-height:48px;padding-left:16px;width:100%}.mu-sub-header.inset{padding-left:72px}.mu-divider{margin:0;height:1px;border:none;background-color:rgba(0,0,0,.12);width:100%}.mu-divider.inset{margin-left:72px}.mu-divider.shallow-inset{margin-left:16px}html.pixel-ratio-2 .mu-divider{-webkit-transform:scaleY(.5);-ms-transform:scaleY(.5);transform:scaleY(.5)}html.pixel-ratio-3 .mu-divider{-webkit-transform:scaleY(.33);-ms-transform:scaleY(.33);transform:scaleY(.33)}.mu-refresh-control{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;margin:0 auto;width:40px;height:40px;color:#7e57c2;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;background-color:#fff;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647);position:absolute;left:50%;margin-left:-18px;margin-top:24px;z-index:2}.mu-refresh-control .mu-icon{display:inline-block;vertical-align:middle}.mu-refresh-svg-icon{display:inline-block;width:28px;height:28px;fill:currentColor;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-refresh-control-animate{-webkit-transition:all .45s ease;transition:all .45s ease}.mu-refresh-control-hide{opacity:1;-webkit-transform:translate3d(0,-68px,0);transform:translate3d(0,-68px,0)}.mu-refresh-control-noshow{opacity:0;-webkit-transform:scale(.01);-ms-transform:scale(.01);transform:scale(.01)}.mu-refresh-control-refreshing{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);opacity:1}.mu-circle-wrapper{display:inline-block;position:relative;width:48px;height:48px}.mu-circle-wrapper.active{-webkit-animation:e 1568ms linear infinite;animation:e 1568ms linear infinite}.mu-circle-wrapper .mu-circle{border-radius:50%}.mu-circle-wrapper .left{float:left!important}.mu-circle-wrapper .right{float:right!important}.mu-circle-spinner{position:absolute;width:100%;height:100%;opacity:0;border-color:#7e57c2;opacity:1;-webkit-animation:b 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:b 5332ms cubic-bezier(.4,0,.2,1) infinite both}.mu-circle-secondary{border-color:#ff4081}.mu-circle-clipper{display:inline-block;position:relative;width:50%}.mu-circle-clipper,.mu-circle-gap-patch{height:100%;overflow:hidden;border-color:inherit}.mu-circle-gap-patch{position:absolute;top:0;left:45%;width:10%}.mu-circle-gap-patch .mu-circle{width:1000%;left:-450%}.mu-circle-clipper .mu-circle{width:200%;height:100%;border-width:3px;border-style:solid;border-color:inherit;border-bottom-color:transparent!important;border-radius:50%;-webkit-animation:none;animation:none;position:absolute;top:0;right:0;bottom:0}.mu-circle-spinner.active .mu-circle-clipper.left .mu-circle{-webkit-animation:c 1333ms cubic-bezier(.4,0,.2,1) infinite both;animation:c 1333ms cubic-bezier(.4,0,.2,1) infinite both}.mu-circle-spinner.active .mu-circle-clipper.right .mu-circle{-webkit-animation:d 1333ms cubic-bezier(.4,0,.2,1) infinite both;animation:d 1333ms cubic-bezier(.4,0,.2,1) infinite both}.mu-circle-clipper.left .mu-circle{left:0;border-right-color:transparent!important;-webkit-transform:rotate(129deg);-ms-transform:rotate(129deg);transform:rotate(129deg)}.mu-circle-clipper.right .mu-circle{left:-100%;border-left-color:transparent!important;-webkit-transform:rotate(-129deg);-ms-transform:rotate(-129deg);transform:rotate(-129deg)}@-webkit-keyframes b{12.5%{-webkit-transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg)}to{-webkit-transform:rotate(3turn)}}@keyframes b{12.5%{-webkit-transform:rotate(135deg);transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg);transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg);transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg);transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg);transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg);transform:rotate(945deg)}to{-webkit-transform:rotate(3turn);transform:rotate(3turn)}}@-webkit-keyframes c{0%{-webkit-transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg)}}@keyframes c{0%{-webkit-transform:rotate(130deg);transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg);transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg);transform:rotate(130deg)}}@-webkit-keyframes d{0%{-webkit-transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg)}}@keyframes d{0%{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg);transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}}@-webkit-keyframes e{to{-webkit-transform:rotate(1turn)}}@keyframes e{to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.mu-infinite-scroll{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;padding-bottom:8px;line-height:36px;width:100%}.mu-infinite-scroll-text{margin-left:16px;font-size:16px}.mu-avatar{display:inline-block;height:40px;width:40px;font-size:20px;color:#fff;background-color:#bdbdbd;text-align:center;border-radius:50%}.mu-avatar img{border-radius:50%;width:100%;height:100%;display:block}.mu-avatar-inner{height:100%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.mu-avatar-inner,.mu-tabs{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-tabs{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;background-color:#7e57c2;color:#fff;text-align:center;position:relative;z-index:3}.mu-tab-link-highlight{position:absolute;left:0;bottom:0;height:2px;background-color:#ff4081;-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-tab-link{min-height:48px;padding-top:12px;padding-bottom:12px;font-size:14px;background:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;text-decoration:none;border:none;outline:none;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;color:inherit;position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;line-height:normal;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;color:hsla(0,0%,100%,.7);-webkit-transition:all .45s cubic-bezier(.445,.05,.55,.95);transition:all .45s cubic-bezier(.445,.05,.55,.95);cursor:pointer}.mu-tab-active{color:#fff}.mu-tab-text.has-icon{margin-top:8px}.mu-paper{-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.87);background-color:#fff;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-paper-round{border-radius:2px}.mu-paper-circle{border-radius:50%}.mu-paper-1{box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-paper-2{box-shadow:0 3px 10px rgba(0,0,0,.156863),0 3px 10px rgba(0,0,0,.227451)}.mu-paper-3,.mu-paper-4{box-shadow:0 14px 45px rgba(0,0,0,.247059),0 10px 18px rgba(0,0,0,.219608)}.mu-paper-5{box-shadow:0 19px 60px rgba(0,0,0,.298039),0 15px 20px rgba(0,0,0,.219608)}.mu-bottom-nav{height:56px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;background-color:#fff;text-align:center;position:relative;width:100%;color:#fff}.mu-bottom-nav-shift{background-color:#7e57c2}.mu-bottom-nav-shift-wrapper{height:100%;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;text-align:center}.mu-buttom-item{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;min-width:80px;max-width:168px;position:relative;height:100%;color:rgba(0,0,0,.54);padding:0;background:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;text-decoration:none;border:none;outline:none;-webkit-transition:all .4s cubic-bezier(.445,.05,.55,.95);transition:all .4s cubic-bezier(.445,.05,.55,.95);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding:6px}.mu-bottom-nav-shift .mu-buttom-item{color:hsla(0,0%,100%,.7);padding:8px 12px 10px;min-width:56px;max-width:168px}.mu-buttom-item-wrapper{display:block;height:100%}.mu-bottom-item-active{padding-top:6px;padding-bottom:5px}.mu-bottom-item-active .mu-bottom-item-text{font-size:14px}.mu-bottom-nav-shift .mu-bottom-item-active{-webkit-box-flex:1.7;-webkit-flex:1.7;-ms-flex:1.7;flex:1.7;min-width:96px;max-width:168px;padding-top:6px;padding-bottom:5px}.mu-bottom-item-text{display:block;text-align:center;font-size:12px;-webkit-transition:all .4s cubic-bezier(.23,1,.32,1),color .3s,font-size .3s;transition:all .4s cubic-bezier(.23,1,.32,1),color .3s,font-size .3s;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-bottom-item-active .mu-bottom-item-text{color:#7e57c2}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-text{color:#fff}.mu-bottom-nav-shift .mu-bottom-item-text{opacity:0;-webkit-transform:scale(1) translate3d(0,6px,0);transform:scale(1) translate3d(0,6px,0)}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-text{-webkit-transform:scale(1) translate3d(0,2px,0);transform:scale(1) translate3d(0,2px,0);opacity:1}.mu-bottom-item-icon{display:block;margin:auto;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden;width:24px}.mu-bottom-item-active .mu-bottom-item-icon{color:#7e57c2}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-icon{color:#fff}.mu-bottom-nav-shift .mu-bottom-item-icon{-webkit-transform:translate3d(0,8px,0);transform:translate3d(0,8px,0)}.mu-bottom-nav-shift .mu-bottom-item-active .mu-bottom-item-icon{-webkit-transform:scale(1) translateZ(0);transform:scale(1) translateZ(0)}.mu-card{background-color:#fff;position:relative;border-radius:2px;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647)}.mu-card-header{padding:16px;font-weight:500;position:relative;white-space:nowrap}.mu-card-header .mu-avatar{margin-right:16px}.mu-card-header-title{display:inline-block;vertical-align:top;white-space:normal;padding-right:90px}.mu-card-header-title .mu-card-title{font-size:15px;color:rgba(0,0,0,.87)}.mu-card-header-title .mu-card-sub-title{font-size:14px;color:rgba(0,0,0,.57)}.mu-card-media{position:relative}.mu-card-media>img{width:100%;max-width:100%;min-width:100%;display:block;vertical-align:top}.mu-card-media-title{position:absolute;left:0;right:0;bottom:0;padding:16px;background-color:rgba(0,0,0,.54)}.mu-card-media-title .mu-card-title{font-size:24px;color:hsla(0,0%,100%,.87);line-height:36px}.mu-card-media-title .mu-card-sub-title{color:hsla(0,0%,100%,.54);font-size:14px}.mu-card-title-container{padding:16px;position:relative}.mu-card-title-container .mu-card-title{font-size:24px;color:rgba(0,0,0,.87);line-height:36px}.mu-card-title-container .mu-card-sub-title{font-size:14px;color:rgba(0,0,0,.54);display:block}.mu-card-text{padding:16px;font-size:14px;color:rgba(0,0,0,.87)}.mu-card-actions{padding:8px;position:relative}.mu-chip{border-radius:16px;line-height:32px;white-space:nowrap;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;background-color:#e0e0e0;color:rgba(0,0,0,.87);padding:0 12px;cursor:default}.mu-chip .mu-avatar:first-child{margin-left:-12px;margin-right:4px}.mu-chip.active{box-shadow:0 1px 6px rgba(0,0,0,.12),0 1px 4px rgba(0,0,0,.12)}.mu-chip.hover{background-color:#cecece;cursor:pointer}.mu-chip.hover .mu-chip-delete-icon{color:rgba(0,0,0,.4)}.mu-chip-delete-icon{display:inline-block;margin-right:-8px;margin-left:4px;color:rgba(0,0,0,.26);fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-overlay{position:absolute;left:0;right:0;top:0;bottom:0;background-color:#000;opacity:.4;z-index:6}.mu-overlay-fade-enter-active,.mu-overlay-fade-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1)}.mu-overlay-fade-enter,.mu-overlay-fade-leave-active{opacity:0!important}.mu-dialog-wrapper{position:fixed;left:0;top:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-dialog{width:75%;max-width:768px;padding:0;background-color:#fff;border-radius:2px;font-size:16px;box-shadow:0 19px 60px rgba(0,0,0,.298039),0 15px 20px rgba(0,0,0,.219608)}.mu-dialog-title{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:24px 24px 20px;margin:0;font-size:22px;font-weight:400;line-height:32px;color:rgba(0,0,0,.87)}.mu-dialog-title+.mu-dialog-body{padding-top:0}.mu-dialog-title.scrollable{border-bottom:1px solid rgba(0,0,0,.12)}.mu-dialog-body{padding:24px 24px 20px;color:rgba(0,0,0,.6)}.mu-dialog-actions{min-height:48px;padding:8px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end}.mu-dialog-actions .mu-raised-button+.mu-raised-button{margin-left:10px}.mu-dialog-actions.scrollable{border-top:1px solid rgba(0,0,0,.12)}.mu-dialog-slide-enter-active,.mu-dialog-slide-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1)}.mu-dialog-slide-enter-active .mu-dialog,.mu-dialog-slide-leave-active .mu-dialog{-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-dialog-slide-enter,.mu-dialog-slide-leave-active{opacity:0}.mu-dialog-slide-enter .mu-dialog{-webkit-transform:translate3d(0,-64px,0);transform:translate3d(0,-64px,0)}.mu-dialog-slide-leave-active .mu-dialog{-webkit-transform:translate3d(0,64px,0);transform:translate3d(0,64px,0)}.mu-toast{height:48px;line-height:48px;padding:0 24px;background-color:rgba(0,0,0,.87);color:#fff;border-radius:24px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;word-wrap:break-word;max-width:568px;width:100%;position:fixed;left:0;bottom:0}@media only screen and (max-width:992px) and (min-width:601px){.mu-toast{width:auto;min-width:288px;left:5%;bottom:7%}}@media only screen and (min-width:993px){.mu-toast{width:auto;min-width:8%;top:10%;right:7%;left:auto;bottom:auto;min-width:288px}}.mu-toast-enter-active,.mu-toast-leave-active{-webkit-transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-toast-enter,.mu-toast-leave-active{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0}.mu-snackbar{position:fixed;bottom:0;left:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;color:#fff;background-color:rgba(0,0,0,.87);padding:0 24px;min-height:48px;width:100%;max-width:568px}.mu-snackbar-action{margin:0 -16px 0 24px}.mu-snackbar-message{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;padding-top:8px;padding-bottom:8px}@media only screen and (max-width:992px) and (min-width:601px){.mu-snackbar{width:auto;min-width:288px;left:5%;bottom:7%}}@media only screen and (min-width:993px){.mu-snackbar{width:auto;min-width:8%;top:10%;right:7%;left:auto;bottom:auto;min-width:288px}}.mu-snackbar-enter-active,.mu-snackbar-leave-active{-webkit-transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1);transition:transform .4s cubic-bezier(.23,1,.32,1),opacity .4s cubic-bezier(.23,1,.32,1),-webkit-transform .4s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-snackbar-enter,.mu-snackbar-leave-active{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0}.mu-popup{position:fixed;background-color:#fff;top:50%;left:50%;-webkit-transform:translate3d(-50%,-50%,0);transform:translate3d(-50%,-50%,0);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-popup-top{top:0;right:auto;bottom:auto;left:50%;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0)}.mu-popup-right{top:50%;right:0;bottom:auto;left:auto;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.mu-popup-bottom{top:auto;right:auto;bottom:0;left:50%;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0)}.mu-popup-left{top:50%;right:auto;bottom:auto;left:0;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.popup-slide-bottom-enter-active,.popup-slide-bottom-leave-active,.popup-slide-left-enter-active,.popup-slide-left-leave-active,.popup-slide-right-enter-active,.popup-slide-right-leave-active,.popup-slide-top-enter-active,.popup-slide-top-leave-active{-webkit-transition:-webkit-transform .3s ease;transition:-webkit-transform .3s ease;transition:transform .3s ease;transition:transform .3s ease,-webkit-transform .3s ease}.popup-slide-top-enter,.popup-slide-top-leave-active{-webkit-transform:translate3d(-50%,-100%,0);transform:translate3d(-50%,-100%,0)}.popup-slide-right-enter,.popup-slide-right-leave-active{-webkit-transform:translate3d(100%,-50%,0);transform:translate3d(100%,-50%,0)}.popup-slide-bottom-enter,.popup-slide-bottom-leave-active{-webkit-transform:translate3d(-50%,100%,0);transform:translate3d(-50%,100%,0)}.popup-slide-left-enter,.popup-slide-left-leave-active{-webkit-transform:translate3d(-100%,-50%,0);transform:translate3d(-100%,-50%,0)}.popup-fade-enter-active,.popup-fade-leave-active{-webkit-transition:opacity .3s;transition:opacity .3s}.popup-fade-enter,.popup-fade-leave-active{opacity:0}.mu-menu{z-index:2;outline:none}.mu-menu-list{padding:8px 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow-y:auto;-webkit-overflow-scrolling:touch}.mu-menu-list>.mu-divider{margin:7px 0 8px}.mu-menu-list>.mu-sub-header{padding-left:24px;margin-top:-8px}.mu-menu-destop{padding:16px 0}.mu-menu-destop>.mu-sub-header{margin-top:-16px}.mu-menu-item-wrapper{display:block;font-size:16px;height:48px;line-height:48px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.87);position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-menu-destop .mu-menu-item-wrapper{height:32px;line-height:32px;font-size:15px}.mu-menu-item-wrapper.hover{background-color:rgba(0,0,0,.1)}.mu-menu-item-wrapper.active{color:#ff4081}.mu-menu-item-wrapper.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-menu-item{padding:0 16px;position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-menu-destop .mu-menu-item{padding:0 24px}.mu-menu-item.have-left-icon{padding-left:72px}.mu-menu-item-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;word-wrap:break-word}.mu-menu-item-left-icon{position:absolute;top:0;left:4px;margin:12px;color:#757575}.mu-menu-destop .mu-menu-item-left-icon{top:4px;left:24px;margin:0}.mu-menu-item-right-icon{position:absolute;top:0;right:4px;margin:12px;color:#757575}.mu-menu-destop .mu-menu-item-right-icon{top:4px;right:24px;margin:0}.mu-popover{position:fixed;background:#fff;border-radius:2px;max-height:100%;overflow:visible;-webkit-overflow-scrolling:touch;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647);-webkit-transform-origin:center top;-ms-transform-origin:center top;transform-origin:center top}.mu-popover-enter-active,.mu-popover-leave-active{-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-property:opacity,-webkit-transform;transition-property:opacity,-webkit-transform;transition-property:opacity,transform;transition-property:opacity,transform,-webkit-transform}.mu-popover-enter,.mu-popover-leave-active{-webkit-transform:scaleY(0);-ms-transform:scaleY(0);transform:scaleY(0);opacity:0}.mu-bottom-sheet{background-color:#fff;position:fixed;left:0;right:0;bottom:0}.mu-bottom-sheet-enter-active,.mu-bottom-sheet-leave-active{-webkit-transition:-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-bottom-sheet-enter,.mu-bottom-sheet-leave-active{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}.mu-dropDown-menu,.mu-icon-menu{display:inline-block;position:relative}.mu-dropDown-menu{font-size:15px;height:48px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);cursor:pointer;overflow:hidden}.mu-dropDown-menu.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-dropDown-menu-icon{position:absolute;right:16px;top:16px;color:rgba(0,0,0,.12);fill:currentColor;display:inline-block;width:24px;height:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-dropDown-menu-text{padding-left:24px;padding-right:48px;line-height:56px;opacity:1;position:relative;color:rgba(0,0,0,.87)}.mu-dropDown-menu.disabled .mu-dropDown-menu-text{color:rgba(0,0,0,.38)}.mu-dropDown-menu-text-overflow{white-space:nowrap;overflow:hidden;width:100%}.mu-dropDown-menu-line{bottom:1px;left:0;margin:-1px 24px;right:0;position:absolute;height:1px;background-color:rgba(0,0,0,.12);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}html.pixel-ratio-2 .mu-dropDown-menu-line{-webkit-transform:scaleY(.5);-ms-transform:scaleY(.5);transform:scaleY(.5)}html.pixel-ratio-3 .mu-dropDown-menu-line{-webkit-transform:scaleY(.33);-ms-transform:scaleY(.33);transform:scaleY(.33)}.mu-drawer{width:256px;position:fixed;top:0;bottom:0;overflow:auto;-webkit-overflow-scrolling:touch;-webkit-transition-property:visibility,-webkit-transform;transition-property:visibility,-webkit-transform;transition-property:transform,visibility;transition-property:transform,visibility,-webkit-transform;-webkit-transition-duration:.45s;transition-duration:.45s;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);border-radius:0;left:0;visibility:hidden;z-index:4}.mu-drawer::-webkit-scrollbar{display:none!important;width:0!important;height:0!important;-webkit-appearance:none;opacity:0!important}.mu-drawer.right{right:0;left:auto;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.mu-drawer.open{-webkit-transform:translateZ(0);transform:translateZ(0);visibility:visible}.mu-picker{background:#fff;overflow:hidden;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;-webkit-mask-box-image:-webkit-linear-gradient(bottom,transparent,transparent 5%,#fff 20%,#fff 80%,transparent 95%,transparent);-webkit-mask-box-image:linear-gradient(0deg,transparent,transparent 5%,#fff 20%,#fff 80%,transparent 95%,transparent)}.mu-picker-center-highlight{height:36px;box-sizing:border-box;position:absolute;left:0;width:100%;top:50%;margin-top:-18px;pointer-events:none;border-top:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12)}.mu-picker-center-highlight:before{left:0;top:0;bottom:auto;right:auto}.mu-picker-center-highlight:after{left:0;bottom:0;right:auto;top:auto}.mu-picker-slot{-webkit-box-flex:1;-webkit-flex-shrink:1;-ms-flex:0 1 auto;-ms-flex-negative:1;flex-shrink:1;font-size:18px;overflow:hidden;position:relative;max-height:100%;text-align:center}.mu-picker-slot.mu-picker-slot-divider{color:rgba(0,0,0,.87);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;line-height:36px}.mu-picker-slot-wrapper.animate{-webkit-transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-picker-item,.mu-picker-slot-wrapper.animate{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-picker-item{line-height:36px;padding:0 10px;font-size:20px;white-space:nowrap;position:relative;overflow:hidden;text-overflow:ellipsis;color:rgba(0,0,0,.54);left:0;top:0;width:100%;box-sizing:border-box;-webkit-transition-duration:.3s;transition-duration:.3s}.mu-picker-item.selected{color:rgba(0,0,0,.87);-webkit-transform:translateZ(0) rotateX(0);transform:translateZ(0) rotateX(0)}.mu-text-field{font-size:16px;width:256px;min-height:48px;display:inline-block;position:relative;color:rgba(0,0,0,.54);margin-bottom:8px}.mu-text-field.full-width{width:100%}.mu-text-field.has-icon{padding-left:56px}.mu-text-field.focus-state{color:#7e57c2}.mu-text-field.focus-state.error{color:#f44336}.mu-text-field.has-label{min-height:72px}.mu-text-field-icon{position:absolute;left:16px;top:12px}.mu-text-field.has-label .mu-text-field-icon{top:36px}.mu-text-field-content{display:block;height:100%;padding-bottom:12px;padding-top:4px}.mu-text-field.disabled .mu-text-field-content{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-text-field.has-label .mu-text-field-content{padding-top:28px;padding-bottom:12px}.mu-text-field-input{-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;border:none;background:none;border-radius:0 0 0 0;box-shadow:none;display:block;padding:0;margin:0;width:100%;height:32px;font-style:inherit;font-variant:inherit;font-weight:inherit;font-stretch:inherit;font-size:inherit;color:rgba(0,0,0,.87);font-family:inherit;position:relative}.mu-text-field-help{position:absolute;margin-top:6px;font-size:12px;line-height:12px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;left:0;right:0}.mu-text-field.has-icon .mu-text-field-help{left:56px}.mu-text-field.error .mu-text-field-help{color:#f44336}.mu-text-field.disabled .mu-text-field-help{color:inherit}.mu-text-field-line{margin:0;height:1px;border:none;background-color:rgba(0,0,0,.12);left:0;right:0;position:absolute}.mu-text-field.has-icon .mu-text-field-line{left:56px}.mu-text-field-line.disabled{height:auto;background-color:transparent;border-bottom:2px dotted rgba(0,0,0,.38)}.mu-text-field-focus-line{margin:0;height:2px;border:none;background-color:#7e57c2;position:absolute;left:0;right:0;margin-top:-1px;-webkit-transform:scaleX(0);-ms-transform:scaleX(0);transform:scaleX(0);-webkit-transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1)}.mu-text-field.has-icon .mu-text-field-focus-line{left:56px}.mu-text-field-focus-line.error,.mu-text-field-focus-line.focus{-webkit-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1)}.mu-text-field-focus-line.error{background-color:#f44336}.mu-text-field-textarea{resize:vertical;line-height:1.5;position:relative;height:100%;resize:none}.mu-text-field-multiline{width:100%;position:relative}.mu-text-field-textarea-hide{width:100%;height:auto;resize:none;position:absolute;padding:0;overflow:auto;visibility:hidden}.mu-text-field-label{line-height:20px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);z-index:1;cursor:text;-webkit-transform:translateZ(0) scale(.75);transform:translateZ(0) scale(.75);-webkit-transform-origin:left top;-ms-transform-origin:left top;transform-origin:left top;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-text-field.has-label .mu-text-field-label{top:8px;position:absolute}.mu-text-field.has-label .mu-text-field-label.float{-webkit-transform:translate3d(0,28px,0) scale(1);transform:translate3d(0,28px,0) scale(1);color:rgba(0,0,0,.38)}.mu-text-field-hint{position:absolute;opacity:0;-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.38);line-height:34px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:text}.mu-text-field-hint.show{opacity:1}.mu-text-field.multi-line .mu-text-field-hint{line-height:1.5}.mu-select-field .mu-dropDown-menu{display:block;width:100%;height:32px}.mu-select-field .mu-dropDown-menu-text{line-height:32px;height:32px;padding-left:0;padding-right:24px;word-wrap:break-word;overflow:hidden}.mu-select-field .mu-dropDown-menu-line{display:none}.mu-select-field .mu-dropDown-menu-icon{right:0;top:6px}.mu-checkbox{position:relative;display:inline-block;height:24px;line-height:24px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-checkbox input[type=checkbox]{display:none}.mu-checkbox input[type=checkbox]:checked+.mu-checkbox-wrapper .mu-checkbox-icon-uncheck{opacity:0;-webkit-transition:opacity .65s cubic-bezier(.23,1,.32,1) .15s;transition:opacity .65s cubic-bezier(.23,1,.32,1) .15s;color:#7e57c2}.mu-checkbox input[type=checkbox]:checked+.mu-checkbox-wrapper .mu-checkbox-icon-checked{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);-webkit-transition:opacity 0ms cubic-bezier(.23,1,.32,1),-webkit-transform .8s cubic-bezier(.23,1,.32,1);transition:opacity 0ms cubic-bezier(.23,1,.32,1),-webkit-transform .8s cubic-bezier(.23,1,.32,1);transition:opacity 0ms cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1);transition:opacity 0ms cubic-bezier(.23,1,.32,1),transform .8s cubic-bezier(.23,1,.32,1),-webkit-transform .8s cubic-bezier(.23,1,.32,1)}.mu-checkbox input[type=checkbox]:checked+.mu-checkbox-wrapper .mu-checkbox-ripple-wrapper{color:#7e57c2}.mu-checkbox *{pointer-events:none}.mu-checkbox.disabled{cursor:not-allowed}.mu-checkbox-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:24px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-checkbox-icon{width:24px;height:24px;vertical-align:middle;position:relative;margin-right:16px}.mu-checkbox.label-left .mu-checkbox-icon{margin-right:0;margin-left:16px}.mu-checkbox.no-label .mu-checkbox-icon{margin-left:0;margin-right:0}.mu-checkbox-label{color:rgba(0,0,0,.87)}.mu-checkbox.disabled .mu-checkbox-label{color:rgba(0,0,0,.38)}.mu-checkbox-svg-icon{display:inline-block;fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-checkbox-icon-uncheck{position:absolute;left:0;top:0;opacity:1;-webkit-transition:opacity 1s cubic-bezier(.23,1,.32,1) .2s;transition:opacity 1s cubic-bezier(.23,1,.32,1) .2s;color:rgba(0,0,0,.87)}.mu-checkbox.disabled .mu-checkbox-icon-uncheck{color:rgba(0,0,0,.38)}.mu-checkbox-icon-checked{position:absolute;left:0;top:0;opacity:0;color:#7e57c2;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform 0ms cubic-bezier(.23,1,.32,1) .45s;transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform 0ms cubic-bezier(.23,1,.32,1) .45s;transition:opacity .45s cubic-bezier(.23,1,.32,1),transform 0ms cubic-bezier(.23,1,.32,1) .45s;transition:opacity .45s cubic-bezier(.23,1,.32,1),transform 0ms cubic-bezier(.23,1,.32,1) .45s,-webkit-transform 0ms cubic-bezier(.23,1,.32,1) .45s}.mu-checkbox.disabled .mu-checkbox-icon-checked{color:rgba(0,0,0,.38)}.mu-checkbox-ripple-wrapper{width:48px;height:48px;top:-12px;left:-12px}.mu-checkbox.label-left .mu-checkbox-ripple-wrapper{right:-12px;left:auto}.mu-radio{position:relative;display:inline-block;height:24px;line-height:24px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-radio input[type=radio]{display:none}.mu-radio input[type=radio]:checked+.mu-radio-wrapper .mu-radio-icon-uncheck{opacity:0;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);color:#7e57c2}.mu-radio input[type=radio]:checked+.mu-radio-wrapper .mu-radio-icon-checked{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}.mu-radio input[type=radio]:checked+.mu-radio-wrapper .mu-radio-ripple-wrapper{color:#7e57c2}.mu-radio *{pointer-events:none}.mu-radio.disabled{cursor:not-allowed}.mu-radio-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:24px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-radio-icon{width:24px;height:24px;vertical-align:middle;position:relative;margin-right:16px}.mu-radio.label-left .mu-radio-icon{margin-right:0;margin-left:16px}.mu-radio.no-label .mu-radio-icon{margin-left:0;margin-right:0}.mu-radio-label{color:rgba(0,0,0,.87);-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;font-size:16px}.mu-radio.disabled .mu-radio-label{color:rgba(0,0,0,.38)}.mu-radio-svg-icon{display:inline-block;fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-radio-icon-uncheck{position:absolute;left:0;top:0;opacity:1;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);color:rgba(0,0,0,.87)}.mu-radio.disabled .mu-radio-icon-uncheck{color:rgba(0,0,0,.38)}.mu-radio-icon-checked{position:absolute;left:0;top:0;opacity:0;color:#7e57c2;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-radio.disabled .mu-radio-icon-checked{color:rgba(0,0,0,.38)}.mu-radio-ripple-wrapper{width:48px;height:48px;top:-12px;left:-12px}.mu-radio.label-left .mu-radio-ripple-wrapper{right:-12px;left:auto}.mu-switch{position:relative;display:inline-block;height:24px;line-height:24px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-switch input[type=checkbox]{display:none}.mu-switch input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-track{background-color:rgba(126,87,194,.5)}.mu-switch input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-thumb{background-color:#7e57c2;color:#7e57c2;-webkit-transform:translate3d(18px,0,0);transform:translate3d(18px,0,0)}.mu-switch.disabled input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-track{background-color:#bdbdbd}.mu-switch.disabled input[type=checkbox]:checked+.mu-switch-wrapper .mu-switch-thumb{background-color:#e0e0e0}.mu-switch *{pointer-events:none}.mu-switch.disabled{cursor:not-allowed}.mu-switch-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:24px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-switch-container{width:38px;padding:4px 0 4px 2px;position:relative;margin-right:8px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-switch.label-left .mu-switch-container{margin-right:0;margin-left:8px}.mu-switch.no-label .mu-switch-container{margin-left:0;margin-right:0}.mu-switch-label{color:rgba(0,0,0,.87)}.mu-switch.disabled .mu-switch-label{color:rgba(0,0,0,.38)}.mu-switch-track{width:100%;height:14px;border-radius:30px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-switch-track,.mu-switch.disabled .mu-switch-track{background-color:#bdbdbd}.mu-switch-thumb{position:absolute;top:1px;left:0;width:20px;height:20px;line-height:24px;color:rgba(0,0,0,.87);background-color:#f5f5f5;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,.117647),0 1px 4px rgba(0,0,0,.117647);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-switch.disabled .mu-switch-thumb{background-color:#e0e0e0}.mu-switch-ripple-wrapper{height:200%;width:200%;top:-10px;left:-10px}.mu-slider{width:100%;position:relative;height:24px;margin-bottom:16px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none}.mu-slider-track{right:0;background-color:#bdbdbd}.mu-slider-fill,.mu-slider-track{position:absolute;height:2px;left:0;top:50%;margin-top:-1px}.mu-slider-fill{width:100%;background-color:#7e57c2}.mu-slider.disabled .mu-slider-fill{background-color:#bdbdbd}.mu-slider-thumb{position:absolute;top:50%;width:12px;height:12px;background-color:#7e57c2;color:#7e57c2;border-radius:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transition:background .45s cubic-bezier(.23,1,.32,1),border-color .45s cubic-bezier(.23,1,.32,1),width .45s cubic-bezier(.23,1,.32,1),height .45s cubic-bezier(.23,1,.32,1);transition:background .45s cubic-bezier(.23,1,.32,1),border-color .45s cubic-bezier(.23,1,.32,1),width .45s cubic-bezier(.23,1,.32,1),height .45s cubic-bezier(.23,1,.32,1);cursor:pointer}.mu-slider.active .mu-slider-thumb{width:20px;height:20px}.mu-slider.disabled .mu-slider-thumb,.mu-slider.zero .mu-slider-thumb{border:2px solid #bdbdbd;color:#bdbdbd;background-color:#fff}.mu-slider.disabled .mu-slider-thumb .mu-focus-ripple-wrapper,.mu-slider.zero .mu-slider-thumb .mu-focus-ripple-wrapper{top:-14px;left:-14px}.mu-slider.disabled .mu-slider-thumb{cursor:default}.mu-slider-thumb .mu-focus-ripple-wrapper{width:36px;height:36px;top:-12px;left:-12px}.mu-linear-progress{position:relative;height:4px;display:block;width:100%;background-color:#bdbdbd;border-radius:2px;margin:0;overflow:hidden}.mu-linear-progress-indeterminate{width:40%;-webkit-animation:f .84s cubic-bezier(.445,.05,.55,.95);animation:f .84s cubic-bezier(.445,.05,.55,.95);-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.mu-linear-progress-determinate,.mu-linear-progress-indeterminate{position:absolute;top:0;bottom:0;border-radius:2px;background-color:#7e57c2}.mu-linear-progress-determinate{left:0;-webkit-transition:width .3s linear;transition:width .3s linear}@-webkit-keyframes f{0%{left:-40%}to{left:100%}}@keyframes f{0%{left:-40%}to{left:100%}}.mu-circular-progress{display:inline-block;position:relative;overflow:hidden}.mu-circular-progress-determinate{position:relative}.mu-circular-progress-determinate-path{stroke:#7e57c2;stroke-linecap:round;-webkit-transition:all .3s linear;transition:all .3s linear}.mu-grid-list{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.mu-grid-tile{position:relative;display:block;height:100%;overflow:hidden}.mu-grid-tile>img{height:100%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);position:relative;left:50%}.mu-grid-tile-titlebar{position:absolute;left:0;right:0;bottom:0;height:48px;background-color:rgba(0,0,0,.4);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-grid-tile.multiline .mu-grid-tile-titlebar{height:68px}.mu-grid-tile.top .mu-grid-tile-titlebar{bottom:auto;top:0}.mu-grid-tile-title-container{margin-left:16px;margin-right:0;color:#fff;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;overflow:hidden}.mu-grid-tile.action-left .mu-grid-tile-title-container{margin-right:16px;margin-left:0}.mu-grid-tile-action{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}.mu-grid-tile.action-left .mu-grid-tile-action{-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.mu-grid-tile-action .mu-icon{color:#fff}.mu-grid-tile-title{font-size:16px}.mu-grid-tile-subtitle,.mu-grid-tile-title{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;word-wrap:break-word}.mu-grid-tile-subtitle{font-size:12px}.mu-table{background-color:#fff;padding:0 24px;width:100%;border-collapse:collapse;border-spacing:0;table-layout:fixed}.mu-thead,.mu-tr{border-bottom:1px solid rgba(0,0,0,.12)}.mu-tr{color:rgba(0,0,0,.87);height:48px}.mu-tr:last-child{border-bottom:none}.mu-tr.selected{background-color:#f5f5f5}.mu-tr.hover{background-color:#eee}.mu-tr.stripe{background-color:hsla(0,0%,100%,.4)}.mu-tfoot .mu-tr{border-top:1px solid rgba(0,0,0,.12)}.mu-tr .mu-checkbox{vertical-align:middle}.mu-checkbox-col{width:72px}.mu-td{height:48px;font-size:13px;white-space:nowrap;text-overflow:ellipsis}.mu-td,.mu-th{padding-left:24px;padding-right:24px;text-align:left}.mu-th{font-weight:400;font-size:12px;height:56px;color:rgba(0,0,0,.54);position:relative}.mu-th-wrapper{position:relative;padding-top:12px;padding-bottom:12px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mu-date-picker{display:inline-block;position:relative;width:256px}.mu-date-picker.fullWidth{width:100%}.mu-date-picker-dialog{width:310px}.mu-date-picker-dialog.landscape{width:479px}.mu-date-picker-dialog.landscape .mu-dialog-body{min-height:330px;min-width:479px}.mu-date-picker-dialog .mu-dialog-body{padding:0;min-height:434px;min-width:310px}.mu-calendar{color:rgba(0,0,0,.87);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:310px}.mu-calendar-landspace{width:479px}.mu-calendar-container{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.mu-calendar-container,.mu-calendar-monthday-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal}.mu-calendar-monthday-container{-webkit-align-content:space-between;-ms-flex-line-pack:justify;align-content:space-between;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;font-size:12px;font-weight:400;padding:0 8px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-calendar-monthday-container,.mu-calendar-week{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-calendar-week{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;font-weight:500;height:20px;line-height:15px;opacity:.5;text-align:center}.mu-calendar-week-day{width:42px}.mu-calendar-monthday{position:relative;overflow:hidden;height:214px}.mu-calendar-monthday-slide{height:100%;width:100%}.mu-calendar-actions{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;margin:0;max-height:48px;padding:0}.mu-calendar-actions .mu-flat-button{min-width:64px;margin:4px 8px 8px 0}.mu-calendar-slide-next-enter-active,.mu-calendar-slide-next-leave-active,.mu-calendar-slide-prev-enter-active,.mu-calendar-slide-prev-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden;position:absolute;left:0;right:0;top:0}.mu-calendar-slide-next-enter{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.mu-calendar-slide-next-leave-active{opacity:0}.mu-calendar-slide-next-leave-active,.mu-calendar-slide-prev-enter{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.mu-calendar-slide-prev-leave-active{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);opacity:0}.mu-date-display{width:100%;font-weight:700;display:block;background-color:#7e57c2;border-top-left-radius:2px;border-top-right-radius:2px;border-bottom-left-radius:0;color:#fff;padding:20px}.mu-calendar-landspace .mu-date-display{width:165px;height:330px;float:left;border-top-right-radius:0;border-bottom-left-radius:2px}.mu-date-display-year{position:relative;overflow:hidden;margin:0;font-size:16px;font-weight:500;line-height:16px;height:16px;opacity:.7;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);margin-bottom:10px}.mu-date-display.selected-year .mu-date-display-year{opacity:1}.mu-date-display-year-title{cursor:pointer}.mu-date-display-year.disabled .mu-date-display-year-title{cursor:not-allowed}.mu-date-display-year-title .mu-date-display.selected-year{cursor:default}.mu-date-display-monthday{position:relative;display:block;overflow:hidden;font-size:36px;line-height:36px;height:38px;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);width:100%;font-weight:500}.mu-date-display.selected-year .mu-date-display-monthday{opacity:.7}.mu-calendar-landspace .mu-date-display-monthday{height:100%}.mu-date-display-slideIn-wrapper{position:absolute;height:100%;width:100%;top:0;left:0}.mu-date-display-monthday-title{cursor:default;width:100%;display:block}.mu-date-display.selected-year .mu-date-display-monthday-title{cursor:pointer}.mu-date-display-next-enter-active,.mu-date-display-next-leave-active,.mu-date-display-prev-enter-active,.mu-date-display-prev-leave-active{-webkit-transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1);transition:transform .45s cubic-bezier(.23,1,.32,1),opacity .45s cubic-bezier(.23,1,.32,1),-webkit-transform .45s cubic-bezier(.23,1,.32,1);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mu-date-display-next-enter{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);opacity:0}.mu-date-display-next-leave-active,.mu-date-display-prev-enter{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0}.mu-date-display-prev-leave-active{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);opacity:0}.mu-calendar-toolbar{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;height:48px}.mu-calendar-toolbar-title-wrapper{position:relative;overflow:hidden;height:100%;font-size:14px;font-weight:500;text-align:center;width:100%}.mu-calendar-toolbar-title{position:absolute;height:100%;width:100%;top:0;left:0;line-height:48px}.mu-calendar-svg-icon{display:block;fill:currentColor;height:24px;width:24px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-calendar-monthday-content{-webkit-box-orient:vertical;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;font-weight:400;height:228px;line-height:2;position:relative;text-align:center}.mu-calendar-monthday-content,.mu-calendar-monthday-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-direction:normal}.mu-calendar-monthday-row{-webkit-box-orient:horizontal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;height:34px;margin-bottom:2px}.mu-day-button{display:inline-block;background:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:none;text-decoration:none;cursor:pointer;margin:0;padding:4px 0;font-size:inherit;font-weight:400;position:relative;border:10px;width:42px}.mu-day-button.disabled{opacity:.4}.mu-day-empty{font-weight:400;padding:4px 0;position:relative;width:42px}.mu-day-button-bg{position:absolute;top:0;left:4px;height:34px;background-color:#7e57c2;border-radius:50%;opacity:0;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1);width:34px}.mu-day-button.hover .mu-day-button-bg,.mu-day-button.selected .mu-day-button-bg{-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}.mu-day-button.hover .mu-day-button-bg{opacity:.6}.mu-day-button.selected .mu-day-button-bg{opacity:1}.mu-day-button-text{font-weight:400;position:relative;color:rgba(0,0,0,.87)}.mu-day-button.now .mu-day-button-text{color:#7e57c2}.mu-day-button.hover .mu-day-button-text,.mu-day-button.selected .mu-day-button-text{color:#fff}.mu-calendar-year-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;margin-top:10px;width:310px;height:272px;overflow:hidden}.mu-calendar-year{background-color:#fff;height:inherit;line-height:35px;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;position:relative}.mu-calendar-year-list{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;min-height:100%}.mu-year-button{position:relative;display:block;background:none;cursor:pointer;outline:none;text-decoration:none;margin:0 auto;padding:0;border:10px;font-size:14px;font-weight:inherit;text-align:center;line-height:inherit}.mu-year-button-text{-webkit-align-self:center;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center;color:rgba(0,0,0,.87);font-size:17px;font-weight:400;position:relative;top:-1px}.mu-year-button.selected .mu-year-button-text{color:#7e57c2;font-size:26px;font-weight:500}.mu-year-button.hover .mu-year-button-text{color:#7e57c2}.mu-time-picker{display:inline-block;position:relative;width:256px}.mu-time-picker.fullWidth{width:100%}.mu-time-picker-dialog{width:280px}.mu-time-picker-dialog.landscape{width:479px}.mu-time-picker-dialog.landscape .mu-dialog-body{min-height:352px;min-width:479px}.mu-time-picker-dialog .mu-dialog-body{padding:0;min-height:450px;min-width:280px}.mu-clock{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:280px}.mu-clock-landspace{width:479px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-clock-container{height:280px;padding:10px;box-sizing:content-box;position:relative;padding-bottom:62px}.mu-clock-landspace .mu-clock-container{width:300px}.mu-clock-circle{position:absolute;top:20px;width:260px;height:260px;border-radius:100%;background-color:rgba(0,0,0,.07)}.mu-clock-landspace .mu-clock-circle{left:50%;margin-left:-130px}.mu-clock-actions{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;padding:8px;position:absolute;left:0;bottom:0;right:0}.mu-time-display{padding:14px 0;border-top-left-radius:2px;border-top-right-radius:2px;background-color:#7e57c2;color:#fff}.mu-clock-landspace .mu-time-display{width:179px;position:relative}.mu-time-display-text{margin:6px 0;line-height:58px;height:58px;font-size:58px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:baseline;-webkit-align-items:baseline;-ms-flex-align:baseline;align-items:baseline}.mu-clock-landspace .mu-time-display-text,.mu-time-display-text{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.mu-clock-landspace .mu-time-display-text{margin:0;position:absolute;left:0;right:0;top:0;bottom:0;height:auto;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;font-size:48px}.mu-time-display-affix{-webkit-box-flex:1;-webkit-flex:1 1;-ms-flex:1 1;flex:1 1;position:relative;line-height:17px;height:17px;font-size:17px}.mu-clock-landspace .mu-time-display-affix{-webkit-box-flex:0;-webkit-flex:none;-ms-flex:none;flex:none;height:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.mu-time-display-time{margin:0 10px}.mu-clock-landspace .mu-time-display-time{margin-top:-28px}.mu-time-display-clickable{cursor:pointer}.mu-time-display-clickable.inactive{opacity:.7}.mu-clock-landspace .mu-time-display-clickable{margin-top:8px}.mu-time-display-affix-top{position:absolute;top:-20px;left:0}.mu-clock-landspace .mu-time-display-affix-top{position:static;-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.mu-clock-hours{height:100%;width:100%;border-radius:100%;position:relative;pointer-events:none;box-sizing:border-box}.mu-clock-hours-mask{height:100%;width:100%;pointer-events:auto}.mu-clock-number{display:inline-block;width:32px;height:32px;line-height:24px;position:absolute;top:10px;text-align:center;padding-top:5px;font-size:1.1em;pointer-events:none;border-radius:100%;box-sizing:border-box;-webkit-transform:translateY(5px);-ms-transform:translateY(5px);transform:translateY(5px);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-clock-number.selected{background-color:#7e57c2;color:#fff}.mu-clock-number.inner{width:28px;height:28px}.mu-clock-pointer{height:40%;background-color:#7e57c2;width:2px;left:49%;position:absolute;bottom:50%;-webkit-transform-origin:center bottom 0;-ms-transform-origin:center bottom 0;transform-origin:center bottom 0;pointer-events:none}.mu-clock-pointer.inner{height:30%}.mu-clock-pointer-mark{box-sizing:content-box;background-color:#fff;border:4px solid #7e57c2;width:7px;height:7px;position:absolute;top:-5px;left:-6px;border-radius:100%}.mu-clock-pointer-mark.has-selected{display:none}.mu-clock-minutes{height:100%;width:100%;border-radius:100%;position:relative;pointer-events:none;box-sizing:border-box}.mu-clock-minutes-mask{height:100%;width:100%;pointer-events:auto}.mu-step{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;margin-left:-6px}.mu-stepper-vertical .mu-step{margin-top:-14px;margin-left:0}.mu-step:first-child{margin-left:0}.mu-step-button{border:10px;display:inline-block;cursor:pointer;text-decoration:none;margin:0;padding:0;outline:none;font-size:inherit;font-weight:inherit;-webkit-transform:translate(0);-ms-transform:translate(0);transform:translate(0);background-color:transparent;-webkit-transition:all .45s cubic-bezier(.23,1,.32,1) 0ms;transition:all .45s cubic-bezier(.23,1,.32,1) 0ms}.mu-stepper-vertical .mu-step-button{width:100%}.mu-step-button.hover{background-color:rgba(0,0,0,.06)}.mu-step-label{height:72px;color:rgba(0,0,0,.87);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:14px;padding-left:14px;padding-right:14px}.mu-stepper-vertical .mu-step-label{height:64px}.mu-step-label.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-step-label.active{font-weight:500}.mu-step-label-icon-container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin-right:8px;width:24px}.mu-step-label-icon{display:block;font-size:24px;width:24px;height:24px;color:#9e9e9e;fill:currentColor}.mu-step-label.disabled .mu-step-label-icon{color:#9e9e9e}.mu-step-label.active .mu-step-label-icon,.mu-step-label.completed .mu-step-label-icon{color:#7e57c2}.mu-step-label-circle{width:20px;height:20px;font-size:12px;line-height:20px;text-align:center;overflow:hidden;border-radius:100%;color:#fff}.mu-step-label-circle,.mu-step-label.disabled .mu-step-label-circle{background-color:#9e9e9e}.mu-step-label.active .mu-step-label-circle,.mu-step-label.completed .mu-step-label-circle{background-color:#7e57c2}.mu-step-content{margin-top:-14px;margin-left:25px;padding-left:21px;padding-right:16px;overflow:hidden}.mu-stepper-vertical .mu-step-content{border-left:1px solid #bdbdbd}.mu-step-content.last{border-left:none}.mu-step-content-inner{position:relative;width:100%;top:0;left:0;overflow:hidden}.mu-stepper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-content:center;-ms-flex-line-pack:center;align-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.mu-stepper-vertical{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch}.mu-step-connector{-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}.mu-stepper-vertical .mu-step-connector{margin-left:25px}.mu-step-connector-line{display:block;border-color:#bdbdbd;margin-left:-6px;border-top-style:solid;border-top-width:1px}.mu-stepper-vertical .mu-step-connector-line{border-top:none;border-left-style:solid;border-left-width:1px;min-height:28px;margin-left:0}.mu-auto-complete{display:inline-block;position:relative;width:256px}.mu-auto-complete.fullWidth{width:100%}.mu-auto-complete-menu-item{width:100%;overflow:hidden}.mu-pagination{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-pagination-svg-icon{display:inline-block;width:24px;height:24px;fill:currentColor;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mu-pagination-item,.mu-pagination-svg-icon{-webkit-transition:all .45s cubic-bezier(.23,1,.32,1);transition:all .45s cubic-bezier(.23,1,.32,1)}.mu-pagination-item{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;font-size:16px;height:32px;min-width:32px;padding-left:8px;padding-right:8px;line-height:32px;margin:0 8px;color:rgba(0,0,0,.87);position:relative;cursor:pointer;border-radius:2px}.mu-pagination-item.hover{background-color:rgba(0,0,0,.1)}.mu-pagination-item.active{color:#fff;background-color:#7e57c2}.mu-pagination-item.disabled{color:rgba(0,0,0,.38);cursor:not-allowed}.mu-pagination-item.circle,.mu-pagination-item.circle .mu-ripple-wrapper{border-radius:50%}.mu-pagination-item-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:100%;width:100%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.row{display:flex;justify-content:space-between;flex-wrap:wrap;align-items:flex-start}.row>[class*=col-]{box-sizing:border-box}@media (max-width:600px){.row .col-auto{width:100%}.row .col-100{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .col-100{width:100%}.row .col-95{width:95%;width:calc((100% - 16px*0.05263157894736836) / 1.0526315789473684)}.row.no-gutter .col-95{width:95%}.row .col-90{width:90%;width:calc((100% - 16px*0.11111111111111116) / 1.1111111111111112)}.row.no-gutter .col-90{width:90%}.row .col-85{width:85%;width:calc((100% - 16px*0.17647058823529416) / 1.1764705882352942)}.row.no-gutter .col-85{width:85%}.row .col-80{width:80%;width:calc((100% - 16px*0.25) / 1.25)}.row.no-gutter .col-80{width:80%}.row .col-75{width:75%;width:calc((100% - 16px*0.33333333333333326) / 1.3333333333333333)}.row.no-gutter .col-75{width:75%}.row .col-70{width:70%;width:calc((100% - 16px*0.4285714285714286) / 1.4285714285714286)}.row.no-gutter .col-70{width:70%}.row .col-66{width:66.66666666666666%;width:calc((100% - 16px*0.5000000000000002) / 1.5000000000000002)}.row.no-gutter .col-66{width:66.66666666666666%}.row .col-65{width:65%;width:calc((100% - 16px*0.5384615384615385) / 1.5384615384615385)}.row.no-gutter .col-65{width:65%}.row .col-60{width:60%;width:calc((100% - 16px*0.6666666666666667) / 1.6666666666666667)}.row.no-gutter .col-60{width:60%}.row .col-55{width:55%;width:calc((100% - 16px*0.8181818181818181) / 1.8181818181818181)}.row.no-gutter .col-55{width:55%}.row .col-50{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .col-50{width:50%}.row .col-45{width:45%;width:calc((100% - 16px*1.2222222222222223) / 2.2222222222222223)}.row.no-gutter .col-45{width:45%}.row .col-40{width:40%;width:calc((100% - 16px*1.5) / 2.5)}.row.no-gutter .col-40{width:40%}.row .col-35{width:35%;width:calc((100% - 16px*1.8571428571428572) / 2.857142857142857)}.row.no-gutter .col-35{width:35%}.row .col-33{width:33.333333333333336%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .col-33{width:33.333333333333336%}.row .col-30{width:30%;width:calc((100% - 16px*2.3333333333333335) / 3.3333333333333335)}.row.no-gutter .col-30{width:30%}.row .col-25{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .col-25{width:25%}.row .col-20{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .col-20{width:20%}.row .col-15{width:15%;width:calc((100% - 16px*5.666666666666667) / 6.666666666666667)}.row.no-gutter .col-15{width:15%}.row .col-10{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .col-10{width:10%}.row .col-5{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .col-5{width:5%}.row .col-auto:last-child,.row .col-auto:last-child~.col-auto{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .col-auto:last-child,.row.no-gutter .col-auto:last-child~.col-auto{width:100%}.row .col-auto:nth-last-child(2),.row .col-auto:nth-last-child(2)~.col-auto{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .col-auto:nth-last-child(2),.row.no-gutter .col-auto:nth-last-child(2)~.col-auto{width:50%}.row .col-auto:nth-last-child(3),.row .col-auto:nth-last-child(3)~.col-auto{width:33.33333333%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .col-auto:nth-last-child(3),.row.no-gutter .col-auto:nth-last-child(3)~.col-auto{width:33.33333333%}.row .col-auto:nth-last-child(4),.row .col-auto:nth-last-child(4)~.col-auto{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .col-auto:nth-last-child(4),.row.no-gutter .col-auto:nth-last-child(4)~.col-auto{width:25%}.row .col-auto:nth-last-child(5),.row .col-auto:nth-last-child(5)~.col-auto{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .col-auto:nth-last-child(5),.row.no-gutter .col-auto:nth-last-child(5)~.col-auto{width:20%}.row .col-auto:nth-last-child(6),.row .col-auto:nth-last-child(6)~.col-auto{width:16.66666667%;width:calc((100% - 16px*5) / 6)}.row.no-gutter .col-auto:nth-last-child(6),.row.no-gutter .col-auto:nth-last-child(6)~.col-auto{width:16.66666667%}.row .col-auto:nth-last-child(7),.row .col-auto:nth-last-child(7)~.col-auto{width:14.28571429%;width:calc((100% - 16px*6) / 7)}.row.no-gutter .col-auto:nth-last-child(7),.row.no-gutter .col-auto:nth-last-child(7)~.col-auto{width:14.28571429%}.row .col-auto:nth-last-child(8),.row .col-auto:nth-last-child(8)~.col-auto{width:12.5%;width:calc((100% - 16px*7) / 8)}.row.no-gutter .col-auto:nth-last-child(8),.row.no-gutter .col-auto:nth-last-child(8)~.col-auto{width:12.5%}.row .col-auto:nth-last-child(9),.row .col-auto:nth-last-child(9)~.col-auto{width:11.11111111%;width:calc((100% - 16px*8) / 9)}.row.no-gutter .col-auto:nth-last-child(9),.row.no-gutter .col-auto:nth-last-child(9)~.col-auto{width:11.11111111%}.row .col-auto:nth-last-child(10),.row .col-auto:nth-last-child(10)~.col-auto{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .col-auto:nth-last-child(10),.row.no-gutter .col-auto:nth-last-child(10)~.col-auto{width:10%}.row .col-auto:nth-last-child(11),.row .col-auto:nth-last-child(11)~.col-auto{width:9.09090909%;width:calc((100% - 16px*10) / 11)}.row.no-gutter .col-auto:nth-last-child(11),.row.no-gutter .col-auto:nth-last-child(11)~.col-auto{width:9.09090909%}.row .col-auto:nth-last-child(12),.row .col-auto:nth-last-child(12)~.col-auto{width:8.33333333%;width:calc((100% - 16px*11) / 12)}.row.no-gutter .col-auto:nth-last-child(12),.row.no-gutter .col-auto:nth-last-child(12)~.col-auto{width:8.33333333%}.row .col-auto:nth-last-child(13),.row .col-auto:nth-last-child(13)~.col-auto{width:7.69230769%;width:calc((100% - 16px*12) / 13)}.row.no-gutter .col-auto:nth-last-child(13),.row.no-gutter .col-auto:nth-last-child(13)~.col-auto{width:7.69230769%}.row .col-auto:nth-last-child(14),.row .col-auto:nth-last-child(14)~.col-auto{width:7.14285714%;width:calc((100% - 16px*13) / 14)}.row.no-gutter .col-auto:nth-last-child(14),.row.no-gutter .col-auto:nth-last-child(14)~.col-auto{width:7.14285714%}.row .col-auto:nth-last-child(15),.row .col-auto:nth-last-child(15)~.col-auto{width:6.66666667%;width:calc((100% - 16px*14) / 15)}.row.no-gutter .col-auto:nth-last-child(15),.row.no-gutter .col-auto:nth-last-child(15)~.col-auto{width:6.66666667%}.row .col-auto:nth-last-child(16),.row .col-auto:nth-last-child(16)~.col-auto{width:6.25%;width:calc((100% - 16px*15) / 16)}.row.no-gutter .col-auto:nth-last-child(16),.row.no-gutter .col-auto:nth-last-child(16)~.col-auto{width:6.25%}.row .col-auto:nth-last-child(17),.row .col-auto:nth-last-child(17)~.col-auto{width:5.88235294%;width:calc((100% - 16px*16) / 17)}.row.no-gutter .col-auto:nth-last-child(17),.row.no-gutter .col-auto:nth-last-child(17)~.col-auto{width:5.88235294%}.row .col-auto:nth-last-child(18),.row .col-auto:nth-last-child(18)~.col-auto{width:5.55555556%;width:calc((100% - 16px*17) / 18)}.row.no-gutter .col-auto:nth-last-child(18),.row.no-gutter .col-auto:nth-last-child(18)~.col-auto{width:5.55555556%}.row .col-auto:nth-last-child(19),.row .col-auto:nth-last-child(19)~.col-auto{width:5.26315789%;width:calc((100% - 16px*18) / 19)}.row.no-gutter .col-auto:nth-last-child(19),.row.no-gutter .col-auto:nth-last-child(19)~.col-auto{width:5.26315789%}.row .col-auto:nth-last-child(20),.row .col-auto:nth-last-child(20)~.col-auto{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .col-auto:nth-last-child(20),.row.no-gutter .col-auto:nth-last-child(20)~.col-auto{width:5%}.row .col-auto:nth-last-child(21),.row .col-auto:nth-last-child(21)~.col-auto{width:4.76190476%;width:calc((100% - 16px*20) / 21)}.row.no-gutter .col-auto:nth-last-child(21),.row.no-gutter .col-auto:nth-last-child(21)~.col-auto{width:4.76190476%}}@media (max-width:992px) and (min-width:601px){.row .tablet-100{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .tablet-100{width:100%}.row .tablet-95{width:95%;width:calc((100% - 16px*0.05263157894736836) / 1.0526315789473684)}.row.no-gutter .tablet-95{width:95%}.row .tablet-90{width:90%;width:calc((100% - 16px*0.11111111111111116) / 1.1111111111111112)}.row.no-gutter .tablet-90{width:90%}.row .tablet-85{width:85%;width:calc((100% - 16px*0.17647058823529416) / 1.1764705882352942)}.row.no-gutter .tablet-85{width:85%}.row .tablet-80{width:80%;width:calc((100% - 16px*0.25) / 1.25)}.row.no-gutter .tablet-80{width:80%}.row .tablet-75{width:75%;width:calc((100% - 16px*0.33333333333333326) / 1.3333333333333333)}.row.no-gutter .tablet-75{width:75%}.row .tablet-70{width:70%;width:calc((100% - 16px*0.4285714285714286) / 1.4285714285714286)}.row.no-gutter .tablet-70{width:70%}.row .tablet-66{width:66.66666666666666%;width:calc((100% - 16px*0.5000000000000002) / 1.5000000000000002)}.row.no-gutter .tablet-66{width:66.66666666666666%}.row .tablet-65{width:65%;width:calc((100% - 16px*0.5384615384615385) / 1.5384615384615385)}.row.no-gutter .tablet-65{width:65%}.row .tablet-60{width:60%;width:calc((100% - 16px*0.6666666666666667) / 1.6666666666666667)}.row.no-gutter .tablet-60{width:60%}.row .tablet-55{width:55%;width:calc((100% - 16px*0.8181818181818181) / 1.8181818181818181)}.row.no-gutter .tablet-55{width:55%}.row .tablet-50{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .tablet-50{width:50%}.row .tablet-45{width:45%;width:calc((100% - 16px*1.2222222222222223) / 2.2222222222222223)}.row.no-gutter .tablet-45{width:45%}.row .tablet-40{width:40%;width:calc((100% - 16px*1.5) / 2.5)}.row.no-gutter .tablet-40{width:40%}.row .tablet-35{width:35%;width:calc((100% - 16px*1.8571428571428572) / 2.857142857142857)}.row.no-gutter .tablet-35{width:35%}.row .tablet-33{width:33.333333333333336%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .tablet-33{width:33.333333333333336%}.row .tablet-30{width:30%;width:calc((100% - 16px*2.3333333333333335) / 3.3333333333333335)}.row.no-gutter .tablet-30{width:30%}.row .tablet-25{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .tablet-25{width:25%}.row .tablet-20{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .tablet-20{width:20%}.row .tablet-15{width:15%;width:calc((100% - 16px*5.666666666666667) / 6.666666666666667)}.row.no-gutter .tablet-15{width:15%}.row .tablet-10{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .tablet-10{width:10%}.row .tablet-5{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .tablet-5{width:5%}.row .tablet-auto:last-child,.row .tablet-auto:last-child~.col-auto{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .tablet-auto:last-child,.row.no-gutter .tablet-auto:last-child~.tablet-auto{width:100%}.row .tablet-auto:nth-last-child(2),.row .tablet-auto:nth-last-child(2)~.col-auto{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .tablet-auto:nth-last-child(2),.row.no-gutter .tablet-auto:nth-last-child(2)~.tablet-auto{width:50%}.row .tablet-auto:nth-last-child(3),.row .tablet-auto:nth-last-child(3)~.col-auto{width:33.33333333%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .tablet-auto:nth-last-child(3),.row.no-gutter .tablet-auto:nth-last-child(3)~.tablet-auto{width:33.33333333%}.row .tablet-auto:nth-last-child(4),.row .tablet-auto:nth-last-child(4)~.col-auto{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .tablet-auto:nth-last-child(4),.row.no-gutter .tablet-auto:nth-last-child(4)~.tablet-auto{width:25%}.row .tablet-auto:nth-last-child(5),.row .tablet-auto:nth-last-child(5)~.col-auto{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .tablet-auto:nth-last-child(5),.row.no-gutter .tablet-auto:nth-last-child(5)~.tablet-auto{width:20%}.row .tablet-auto:nth-last-child(6),.row .tablet-auto:nth-last-child(6)~.col-auto{width:16.66666667%;width:calc((100% - 16px*5) / 6)}.row.no-gutter .tablet-auto:nth-last-child(6),.row.no-gutter .tablet-auto:nth-last-child(6)~.tablet-auto{width:16.66666667%}.row .tablet-auto:nth-last-child(7),.row .tablet-auto:nth-last-child(7)~.col-auto{width:14.28571429%;width:calc((100% - 16px*6) / 7)}.row.no-gutter .tablet-auto:nth-last-child(7),.row.no-gutter .tablet-auto:nth-last-child(7)~.tablet-auto{width:14.28571429%}.row .tablet-auto:nth-last-child(8),.row .tablet-auto:nth-last-child(8)~.col-auto{width:12.5%;width:calc((100% - 16px*7) / 8)}.row.no-gutter .tablet-auto:nth-last-child(8),.row.no-gutter .tablet-auto:nth-last-child(8)~.tablet-auto{width:12.5%}.row .tablet-auto:nth-last-child(9),.row .tablet-auto:nth-last-child(9)~.col-auto{width:11.11111111%;width:calc((100% - 16px*8) / 9)}.row.no-gutter .tablet-auto:nth-last-child(9),.row.no-gutter .tablet-auto:nth-last-child(9)~.tablet-auto{width:11.11111111%}.row .tablet-auto:nth-last-child(10),.row .tablet-auto:nth-last-child(10)~.col-auto{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .tablet-auto:nth-last-child(10),.row.no-gutter .tablet-auto:nth-last-child(10)~.tablet-auto{width:10%}.row .tablet-auto:nth-last-child(11),.row .tablet-auto:nth-last-child(11)~.col-auto{width:9.09090909%;width:calc((100% - 16px*10) / 11)}.row.no-gutter .tablet-auto:nth-last-child(11),.row.no-gutter .tablet-auto:nth-last-child(11)~.tablet-auto{width:9.09090909%}.row .tablet-auto:nth-last-child(12),.row .tablet-auto:nth-last-child(12)~.col-auto{width:8.33333333%;width:calc((100% - 16px*11) / 12)}.row.no-gutter .tablet-auto:nth-last-child(12),.row.no-gutter .tablet-auto:nth-last-child(12)~.tablet-auto{width:8.33333333%}.row .tablet-auto:nth-last-child(13),.row .tablet-auto:nth-last-child(13)~.col-auto{width:7.69230769%;width:calc((100% - 16px*12) / 13)}.row.no-gutter .tablet-auto:nth-last-child(13),.row.no-gutter .tablet-auto:nth-last-child(13)~.tablet-auto{width:7.69230769%}.row .tablet-auto:nth-last-child(14),.row .tablet-auto:nth-last-child(14)~.col-auto{width:7.14285714%;width:calc((100% - 16px*13) / 14)}.row.no-gutter .tablet-auto:nth-last-child(14),.row.no-gutter .tablet-auto:nth-last-child(14)~.tablet-auto{width:7.14285714%}.row .tablet-auto:nth-last-child(15),.row .tablet-auto:nth-last-child(15)~.col-auto{width:6.66666667%;width:calc((100% - 16px*14) / 15)}.row.no-gutter .tablet-auto:nth-last-child(15),.row.no-gutter .tablet-auto:nth-last-child(15)~.tablet-auto{width:6.66666667%}.row .tablet-auto:nth-last-child(16),.row .tablet-auto:nth-last-child(16)~.col-auto{width:6.25%;width:calc((100% - 16px*15) / 16)}.row.no-gutter .tablet-auto:nth-last-child(16),.row.no-gutter .tablet-auto:nth-last-child(16)~.tablet-auto{width:6.25%}.row .tablet-auto:nth-last-child(17),.row .tablet-auto:nth-last-child(17)~.col-auto{width:5.88235294%;width:calc((100% - 16px*16) / 17)}.row.no-gutter .tablet-auto:nth-last-child(17),.row.no-gutter .tablet-auto:nth-last-child(17)~.tablet-auto{width:5.88235294%}.row .tablet-auto:nth-last-child(18),.row .tablet-auto:nth-last-child(18)~.col-auto{width:5.55555556%;width:calc((100% - 16px*17) / 18)}.row.no-gutter .tablet-auto:nth-last-child(18),.row.no-gutter .tablet-auto:nth-last-child(18)~.tablet-auto{width:5.55555556%}.row .tablet-auto:nth-last-child(19),.row .tablet-auto:nth-last-child(19)~.col-auto{width:5.26315789%;width:calc((100% - 16px*18) / 19)}.row.no-gutter .tablet-auto:nth-last-child(19),.row.no-gutter .tablet-auto:nth-last-child(19)~.tablet-auto{width:5.26315789%}.row .tablet-auto:nth-last-child(20),.row .tablet-auto:nth-last-child(20)~.col-auto{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .tablet-auto:nth-last-child(20),.row.no-gutter .tablet-auto:nth-last-child(20)~.tablet-auto{width:5%}.row .tablet-auto:nth-last-child(21),.row .tablet-auto:nth-last-child(21)~.col-auto{width:4.76190476%;width:calc((100% - 16px*20) / 21)}.row.no-gutter .tablet-auto:nth-last-child(21),.row.no-gutter .tablet-auto:nth-last-child(21)~.tablet-auto{width:4.76190476%}}@media (min-width:993px){.row .desktop-100{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .desktop-100{width:100%}.row .desktop-95{width:95%;width:calc((100% - 16px*0.05263157894736836) / 1.0526315789473684)}.row.no-gutter .desktop-95{width:95%}.row .desktop-90{width:90%;width:calc((100% - 16px*0.11111111111111116) / 1.1111111111111112)}.row.no-gutter .desktop-90{width:90%}.row .desktop-85{width:85%;width:calc((100% - 16px*0.17647058823529416) / 1.1764705882352942)}.row.no-gutter .desktop-85{width:85%}.row .desktop-80{width:80%;width:calc((100% - 16px*0.25) / 1.25)}.row.no-gutter .desktop-80{width:80%}.row .desktop-75{width:75%;width:calc((100% - 16px*0.33333333333333326) / 1.3333333333333333)}.row.no-gutter .desktop-75{width:75%}.row .desktop-70{width:70%;width:calc((100% - 16px*0.4285714285714286) / 1.4285714285714286)}.row.no-gutter .desktop-70{width:70%}.row .desktop-66{width:66.66666666666666%;width:calc((100% - 16px*0.5000000000000002) / 1.5000000000000002)}.row.no-gutter .desktop-66{width:66.66666666666666%}.row .desktop-65{width:65%;width:calc((100% - 16px*0.5384615384615385) / 1.5384615384615385)}.row.no-gutter .desktop-65{width:65%}.row .desktop-60{width:60%;width:calc((100% - 16px*0.6666666666666667) / 1.6666666666666667)}.row.no-gutter .desktop-60{width:60%}.row .desktop-55{width:55%;width:calc((100% - 16px*0.8181818181818181) / 1.8181818181818181)}.row.no-gutter .desktop-55{width:55%}.row .desktop-50{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .desktop-50{width:50%}.row .desktop-45{width:45%;width:calc((100% - 16px*1.2222222222222223) / 2.2222222222222223)}.row.no-gutter .desktop-45{width:45%}.row .desktop-40{width:40%;width:calc((100% - 16px*1.5) / 2.5)}.row.no-gutter .desktop-40{width:40%}.row .desktop-35{width:35%;width:calc((100% - 16px*1.8571428571428572) / 2.857142857142857)}.row.no-gutter .desktop-35{width:35%}.row .desktop-33{width:33.333333333333336%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .desktop-33{width:33.333333333333336%}.row .desktop-30{width:30%;width:calc((100% - 16px*2.3333333333333335) / 3.3333333333333335)}.row.no-gutter .desktop-30{width:30%}.row .desktop-25{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .desktop-25{width:25%}.row .desktop-20{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .desktop-20{width:20%}.row .desktop-15{width:15%;width:calc((100% - 16px*5.666666666666667) / 6.666666666666667)}.row.no-gutter .desktop-15{width:15%}.row .desktop-10{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .desktop-10{width:10%}.row .desktop-5{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .desktop-5{width:5%}.row .desktop-auto:last-child,.row .desktop-auto:last-child~.col-auto{width:100%;width:calc((100% - 16px*0) / 1)}.row.no-gutter .desktop-auto:last-child,.row.no-gutter .desktop-auto:last-child~.desktop-auto{width:100%}.row .desktop-auto:nth-last-child(2),.row .desktop-auto:nth-last-child(2)~.col-auto{width:50%;width:calc((100% - 16px*1) / 2)}.row.no-gutter .desktop-auto:nth-last-child(2),.row.no-gutter .desktop-auto:nth-last-child(2)~.desktop-auto{width:50%}.row .desktop-auto:nth-last-child(3),.row .desktop-auto:nth-last-child(3)~.col-auto{width:33.33333333%;width:calc((100% - 16px*2) / 3)}.row.no-gutter .desktop-auto:nth-last-child(3),.row.no-gutter .desktop-auto:nth-last-child(3)~.desktop-auto{width:33.33333333%}.row .desktop-auto:nth-last-child(4),.row .desktop-auto:nth-last-child(4)~.col-auto{width:25%;width:calc((100% - 16px*3) / 4)}.row.no-gutter .desktop-auto:nth-last-child(4),.row.no-gutter .desktop-auto:nth-last-child(4)~.desktop-auto{width:25%}.row .desktop-auto:nth-last-child(5),.row .desktop-auto:nth-last-child(5)~.col-auto{width:20%;width:calc((100% - 16px*4) / 5)}.row.no-gutter .desktop-auto:nth-last-child(5),.row.no-gutter .desktop-auto:nth-last-child(5)~.desktop-auto{width:20%}.row .desktop-auto:nth-last-child(6),.row .desktop-auto:nth-last-child(6)~.col-auto{width:16.66666667%;width:calc((100% - 16px*5) / 6)}.row.no-gutter .desktop-auto:nth-last-child(6),.row.no-gutter .desktop-auto:nth-last-child(6)~.desktop-auto{width:16.66666667%}.row .desktop-auto:nth-last-child(7),.row .desktop-auto:nth-last-child(7)~.col-auto{width:14.28571429%;width:calc((100% - 16px*6) / 7)}.row.no-gutter .desktop-auto:nth-last-child(7),.row.no-gutter .desktop-auto:nth-last-child(7)~.desktop-auto{width:14.28571429%}.row .desktop-auto:nth-last-child(8),.row .desktop-auto:nth-last-child(8)~.col-auto{width:12.5%;width:calc((100% - 16px*7) / 8)}.row.no-gutter .desktop-auto:nth-last-child(8),.row.no-gutter .desktop-auto:nth-last-child(8)~.desktop-auto{width:12.5%}.row .desktop-auto:nth-last-child(9),.row .desktop-auto:nth-last-child(9)~.col-auto{width:11.11111111%;width:calc((100% - 16px*8) / 9)}.row.no-gutter .desktop-auto:nth-last-child(9),.row.no-gutter .desktop-auto:nth-last-child(9)~.desktop-auto{width:11.11111111%}.row .desktop-auto:nth-last-child(10),.row .desktop-auto:nth-last-child(10)~.col-auto{width:10%;width:calc((100% - 16px*9) / 10)}.row.no-gutter .desktop-auto:nth-last-child(10),.row.no-gutter .desktop-auto:nth-last-child(10)~.desktop-auto{width:10%}.row .desktop-auto:nth-last-child(11),.row .desktop-auto:nth-last-child(11)~.col-auto{width:9.09090909%;width:calc((100% - 16px*10) / 11)}.row.no-gutter .desktop-auto:nth-last-child(11),.row.no-gutter .desktop-auto:nth-last-child(11)~.desktop-auto{width:9.09090909%}.row .desktop-auto:nth-last-child(12),.row .desktop-auto:nth-last-child(12)~.col-auto{width:8.33333333%;width:calc((100% - 16px*11) / 12)}.row.no-gutter .desktop-auto:nth-last-child(12),.row.no-gutter .desktop-auto:nth-last-child(12)~.desktop-auto{width:8.33333333%}.row .desktop-auto:nth-last-child(13),.row .desktop-auto:nth-last-child(13)~.col-auto{width:7.69230769%;width:calc((100% - 16px*12) / 13)}.row.no-gutter .desktop-auto:nth-last-child(13),.row.no-gutter .desktop-auto:nth-last-child(13)~.desktop-auto{width:7.69230769%}.row .desktop-auto:nth-last-child(14),.row .desktop-auto:nth-last-child(14)~.col-auto{width:7.14285714%;width:calc((100% - 16px*13) / 14)}.row.no-gutter .desktop-auto:nth-last-child(14),.row.no-gutter .desktop-auto:nth-last-child(14)~.desktop-auto{width:7.14285714%}.row .desktop-auto:nth-last-child(15),.row .desktop-auto:nth-last-child(15)~.col-auto{width:6.66666667%;width:calc((100% - 16px*14) / 15)}.row.no-gutter .desktop-auto:nth-last-child(15),.row.no-gutter .desktop-auto:nth-last-child(15)~.desktop-auto{width:6.66666667%}.row .desktop-auto:nth-last-child(16),.row .desktop-auto:nth-last-child(16)~.col-auto{width:6.25%;width:calc((100% - 16px*15) / 16)}.row.no-gutter .desktop-auto:nth-last-child(16),.row.no-gutter .desktop-auto:nth-last-child(16)~.desktop-auto{width:6.25%}.row .desktop-auto:nth-last-child(17),.row .desktop-auto:nth-last-child(17)~.col-auto{width:5.88235294%;width:calc((100% - 16px*16) / 17)}.row.no-gutter .desktop-auto:nth-last-child(17),.row.no-gutter .desktop-auto:nth-last-child(17)~.desktop-auto{width:5.88235294%}.row .desktop-auto:nth-last-child(18),.row .desktop-auto:nth-last-child(18)~.col-auto{width:5.55555556%;width:calc((100% - 16px*17) / 18)}.row.no-gutter .desktop-auto:nth-last-child(18),.row.no-gutter .desktop-auto:nth-last-child(18)~.desktop-auto{width:5.55555556%}.row .desktop-auto:nth-last-child(19),.row .desktop-auto:nth-last-child(19)~.col-auto{width:5.26315789%;width:calc((100% - 16px*18) / 19)}.row.no-gutter .desktop-auto:nth-last-child(19),.row.no-gutter .desktop-auto:nth-last-child(19)~.desktop-auto{width:5.26315789%}.row .desktop-auto:nth-last-child(20),.row .desktop-auto:nth-last-child(20)~.col-auto{width:5%;width:calc((100% - 16px*19) / 20)}.row.no-gutter .desktop-auto:nth-last-child(20),.row.no-gutter .desktop-auto:nth-last-child(20)~.desktop-auto{width:5%}.row .desktop-auto:nth-last-child(21),.row .desktop-auto:nth-last-child(21)~.col-auto{width:4.76190476%;width:calc((100% - 16px*20) / 21)}.row.no-gutter .desktop-auto:nth-last-child(21),.row.no-gutter .desktop-auto:nth-last-child(21)~.desktop-auto{width:4.76190476%}}.mu-flexbox{width:100%;text-align:left;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;box-align:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.mu-flexbox .mu-flexbox-item{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;min-width:20px;width:0}.mu-flexbox-item>.mu-flexbox{width:100%}.mu-flexbox .mu-flexbox-item:first-child{margin-left:0!important;margin-top:0!important}.mu-flex-col{box-orient:vertical;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column}.mu-flex-col>.mu-flexbox-item{width:100%}.mu-flex-row{box-direction:row;box-orient:horizontal;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(5, function() {
			var newContent = __webpack_require__(5);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(16),
  /* template */
  __webpack_require__(36),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\vue\\laoM\\vueDemo\\src\\components\\listComponent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] listComponent.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-764f2565", Component.options)
  } else {
    hotAPI.reload("data-v-764f2565", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router___ = __webpack_require__(17);


// var status = new Vue({});

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
	el: '#app',
	router: __WEBPACK_IMPORTED_MODULE_1__router___["a" /* default */],
	template: `<router-view></router-view>`
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __webpack_hash__ */
if(true) {
	var lastHash;
	var upToDate = function upToDate() {
		return lastHash.indexOf(__webpack_require__.h()) >= 0;
	};
	var check = function check() {
		module.hot.check().then(function(updatedModules) {
			if(!updatedModules) {
				console.warn("[HMR] Cannot find update. Need to do a full reload!");
				console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
				return;
			}

			return module.hot.apply({
				ignoreUnaccepted: true,
				ignoreDeclined: true,
				ignoreErrored: true,
				onUnaccepted: function(data) {
					console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
				},
				onDeclined: function(data) {
					console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
				},
				onErrored: function(data) {
					console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
				}
			}).then(function(renewedModules) {
				if(!upToDate()) {
					check();
				}

				__webpack_require__(42)(updatedModules, renewedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}
			});
		}).catch(function(err) {
			var status = module.hot.status();
			if(["abort", "fail"].indexOf(status) >= 0) {
				console.warn("[HMR] Cannot check for update. Need to do a full reload!");
				console.warn("[HMR] " + err.stack || err.message);
			} else {
				console.warn("[HMR] Update check failed: " + err.stack || err.message);
			}
		});
	};
	var hotEmitter = __webpack_require__(41);
	hotEmitter.on("webpackHotUpdate", function(currentHash) {
		lastHash = currentHash;
		if(!upToDate()) {
			var status = module.hot.status();
			if(status === "idle") {
				console.log("[HMR] Checking for updates on the server...");
				check();
			} else if(["abort", "fail"].indexOf(status) >= 0) {
				console.warn("[HMR] Cannot apply update as a previous update " + status + "ed. Need to do a full reload!");
			}
		}
	});
	console.log("[HMR] Waiting for update signal from WDS...");
} else {
	throw new Error("[HMR] Hot Module Replacement is disabled.");
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_common_css__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_common_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_common_css__);
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {};
	},
	methods: {
		revert() {
			// window.location.href='#/'
		}
	}

});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_detailComponent_css__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_detailComponent_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_detailComponent_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_common_css__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_common_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_common_css__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			apiUrl: "https://cnodejs.org/api/v1/topic/",
			datas: [],
			circle: true,
			message: ''
		};
	},
	created() {},
	computed: {},
	methods: {
		handleTabChange(val) {
			this.activeTab = val;
		},
		toggle(flag) {
			//弹出左边框
			console.log('111');
			this.open = !this.open;
			this.docked = !flag;
		},
		getdata() {

			var self = this;
			// console.log(this.apiUrl);
			$.ajax({
				url: self.apiUrl,
				type: "GET",
				dataType: 'json',
				success: function (res) {
					self.datas = res.data;
					console.log(self.datas);
					self.circle = false;
				},
				error: function (err) {
					console.log(err);
				}
			});
		},
		link() {
			window.location.href = '#/about/';
		},
		revert() {
			window.location.href = '#/';
		},
		send() {
			//发送消息
			const self = this;
			if (document.cookie) {
				const cookies = document.cookie.split('; ');
				for (let i = 0; i < cookies.length; i++) {
					let arr = cookies[i].split('=');
					if (arr[0] === 'name') {
						var acto = arr[1];
					} else if (arr[0] === 'id') {
						var replyId = arr[1];
					}
				}
				if (self.message != "") {
					// console.log()
					$.ajax({
						url: "https://cnodejs.org/api/v1/topic/" + self.$route.params.id + "/replies/",
						type: "POST",
						data: {
							accesstoken: acto,
							content: self.message
						},
						success: function (res) {
							console.log(res);
							self.message = '';
							self.getdata();
						},
						error: function (err) {
							console.log(err);
						}
					});
				}
			} else {
				$('.isSuccess').css("display", "block");
				setTimeout(function () {
					$('.isSuccess').css("display", "none");
				}, 1000);
			}
		}
	},
	mounted() {
		console.log(this.$route.params.id);
		//获取id,并赋值
		this.apiUrl += location.hash.split('/')[2];
		this.getdata();
		console.log(document.cookie);
	}
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_indexComponent_css__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_indexComponent_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_indexComponent_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__listComponent_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__listComponent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__listComponent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var status = new __WEBPACK_IMPORTED_MODULE_2_vue___default.a();
/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      activeTab: 'tab1',
      open: false,
      docked: true,
      mask: false,
      showPic: true,
      inputText: ""
    };
  },
  methods: {
    handleTabChange(val) {
      this.activeTab = val;
    },
    toggle(flag) {
      //弹出左边框
      this.open = !this.open;
      this.docked = !flag;
    },
    login() {
      // 弹出登陆窗口和遮罩层
      // console.log('denglu');
      this.mask = true;
      $('.alert').css("display", "block");
      // console.log(this.$el.querySelect('.alert-matte'))
    },
    about() {// 跳转到about页面

    },
    add() {
      // 省流量模式.
      this.showPic = !this.showPic;
    },
    mk() {
      //遮罩层
      this.mask = !this.mask;
      $('.alert').css("display", "none");
    },
    loginCnode() {
      //点击登录按钮
      // const inputText = $(event.target).prev().val();
      const self = this;
      $.ajax({
        url: 'https://cnodejs.org/api/v1/accesstoken/',
        type: "POST",
        data: {
          accesstoken: self.inputText
        },
        success: function (res) {
          if (res.success) {
            $('.lbtn1').css("display", 'none');
            $('.lbtn1').prev().css("display", 'none');
            $('.lbtn2').css("display", 'block');
            self.mask = false;
            $('.alert').css("display", "none");
            $('.isSuccess').css('display', 'block');
            $('.isSuccess').html('登陆成功');

            document.cookie = "name=" + self.inputText;
            document.cookie = "login=" + res.loginname;
            document.cookie = "src=" + res.avatar_url;
            document.cookie = "id=" + res.id;
            console.log(document.cookie);
            $('.mu-avatar-inner img').attr('src', res.avatar_url);
            $('.mu-item-title').html(res.loginname);
            setTimeout(function () {
              $('.isSuccess').css('display', 'none');
            }, 1000);
          }
        },
        error: function (err) {

          // console.log(err)
          self.mask = false;
          $('.alert').css("display", "none");
          $('.isSuccess').css('display', 'block');
          $('.isSuccess').html('登陆失败');
          setTimeout(function () {
            $('.isSuccess').css('display', 'none');
          }, 1000);
        }
      });
    },
    delCookie() {
      if (document.cookie) {
        var now = new Date();
        now.setDate(now.getDate() - 7);
        document.cookie = "name=" + '' + ";expires=" + now;
        document.cookie = "login=" + '' + ";expires=" + now;
        document.cookie = "src=" + '' + ";expires=" + now;
        document.cookie = "id=" + '' + ";expires=" + now;
        // console.log(document.cookie)
        this.mask = false;
        // console.log(document.cookie);
        $('.lbtn1').css("display", 'block');
        $('.lbtn1').prev().css("display", 'block');
        $('.lbtn2').css("display", 'none');
        $('.alert').css("display", "none");
        $('.mu-avatar-inner img').attr('src', './src/images/denglu.png');
        $('.mu-item-title').html("未登录");
      }
    }
  },
  mounted() {
    const self = this;
    if (document.cookie) {
      $('.lbtn1').css("display", 'none');
      $('.lbtn1').prev().css("display", 'none');
      $('.lbtn2').css("display", 'block');

      const cookies = document.cookie.split("; ");
      // console.log(cookies);
      for (let i = 0; i < cookies.length; i++) {
        let arr = cookies[i].split('=');
        if (arr[0] === 'login') {
          $('.mu-item-title').html(arr[1]);
        } else if (arr[0] === 'src') {
          $('.mu-avatar-inner img').attr('src', arr[1]);
        }
      }
    }
  },
  components: {
    "listBest": __WEBPACK_IMPORTED_MODULE_1__listComponent_vue___default.a
  }
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data() {
		return {
			open: false,
			docked: true,
			apiUrl: "https://cnodejs.org/api/v1/topics",
			datas: [],
			num: 10, //每一页加载的数量
			loading: false,
			scroller: null,
			pages: 1,
			circle: true
		};
	},
	watch: {
		name() {
			var self = this;
			this.circle = true;
			this.pages = 1;
			$.ajax({
				url: self.apiUrl,
				type: "GET",
				dataType: 'json',
				data: {
					page: self.pages,
					tab: self.name,
					limit: self.num
				},
				success: function (res) {
					self.datas = res.data;
					// self.pages++;
					self.circle = false;
					console.log(self.pages);
					console.log(self.datas);
				}
			});
		}
	},
	created() {
		// status.$on('showPic',function(data){

		// console.log(666+data);
		// })
	},
	props: ['name', "show"],
	methods: {
		login() {
			console.log('denglu');
		},
		about() {},
		loadMore() {
			this.loading = true;
			this.pages++;
			const self = this;
			setTimeout(() => {
				$.ajax({
					type: "GET",
					url: self.apiUrl,
					dataType: 'json',
					data: {
						limit: self.num,
						page: self.pages,
						tab: self.name
					},
					success: function (res) {
						var a = self.datas.concat(res.data);

						self.datas = a;
						console.log(self.pages);
						self.circle = false;
					},
					error: function (err) {
						console.log(err);
					}
				});
				this.loading = false;
			}, 2000);
		}
	},
	mounted() {
		var self = this;
		$.ajax({
			url: self.apiUrl,
			type: "GET",
			dataType: 'json',
			data: {
				page: self.pages,
				tab: self.name,
				limit: self.num
			},
			success: function (res) {
				self.datas = res.data;
				// self.pages++;
				self.circle = false;
				console.log(self.datas);
			}
		});
	}
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_muse_ui__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_muse_ui___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_muse_ui__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_muse_ui_css__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_muse_ui_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__css_muse_ui_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_indexComponent_vue__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_indexComponent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_indexComponent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_listComponent_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_listComponent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_listComponent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_detailComponent_vue__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_detailComponent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_detailComponent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_userComponent_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_userComponent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_userComponent_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_aboutComponent_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_aboutComponent_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_aboutComponent_vue__);


__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);



__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_muse_ui___default.a);

window.$ = __webpack_require__(19);






const router = new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
	routes: [{
		path: '/',
		name: 'index',
		component: __WEBPACK_IMPORTED_MODULE_4__components_indexComponent_vue___default.a,
		children: [{
			path: 'list/',
			component: __WEBPACK_IMPORTED_MODULE_5__components_listComponent_vue___default.a
		}]
	}, {
		path: '/detail/:id',
		name: 'detail',
		component: __WEBPACK_IMPORTED_MODULE_6__components_detailComponent_vue___default.a
	}, {
		path: '/user/',
		name: 'user',
		component: __WEBPACK_IMPORTED_MODULE_7__components_userComponent_vue___default.a
	}, {
		path: '/about/',
		name: 'about',
		component: __WEBPACK_IMPORTED_MODULE_8__components_aboutComponent_vue___default.a
	}]
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Muse UI v2.0.3 (https://github.com/myronliu347/vue-carbon)
 * (c) 2017 Myron Liu 
 * Released under the MIT License.
 */
!function(t,e){ true?module.exports=e(__webpack_require__(1)):"function"==typeof define&&define.amd?define(["vue"],e):"object"==typeof exports?exports.MuseUI=e(require("vue")):t.MuseUI=e(t.Vue)}(this,function(t){return function(t){function e(i){if(n[i])return n[i].exports;var a=n[i]={i:i,l:!1,exports:{}};return t[i].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=542)}([function(t,e){t.exports=function(t,e,n,i){var a,r=t=t||{},s=typeof t.default;"object"!==s&&"function"!==s||(a=t,r=t.default);var o="function"==typeof r?r.options:r;if(e&&(o.render=e.render,o.staticRenderFns=e.staticRenderFns),n&&(o._scopeId=n),i){var l=Object.create(o.computed||null);Object.keys(i).forEach(function(t){var e=i[t];l[t]=function(){return e}}),o.computed=l}return{esModule:a,exports:r,options:o}}},function(t,e,n){"use strict";function i(t){return void 0!==t&&null!==t}function a(t){return void 0===t||null===t}function r(t){for(var e=1,n=arguments.length;e<n;e++){var i=arguments[e];for(var a in i)if(i.hasOwnProperty(a)){var r=i[a];void 0!==r&&(t[a]=r)}}return t}function s(t){var e=String(t);return e&&e.indexOf("%")===-1&&e.indexOf("px")===-1&&(e+="px"),e}function o(){for(var t="undefined"!=typeof navigator?navigator.userAgent:"",e=["Android","iPhone","Windows Phone","iPad","iPod"],n=!0,i=0;i<e.length;i++)if(t.indexOf(e[i])>0){n=!1;break}return n}function l(){if(!o()){var t=[],e=window.devicePixelRatio||1;t.push("pixel-ratio-"+Math.floor(e)),e>=2&&t.push("retina");var n=document.getElementsByTagName("html")[0];t.forEach(function(t){return n.classList.add(t)})}}function u(t){var e=[];if(!t)return e;if(t instanceof Array)e=e.concat(t);else if(t instanceof Object)for(var n in t)t[n]&&e.push(n);else e=e.concat(t.split(" "));return e}var c=n(61),d=n.n(c),f=n(125);n.d(e,"d",function(){return p}),e.c=i,e.h=a,e.b=r,e.e=s,e.g=o,e.a=l,e.f=u;var h=d()(f),p=function(t){return t?h.indexOf(t)!==-1?f[t]:t:""}},function(t,e,n){"use strict";var i=n(404),a=n.n(i);n.d(e,"a",function(){return a.a})},function(t,e,n){"use strict";function i(){p||("undefined"!=typeof window&&window.addEventListener("keydown",function(t){h="tab"===u()(t)}),p=!0)}var a=n(32),r=n.n(a),s=n(78),o=n.n(s),l=n(17),u=n.n(l),c=n(1),d=n(57),f=n(5),h=!1,p=!1;e.a={mixins:[f.a],props:{href:{type:String,default:""},disabled:{type:Boolean,default:!1},disableFocusRipple:{type:Boolean,default:!1},disableKeyboardFocus:{type:Boolean,default:!1},disableTouchRipple:{type:Boolean,default:!1},rippleColor:{type:String,default:""},rippleOpacity:{type:Number},centerRipple:{type:Boolean,default:!0},wrapperClass:{type:String,default:""},wrapperStyle:{type:[String,Object]},containerElement:{type:String},tabIndex:{type:Number,default:0},type:{type:String,default:"button"},keyboardFocused:{type:Boolean,default:!1}},data:function(){return{hover:!1,isKeyboardFocused:!1}},computed:{buttonClass:function(){var t=[];return this.disabled&&t.push("disabled"),this.disabled||!this.hover&&!this.isKeyboardFocused||t.push("hover"),t.join(" ")}},beforeMount:function(){var t=this.disabled,e=this.disableKeyboardFocus,n=this.keyboardFocused;t||!n||e||(this.isKeyboardFocused=!0)},mounted:function(){i(),this.isKeyboardFocused&&(this.$el.focus(),this.$emit("keyboardFocus",!0))},beforeUpdate:function(){(this.disabled||this.disableKeyboardFocus)&&this.isKeyboardFocused&&(this.isKeyboardFocused=!1,this.$emit("keyboardFocus",!1))},beforeDestory:function(){this.cancelFocusTimeout()},methods:{handleHover:function(t){!this.disabled&&n.i(c.g)()&&(this.hover=!0,this.$emit("hover",t))},handleOut:function(t){!this.disabled&&n.i(c.g)()&&(this.hover=!1,this.$emit("hoverExit",t))},removeKeyboardFocus:function(t){this.isKeyboardFocused&&(this.isKeyboardFocused=!1,this.$emit("KeyboardFocus",!1))},setKeyboardFocus:function(t){this.isKeyboardFocused||(this.isKeyboardFocused=!0,this.$emit("KeyboardFocus",!0))},cancelFocusTimeout:function(){this.focusTimeout&&(clearTimeout(this.focusTimeout),this.focusTimeout=null)},handleKeydown:function(t){this.disabled||this.disableKeyboardFocus||("enter"===u()(t)&&this.isKeyboardFocused&&this.$el.click(),"esc"===u()(t)&&this.isKeyboardFocused&&this.removeKeyboardFocus(t))},handleKeyup:function(t){this.disabled||this.disableKeyboardFocus||"space"===u()(t)&&this.isKeyboardFocused},handleFocus:function(t){var e=this;this.disabled||this.disableKeyboardFocus||(this.focusTimeout=setTimeout(function(){h&&(e.setKeyboardFocus(t),h=!1)},150))},handleBlur:function(t){this.cancelFocusTimeout(),this.removeKeyboardFocus(t)},handleClick:function(t){this.disabled||(h=!1,this.$el.blur(),this.removeKeyboardFocus(t),this.$emit("click",t))},getTagName:function(){var t="undefined"!=typeof navigator&&navigator.userAgent.toLowerCase().indexOf("firefox")!==-1,e=t?"span":"button";switch(!0){case!!this.to:return"router-link";case!!this.href:return"a";case!!this.containerElement:return this.containerElement;default:return e}},createButtonChildren:function(t){var e=this.isKeyboardFocused,n=this.disabled,i=this.disableFocusRipple,a=this.disableKeyboardFocus,s=this.rippleColor,l=this.rippleOpacity,u=this.disableTouchRipple,c=[];c=c.concat(this.$slots.default);var f=!e||d.a.disableFocusRipple||n||i||a?void 0:t(o.a,{color:s,opacity:l});return c=n||u||d.a.disableTouchRipple?[t("div",{class:this.wrapperClass,style:this.wrapperStyle},this.$slots.default)]:[t(r.a,{class:this.wrapperClass,style:this.wrapperStyle,props:{color:this.rippleColor,centerRipple:this.centerRipple,opacity:this.rippleOpacity}},this.$slots.default)],c.unshift(f),c}},watch:{disabled:function(t){t||(this.hover=!1)}},render:function(t){var e={disabled:this.disabled,type:this.type},n=this.to?{to:this.to,tag:this.tag,activeClass:this.activeClass,event:this.event,exact:this.exact,append:this.append,replace:this.replace}:{};return this.href&&(e.href=this.disabled?"javascript:;":this.href),this.disabled||(e.tabIndex=this.tabIndex),t(this.getTagName(),{class:this.buttonClass,domProps:e,props:n,style:{"user-select":this.disabled?"":"none","-webkit-user-select":this.disabled?"":"none",outline:"none",cursor:this.disabled?"":"pointer",appearance:"none"},on:{mouseenter:this.handleHover,mouseleave:this.handleOut,touchend:this.handleOut,touchcancel:this.handleOut,click:this.handleClick,focus:this.handleFocus,blur:this.handleBlur,keydown:this.handleKeydown,keyup:this.handleKeyup}},this.createButtonChildren(t))}}},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e,n){"use strict";e.a={props:{to:{type:[String,Object]},tag:{type:String,default:"a"},activeClass:{type:String,default:"router-link-active"},event:{type:[String,Array],default:"click"},exact:Boolean,append:Boolean,replace:Boolean}}},function(t,e,n){var i=n(47)("wks"),a=n(31),r=n(7).Symbol,s="function"==typeof r;(t.exports=function(t){return i[t]||(i[t]=s&&r[t]||(s?r:a)("Symbol."+t))}).store=i},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){"use strict";var i=n(416),a=n.n(i);n.d(e,"a",function(){return a.a})},function(t,e,n){t.exports=!n(14)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var i=n(19),a=n(69),r=n(50),s=Object.defineProperty;e.f=n(9)?Object.defineProperty:function(t,e,n){if(i(t),e=r(e,!0),i(n),a)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var i=n(70),a=n(41);t.exports=function(t){return i(a(t))}},function(t,e,n){"use strict";var i=n(439),a=n.n(i);n.d(e,"a",function(){return a.a})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var i=n(11),a=n(30);t.exports=n(9)?function(t,e,n){return i.f(t,e,a(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var i=n(74),a=n(42);t.exports=Object.keys||function(t){return i(t,a)}},function(t,e){e=t.exports=function(t){if(t&&"object"==typeof t){var e=t.which||t.keyCode||t.charCode;e&&(t=e)}if("number"==typeof t)return r[t];var a=String(t),s=n[a.toLowerCase()];if(s)return s;var s=i[a.toLowerCase()];return s?s:1===a.length?a.charCodeAt(0):void 0};var n=e.code=e.codes={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,"pause/break":19,"caps lock":20,esc:27,space:32,"page up":33,"page down":34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,delete:46,command:91,"left command":91,"right command":93,"numpad *":106,"numpad +":107,"numpad -":109,"numpad .":110,"numpad /":111,"num lock":144,"scroll lock":145,"my computer":182,"my calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222},i=e.aliases={windows:91,"⇧":16,"⌥":18,"⌃":17,"⌘":91,ctl:17,control:17,option:18,pause:19,break:19,caps:20,return:13,escape:27,spc:32,pgup:33,pgdn:34,ins:45,del:46,cmd:91};/*!
 * Programatically add the following
 */

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(6, function() {
			var newContent = __webpack_require__(6);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(7, function() {
			var newContent = __webpack_require__(7);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(8, function() {
			var newContent = __webpack_require__(8);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAATtSURBVGjevZl/aJVVGMc/992mm1NmDdqEfmyOUlvqfiGVVBJE4TQ9GSNYMVg5kiIpC5OxNTTplzONolqgNtSsjKdCSUtCSA3RnG4TWa2cUdoqcZZsc2b1x7a7c+593/e+5857n3/uOc+v7/ec97nnPec9IeIQVcIMiphOATmk08/vdNJOC61yxDZXyAp4JhUsY6yv0wCNfCjHrjABdTWPs9pqaLW8LeeuCAGVxyoetgIfli3UyqlREVDjWc1TcYEPyxvUyV9xElD389mowIdlgXxuTUBl0OQ78Uf5lk7OMsAYsingVkp8vDdTI30WBFQeHYxxNe3mHXbIP65RKZRTQ7lr3ABTpCsgAVXKYdckVWyWf4khKsRDvE+ai6lMvgtAQN3OfpfghWJVD+o+vnBRz5YDpsJxGX00fB1pdvAgu3BYFqXer0p9Z0DlcTIqqCj4uhY1nGkcj5rlfL0WjBlQ4+iIcD5AVvzwICcYz+4I5fdqnAcBmiIqfyt3+S0igSj0Mpf3DFUaTSMdbXqilp1tVPrXvIL5TOGYfOVPQoVo4jFDFS7pMAGVRY/hcojZcsk37TWcJgWAn5gpF3x9U/iSuw3VVdID+iNYGRFzrz88sGEIHiazyt9VLrMwQrXSmIGo6p8lh2LAo/4zIGK+V9UMzHLOl66RGTBH8GpseHuRVuoMxYswREDlRrx2VgXK2Ky1GwJFrDF6lSp3eAaqDUOVf0GF5UlODLX28FKgOehnkaGohhCoFMx3W7pcDEQAUGXk0yGtgf1TMUs7NQRqJkc11XOyJmi6eEQt1pchihygwvDYkkh44BOjVxFS0K9ttE/K5AQTQB1kVrhz0SHL2Oc3JhoeeFNrj02lwDB+bTWWYjZQRAvVctQi7Bu94zDDMHZZwE/lCEVAMS3qJgsCv5oEigxjn0WiWq39fPAwucRZncB0zbZPLPCNbXiJTSD7dAJ6DXRYpYlfOnUCOZrhjyQR+FMnkK4ZBpJEQFuOHfo1Q0aSCGiDdujWDDnWqeITDcfRC4LCJBGYphNo1wylKgnoCuboBFoM64QkMMggVSfQZhhvTAKBfL3j8KNhLLdKFZ/cYxI4b6z/9UmoguVau88RWKspUhP9ENR1TNK6jQ7wkeHxRILH/6jR+9gBjhuqpSqB/wSVyQuG4rgDcpkVhvKRBI7fPCOvkMuDB5ONhvotVRA4od34s1lnKDYOnYyk2zhmwR0JGv96o9cs3SOH03rDFOy13OPR9hr/XCoNRT2ECcgptmmmYHvj1z3H5gZ/AzsNxbrBz9gjHyhqODjUmiu/BSKwPXzafYUYm0mVxQ8RqobBH6sLi3hFZXKYqYZqvuwYbDhx5LOFn8iRCPjmYXj0F2NUYBmL6OUD6WQUogqIjO9lyUjH+3P9s7w21KyUrXHDPxBxGgbI029RvD7X53JG6+6lSn62Bp9EE/Oi1CVibIG8asA8683hlHpZTbQAz1QNnHaBv82E956BYtxuADexVtqIIepmllLjaiqOPkV7EUhlwLM+1vOp7HWNupMFPOMRdYFCt8foXYTXsyfG5uQcbZyhn3RyuYVsX99NLJF+N4P/rZn7rYe9zJOdXibfhUh2kRn+M8YrjUzwhg92c3otDREbqaCyiTr5xd8l6N1xFost52I578r52G52t+eFPMjTZPk6/c1atkt7wJT8D2wpNb6ZEDyPAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA1LTE1VDEwOjMyOjEzKzA4OjAw5DufxgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNS0xNVQxMDozMjoxMyswODowMJVmJ3oAAAAASUVORK5CYII="

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAQ8SURBVGje7Zl9aFV1GMc/Z7vXmq45aNM/5qhJNRZZ64VqbDgSzPXP8EGkJJJcEphl2R/lgqjQLIlKqSB6cfaCpGgP0YshKeGwhCUM1ssiArWRYaFRc81s3v44v/O75957rt5zbucMquf+8Xyf53d+5/me5zy/l/O78L/818Upp7NMpZ0UA/rLJBCQRrZzozGO0637o92nMmL42RxiljWr6GmZGN6XGAFxGKImzzmv5bzhPeHvVREpAdfSEODtlVuTInCTRdXqcKe13pGZyRCYYfQOPQn6Botty7pkCNQbfdxVuoM+41ku9eFuFY3AHKMPWc8aixbGTkAcrjHwG8+nx9hm4APxZ2CGRV/7vK8Zfbmk4ybQadFhn/cri2pjJSDZSt+rp3wNv1k0Ld4MtHKpQc/m+DMWhVpfQhKQCltskDvxZsNOxJmB+7jMoFU5LwBSFp2OjYAIG63xal5jtUXjMRGQu3nXGh2aH6bRopNhCKT8hqQQ2jnfOjIcZKeeAGmizzf8HgrYfsw1+ndWyzjjnLK/cQZ1tBgBX8XKErYGXrOW2dzuszeyWgvzMxK4ROfLYR7jbfWVqSUgd/BmSTl7lHUB4es5FiLv1+tAHgGp4+eSui7Q3UHukul70qYHXODVgNimPb4JNsVSX6cNrNViBXYFmwHH/CqopJI0aaZQxTRqqGd6zvWfS7V7L4/AzUZv09tynmwrHwOwir7ihQT6cCmPLbO4h15jLHGXL4+AN4qH8/ocAaBTI+14C2iO8IjUsgKAB10Cpc0DP/4T4Y3sNLrFVdF2ROXIlFwzeQLmyb1hmzABWWAX8e2uSpXUr4xPWJnJT4ENrySVgeZA7xYdCpOBcqSfZdQB4NDFPOO9wGuOnYBm2GKNZ6SX9QAskpT+BcmPgrcsMlNf0gSyxwGZySHQZtHoJBCQNJsN3OVtShIkIM3spsoYz3nemCciGbMh/XKCvR6MOwNVgd52PRMuA9HlapoMamSTQWeyn/WxE9BBBj0s+/kCgAqmMuZ5kxwF2W2v73AwSQJXWvTH5BBYafSAuwokTECa6TLweb8//uUYkCZu4SVr7joHAemgH4A1usG4Ik1EctCepvnlcf3Vbxa8ApluwsPTMr+sB784wDfMU7mOwhpoBbyP7aWUIXqhOuqow1x7YjDEdfrnuQi4y+QyIDty75dQJ195RPpZZOCc7ARUnMAgRy0Br3BWMCoZeV26JVrR1lmUyW8qIKATtPAy8Bmt+n1OUw/vcVoy8pH0yEWlRxfHDrwPC08WvPOBF7jXeBrUfglKJZvs9FEoY3zAAb7lSz1ylvANPMFdxpivnxQj0MmnkZIbTtL+OdAV7xX088NZuzazkoj/i1lpLwzvPyNqYKRoV3s+ILV0sZAI/w3Rre8Huf2nZDU8aSshK/tYrt8VdpQbuIo2OrikhOAvsl6Plpm/f638DcxC+onALWjIAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA1LTEyVDIxOjU0OjM3KzA4OjAw6/QChwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNS0xMlQyMTo1NDozNyswODowMJqpujsAAAAASUVORK5CYII="

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBQwVNiVLD3bmAAAETUlEQVRo3u2YW2xUVRSGvxYhjTUaaRTQWFNAZHyYBi9VKSHFUBK8VJYRMIqVRG0Q7wghGqGkJiZGDIopLaEPthZbI2RRRR+sKFAl3mIEb2PxTjTYlAiKkRjo+MDM6T7XnjMzzDzIepn1n732/v9ZZ1/WPnDa/u82KjfDyNjY5lh3rDT2XmKoIAJiO6gFqqmIbUvkX4CMYlPKreTMRG+UvsU5SUDS8FfIY/kXYLe1cldhBcBLclNhBcDrMqOwAqBP4oUQ0G/4e2ViITKwwPC/l3F5F6CvcZ8Bv5Nz8p0BtJXVFjiLPVKSZwHAU2yw/MvokYD99pQIUHgQteAc2qTIL/aMzGlkGpVcTpzJuKaaDslt9FGVgos5yOPeoxQR2WQS81lOmWdjv15qxZWynwlWyzJdl7UAKeYOWigNCDEEgJQxaLTV68vuDqHngIyWRzhBRyC9w/QQ5QbskBsyFiDz+Jd1Po2HGeQQf/AX/7gkHCBmwO1S7YwI8QrkfLq4zvW4mS26M5T4Kj4yYFy/iCRAZrLL8egzHtXd4TKXGqOWtw1YoT+FFiANbLQ9+JV5+mkU8tQ4C+k24DgdCCVAGllje9Cgm8jQZCnNFjhCuf550g3YJKWJRgMmmaqRyk27JT6JFVGTAiWMTWw/6fquAnmIVQbcxdnaT3bWRI/lz0k7PgJkLi8YsIvZejQ7doFmbrbg1rTjeRbIxbxlwG4WacT7joc1ssTyvxzOrscklGISXGLB95mlx7Nl95uC3q/gXoM+yfU5oF9g0MOUYXqPDMh5DNiC92dNb9+GJuqPZqt7DphLb5E/vVxJNTVc66gFbKchgFTZ6ON2epcAmcD9FtjNZg/i0cxnOdNC/vuptnNghv0c8MrAA4Z/pzqHu4LV1IWjBpCL+MaAN+oH7hibACnhCQus0V9sbbPpMOqbMPRlmCPU65teUfYMmPc54/SXa9jKBQFcBxnvoi9lnwGXeVVDbgHDL+DJ9FKR8Wz0TPsrKO/o4VRU0t4oY9hhSH5G/YoZU4CMMbbK1Kkn9bS7+jxPm34VkA+kmC6utmC7X0XszECF5b2rAyDn8iq1jvh6OjVJoAms5xYL9nJ3UA9TQJXlPQdSyeeO2AbaRiIHYJWxlL+mTk8EBZsCaizvQ5lrO46gh3t0kBAmS2iywFGm67HgeG8Bs9hii7pdu8KQA9Bi+JP1yEjhpoD054Q9Dvq4e//ytSmGP0l/H7mDVz0w3YYu1N9C05tWqT+ECRvpcmrUr5Fspu4LFxh8MyrPkL5O+8KGBgm4Sg9kRL9Y3wgf7C9gaSYXEGCFtkcJ9xOwl9ZItKkqn2d1bTS9poBvDf/WUHvesC1kA4OsZGU0eltNKC1W4bxeH446UKZmZmCn5T2dL3q7gPSk6wyzg50KAT+nfiNOo5wJ0ON0AhB+589xBqAVeDEH98CMBXwMbMsnveMDRWIodozexN/5lXDaCmz/AXbHGgobP4+/AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA1LTEyVDIxOjU0OjM3KzA4OjAw6/QChwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNS0xMlQyMTo1NDozNyswODowMJqpujsAAAAASUVORK5CYII="

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBQwJDSVigcPKAAACX0lEQVRo3u2XzUtUURiHnyzQTC0bbRzEhUEfA8HM5NiQUi3cuKjFG0XUIjfiohb9G+1qIW2ijZtahG/CFNqiRGqSaawUkREEhT4Ml1H0CbWLdO6Ze++Z0U3n3d33d97zPBzuZc6Aq/+9ttmPCpzjKoeYZFhzWy4gjRQ4+PfxHhfVap/tlvhaJkj90zhCJD5e3CoBqeMpvRuaGaLxR+EVLARkJ1NkPII0HfFs8fcmC0g9z+kyhCn2x8fCKYQUkF1MkyizIMHhuIZRCPUVSAN54r7LRrmgvzZBQBp4xYFAS7Oc1Z9VFpBGZukMbPuYM/qjigLSxDwdgfEAk/Tr9yoJyB4WiIXCA+To029VEJBmFmkNjQcocFK/Vigge1mi2QoPMEePfqlAQCIs02iNByjSrZ8tBaSFt9RVhAdYJqmfTGFNGXwrq0b8CY/eoGFtJwuyO7SARFljhyHs1WelTb3DgGF9O0tieI8MAtLGR+PR9JjuPzrCJcNMCysSCSwgMVaN+OP6wpihdzlviJp4Lx4fs4eAtPPBSMjoNGVL7yOGqJY1ifoKSD3vjLsf0zy+pQ84bQxXpNbvBAaNw9360h8PoA/pN0R1XPYTuGYYTWshGB5AJ+gzRFf8BLx/dI7qTHA8gD7hlGfQ5icw6jGU0tfh8AA6VXJzBhjzE7he0knqm/B4AM153J5v+AjoPEPrGgmdtcMDaJ70usaALvqdAHqbLsYBuMk+nbPHA+gMMYYByJLUkY25/X/Dkqu3Wu1VYzNUzXICTsAJOAEn4AScgBNwAk7ACTgBJ+AE7AVu+TwHrD9Qs4hffk9gbwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNS0xMlQwOToxMzozNyswODowMAKcfbwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDUtMTJUMDk6MTM6MzcrMDg6MDBzwcUAAAAAAElFTkSuQmCC"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphNTMwYzhmMi05MDQ5LTQ0YTktYjU1MS04NDIzZmMxNjEzY2YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUEyODg5OUJENENCMTFFNTk2QTBGNDA5NzZDQjU2MEUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUEyODg5OUFENENCMTFFNTk2QTBGNDA5NzZDQjU2MEUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNTMwYzhmMi05MDQ5LTQ0YTktYjU1MS04NDIzZmMxNjEzY2YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YTUzMGM4ZjItOTA0OS00NGE5LWI1NTEtODQyM2ZjMTYxM2Nm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"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfhBQ8KIA1n7SBoAAAEBklEQVRo3u2YX4hVVRTGf3MnmUyLTJG0pBz/0E0c7cFqwsmXCh1SWU5WRC/DlElEEzXSZPhQDNUUCdIYhtofSywUliQEmolmExTRIGhcxiKjRoj+CJqUTmkPRt1Ze5999jn32kPNd19mfXuf/X2z9j57r31gGMP4v6Mm/6NyBTcxi2mMYZCjHKJP9/1LBmQW7bR6m47xBG/ob+fRgNzAZqakdHqOLj15HgzIxbzMvZGdF+u7VTYg13Ioi116aNczVTMgjXycSR5gD816qioGZDZ9meUBdtGsf4Q61EbJj+fLXPIwhZGl90MdChHyNai3oZfbqdWacz+m8bi31wq5JTR6xBTIHWx1yC9o0ZLTE1p51TPERfpr7gxInUf+KWa48qDoa0z2DLK8ggzI3WwxVKd2B58Yy4/xOUjJgMBaQ+2gO/yM/sR0h0xcB2lTMInLDNOmpEEP85ihVuQ1MM/EXfpDqj7AKyZukgvzGVho4o1R8uhJ1hlqUj4DzSb+Js4A8LaJp/u7BQ1IgdFDiL16NtpAv4mvzpMBu1H3E48TJh6bx4DdJYLHioHNVYJS2IAVnEw8Rpn452oYmC/xBqzZIzkMKOw01OXRBhaZOGH9pL2Gtq67M05dRrDSUAkvcJqBD0y8RkYRg6Um7s15GHHYYboi/v/xbDZU4gGWYkDP8JChHpGUaZA69jhkYlmWXpJtcph35J6A/CXsY4YhH0y+K6UWpaXTxQFnRbcUryruLXkKbplLP1c69JJS4hYWUxMWOEjR0/ACG7Ts5ZIFdDPT0+9G/SR59Kh7gUxkILHxBEcYydTE9g59MTR27MXkOj6P62mwnmXhCiriXgCgfczJIb+R5WkFXKQB0M+od47YMFZyX9Uup1KgndWZMzDAQk25U8YtwgY+pS6z/DmsplMHKzIgDzgFZjb8QoN+ndOAFFgbulhFY6725jAgF7CNxcGBD1LiGCOYyBzGBHvept7zIGBAatjCXQmNyjrd5TwxgRaeNZX0P2jSj7IZeJpV3oYOekIfXmQ2a7jZ2zRVv4o2IAt4z0O/TrseJxXSxIce+hSX2nMxYSOScV75RdoaIw+6n9Fsc+g6nrFUwnFc3OA512b65jAJpcHiVmqdy21jcXvp+3LCOwXSwAHXk++bSBqkiyetM4rl54N/CnocZl4eeWAVOwxzDY3loceA1NNkh1HfkoqAnvV82h1SH/gycL/DPJ9PHkCPM99QjTIhYEBq6TRUs57ObwDY6XzmLKsx3QzUO4yz42XMASwz1KMhA+NM/LBmuZT7sd/EZV9LXAP2Dre9Ynn0d14aQuwOGNCjvFkWvqXfVm4Au4w7QhmANtb/9dcm2qoij37H9X8Ht+qBCoYaxn8OfwJXVPat9fkhcwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNS0xNVQxMDozMjoxMyswODowMOQ7n8YAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDUtMTVUMTA6MzI6MTMrMDg6MDCVZid6AAAAAElFTkSuQmCC"

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(13),
  /* template */
  __webpack_require__(35),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\vue\\laoM\\vueDemo\\src\\components\\aboutComponent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] aboutComponent.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ac05ffa", Component.options)
  } else {
    hotAPI.reload("data-v-5ac05ffa", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(14),
  /* template */
  __webpack_require__(38),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\vue\\laoM\\vueDemo\\src\\components\\detailComponent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] detailComponent.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d1dd85dc", Component.options)
  } else {
    hotAPI.reload("data-v-d1dd85dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(15),
  /* template */
  __webpack_require__(37),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\vue\\laoM\\vueDemo\\src\\components\\indexComponent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] indexComponent.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7fc1d2d5", Component.options)
  } else {
    hotAPI.reload("data-v-7fc1d2d5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  null,
  /* template */
  null,
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\vue\\laoM\\vueDemo\\src\\components\\userComponent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}

module.exports = Component.exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('mu-appbar', {
    attrs: {
      "title": "关于"
    }
  }, [_c('mu-icon-button', {
    attrs: {
      "icon": "close"
    },
    on: {
      "click": _vm.revert
    },
    slot: "left"
  }), _vm._v(" "), _c('mu-icon-menu', {
    attrs: {
      "icon": "more_vert"
    },
    slot: "right"
  }, [_c('mu-menu-item', {
    staticClass: "menuItem2",
    attrs: {
      "title": "关于"
    }
  })], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-5ac05ffa", module.exports)
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.circle == true) ? _c('div', {
    staticStyle: {
      "text-align": "center",
      "margin-top": "70px"
    }
  }, [_c('mu-circular-progress', {
    attrs: {
      "size": 40
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.circle == false) ? _c('ul', {
    staticClass: "list"
  }, [_vm._l((_vm.datas), function(item, index) {
    return _c('li', {
      key: index
    }, [_c('router-link', {
      attrs: {
        "to": '/detail/' + item.id
      }
    }, [_c('h3', {
      staticClass: "top"
    }, [_c('span', {
      class: item.top == true ? 'topics' : (item.good == true ? 'good' : item.tab)
    }, [_vm._v("\n\t\t    \t\t\t\t" + _vm._s(item.top == true ? "置顶" : (item.tab == "ask" ? "问答" : (item.tab == "job" ? "招聘" : (item.good == true ? "精华" : "分享")))) + "\n\t\t    \t\t\t")]), _vm._v("\n\t\t\t\t\t\t" + _vm._s(item.title) + "\n\t\t    \t\t")]), _vm._v(" "), _c('div', {
      staticClass: "status"
    }, [(_vm.show == true) ? _c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.author.avatar_url
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "detail"
    }, [_c('div', [_c('span', [_vm._v(_vm._s(item.reply_count) + "/" + _vm._s(item.visit_count))]), _vm._v(" "), _c('span', {
      domProps: {
        "textContent": _vm._s(item.author.loginname)
      }
    })]), _vm._v(" "), _c('div', [_c('span', {
      domProps: {
        "textContent": _vm._s(item.last_reply_at.substr(0, 10))
      }
    }), _vm._v(" "), _c('span', {
      domProps: {
        "textContent": _vm._s(item.create_at.substr(0, 10))
      }
    })])])])])], 1)
  }), _vm._v(" "), _c('mu-infinite-scroll', {
    attrs: {
      "scroller": _vm.scroller,
      "loading": _vm.loading
    },
    on: {
      "load": _vm.loadMore
    }
  })], 2) : _vm._e(), _vm._v(" "), (_vm.circle == false) ? _c('div', {
    staticClass: "updata",
    on: {
      "click": function($event) {
        _vm.loadMore()
      }
    }
  }, [_vm._v("点击加载更多")]) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-764f2565", module.exports)
  }
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('mu-appbar', [_c('mu-icon-button', {
    attrs: {
      "icon": "menu"
    },
    on: {
      "click": function($event) {
        _vm.toggle()
      }
    },
    slot: "left"
  }), _vm._v(" "), _c('mu-drawer', {
    attrs: {
      "open": _vm.open,
      "docked": _vm.docked
    },
    on: {
      "close": function($event) {
        _vm.toggle()
      }
    }
  }, [_c('mu-list', {
    on: {
      "itemClick": function($event) {
        _vm.docked ? '' : _vm.toggle()
      }
    }
  }, [_c('mu-appbar', {
    attrs: {
      "title": "Title"
    }
  }, [(_vm.docked) ? _c('mu-icon-button', {
    attrs: {
      "icon": "close"
    },
    nativeOn: {
      "click": function($event) {
        _vm.open = false
      }
    }
  }) : _vm._e(), _vm._v(" "), _c('mu-flat-button', {
    attrs: {
      "label": "CNode"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticStyle: {
      "margin-top": "60px"
    }
  }, [_c('i', {
    staticClass: "logo",
    attrs: {
      "data-v-43f57338": ""
    }
  })]), _vm._v(" "), _c('div', [_c('mu-list-item', {
    attrs: {
      "title": "未登录",
      "disabled": ""
    }
  }, [_c('mu-avatar', {
    attrs: {
      "backgroundColor": "#fff",
      "src": "./src/images/denglu.png"
    },
    slot: "left"
  })], 1)], 1), _vm._v(" "), _c('div', {
    staticStyle: {
      "margin-left": "20px"
    }
  }, [_vm._v("\n           \t\t省流量\n             \t"), _c('mu-switch', {
    staticClass: "demo-switch",
    staticStyle: {
      "margin-left": "100px"
    },
    on: {
      "input": _vm.add
    }
  })], 1)], 1)], 1), _vm._v(" "), _c('mu-tabs', {
    attrs: {
      "value": _vm.activeTab
    },
    on: {
      "change": _vm.handleTabChange
    }
  }, [_c('mu-tab', {
    attrs: {
      "value": "tab1",
      "title": "全部"
    }
  }), _vm._v(" "), _c('mu-tab', {
    attrs: {
      "value": "tab2",
      "title": "精华"
    }
  }), _vm._v(" "), _c('mu-tab', {
    attrs: {
      "value": "tab3",
      "title": "分享"
    }
  }), _vm._v(" "), _c('mu-tab', {
    attrs: {
      "value": "tab4",
      "title": "问答"
    }
  }), _vm._v(" "), _c('mu-tab', {
    attrs: {
      "value": "tab5",
      "title": "招聘"
    }
  })], 1), _vm._v(" "), _c('mu-icon-menu', {
    attrs: {
      "icon": "more_vert"
    },
    slot: "right"
  }, [_c('mu-menu-item', {
    staticClass: "menuItem1",
    attrs: {
      "title": "登陆"
    },
    on: {
      "click": function($event) {
        _vm.login()
      }
    }
  }), _vm._v(" "), _c('mu-menu-item', {
    staticClass: "menuItem2",
    attrs: {
      "title": "关于"
    },
    on: {
      "click": function($event) {
        _vm.about()
      }
    }
  })], 1)], 1), _vm._v(" "), (_vm.mask) ? _c('div', {
    staticClass: "alert-matte",
    on: {
      "click": _vm.mk
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "isSuccess",
    staticStyle: {
      "display": "none"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "login-dialog alert",
    staticStyle: {
      "display": "none"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.inputText),
      expression: "inputText"
    }],
    staticClass: "count",
    attrs: {
      "type": "text",
      "placeholder": "AccessToken"
    },
    domProps: {
      "value": (_vm.inputText)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.inputText = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    staticClass: "lbtn lbtn1",
    on: {
      "click": _vm.loginCnode
    }
  }, [_vm._v("登 陆")]), _vm._v(" "), _c('button', {
    staticClass: "lbtn lbtn2",
    staticStyle: {
      "display": "none"
    },
    on: {
      "click": _vm.delCookie
    }
  }, [_vm._v("退 出 登 陆")])]), _vm._v(" "), (_vm.activeTab === 'tab1') ? _c('div', [_c('listBest', {
    attrs: {
      "show": _vm.showPic
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.activeTab === 'tab2') ? _c('div', [_c('listBest', {
    attrs: {
      "name": "good",
      "show": _vm.showPic
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.activeTab === 'tab3') ? _c('div', [_c('listBest', {
    attrs: {
      "name": "share",
      "show": _vm.showPic
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.activeTab === 'tab4') ? _c('div', [_c('listBest', {
    attrs: {
      "name": "ask",
      "show": _vm.showPic
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.activeTab === 'tab5') ? _c('div', [_c('listBest', {
    attrs: {
      "name": "job",
      "show": _vm.showPic
    }
  })], 1) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-7fc1d2d5", module.exports)
  }
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('mu-appbar', {
    attrs: {
      "title": "detail"
    }
  }, [_c('mu-icon-button', {
    attrs: {
      "icon": "close"
    },
    on: {
      "click": _vm.revert
    },
    slot: "left"
  }), _vm._v(" "), _c('mu-icon-menu', {
    attrs: {
      "icon": "more_vert"
    },
    slot: "right"
  }, [_c('mu-menu-item', {
    staticClass: "menuItem2",
    attrs: {
      "title": "关于"
    },
    on: {
      "click": _vm.link
    }
  })], 1)], 1), _vm._v(" "), (_vm.circle == true) ? _c('div', {
    staticStyle: {
      "text-align": "center",
      "margin-top": "60px"
    }
  }, [_c('mu-circular-progress', {
    attrs: {
      "size": 40
    }
  })], 1) : _c('div', [_c('h2', {
    staticClass: "topic-title",
    domProps: {
      "textContent": _vm._s(_vm.datas.title)
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "section"
  }, [_c('div', {
    staticClass: "status"
  }, [_c('img', {
    staticClass: "avatar",
    attrs: {
      "src": _vm.datas.author.avatar_url
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "detail"
  }, [_c('div', [_c('span', {
    class: _vm.datas.top == true ? 'topics' : _vm.datas.tab
  }, [_vm._v("\n\t\t    \t\t\t\t" + _vm._s(_vm.datas.top == true ? "置顶" : (_vm.datas.tab == "ask" ? "问答" : (_vm.datas.tab == "job" ? "招聘" : (_vm.datas.tab == "share" ? "精华" : "分享")))) + "\n\t\t    \t\t\t")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.datas.author.loginname))])]), _vm._v(" "), _c('div', [_c('span', [_vm._v(_vm._s(_vm.datas.visit_count ? _vm.datas.visit_count : '') + "次浏览")]), _vm._v(" "), _c('span', [_vm._v("发布于:" + _vm._s(_vm.datas.create_at.substr(0, 10)))])])])])]), _vm._v(" "), _c('div', {
    staticClass: "markdown-body"
  }, [_c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.datas.content)
    }
  })]), _vm._v(" "), _c('h3', {
    staticClass: "subtitle"
  }, [_c('strong', {
    domProps: {
      "textContent": _vm._s(_vm.datas.replies.length)
    }
  }), _vm._v("\n\t\t\t个回复\n\t\t")]), _vm._v(" "), _c('section', {
    staticClass: "reply-list"
  }, _vm._l((_vm.datas.replies), function(item, index) {
    return _c('div', {
      key: index,
      staticClass: "reply-box"
    }, [_c('div', {
      staticClass: "status"
    }, [_c('img', {
      staticClass: "avatar",
      attrs: {
        "src": item.author.avatar_url
      }
    }), _vm._v(" "), _c('i', {
      staticClass: "icon-repost"
    }, [_c('span')]), _vm._v(" "), _c('i', {
      staticClass: "icon-like"
    }, [_c('span'), _vm._v("\n\t\t\t\t\t\t" + _vm._s(item.ups.length) + "\n\t\t\t\t\t")]), _vm._v(" "), _c('div', {
      staticClass: "detail"
    }, [_c('div', {
      domProps: {
        "textContent": _vm._s(item.author.loginname)
      }
    }), _vm._v(" "), _c('div', {
      domProps: {
        "textContent": _vm._s(item.create_at.substr(0, 10))
      }
    })])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('div', {
      domProps: {
        "innerHTML": _vm._s(item.content)
      }
    })])
  })), _vm._v(" "), _c('div', {
    staticClass: "myReply"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.message),
      expression: "message"
    }],
    attrs: {
      "type": "text",
      "placeholder": "回复内容"
    },
    domProps: {
      "value": (_vm.message)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.message = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    on: {
      "click": function($event) {
        _vm.send()
      }
    }
  }, [_vm._v("回复")])]), _vm._v(" "), _c('a', {
    staticClass: "totop",
    attrs: {
      "href": "javascript:scroll(0,0)"
    }
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(28),
      "alt": ""
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "isSuccess",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("请登录")])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-d1dd85dc", module.exports)
  }
}

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.5.3
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed) { return }
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this.$root._route }
  });

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$1(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var normalizedPath = normalizePath(path, parent);
  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
      });
    } else {
      var aliasRoute = {
        path: route.alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
    }
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path) {
  var regex = index(path);
  if (process.env.NODE_ENV !== 'production') {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        position = getElementPosition(el);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    if (called) { return }
    called = true;
    return fn.apply(this, arguments)
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, this$1.current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path;
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#');
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  );
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.5.3';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(21)))

/***/ }),
/* 40 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(18);
module.exports = new EventEmitter();


/***/ }),
/* 42 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});

	if(unacceptedModules.length > 0) {
		console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
		unacceptedModules.forEach(function(moduleId) {
			console.warn("[HMR]  - " + moduleId);
		});
	}

	if(!renewedModules || renewedModules.length === 0) {
		console.log("[HMR] Nothing hot updated.");
	} else {
		console.log("[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			console.log("[HMR]  - " + moduleId);
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if(numberIds)
			console.log("[HMR] Consider using the NamedModulesPlugin for module names.");
	}
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(12);
module.exports = __webpack_require__(11);


/***/ })
/******/ ]);