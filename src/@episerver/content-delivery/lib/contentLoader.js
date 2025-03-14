"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _api;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLoader = void 0;
const apiClient_1 = require("./apiClient");
const config_1 = require("./config");
/**
 * Class for loading content.
 */
class ContentLoader {
    /**
     * Constructs an instance of ContentLoader.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config) {
        _api.set(this, void 0);
        __classPrivateFieldSet(this, _api, new apiClient_1.ApiClient(Object.assign(Object.assign({}, config_1.defaultConfig), config)));
    }
    /**
     * Get content by an identifier.
     *
     * @param id - Identifier of the content.
     * @param request - Additional request parameters.
     * @returns A promise with a ContentData if the content was found, otherwise rejected with a ContentLoaderError.
     */
    getContent(id, request) {
        const parameters = __classPrivateFieldGet(this, _api).getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand);
        const headers = __classPrivateFieldGet(this, _api).getDefaultHeaders(request === null || request === void 0 ? void 0 : request.branch);
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get(`/content/${encodeURIComponent(id)}`, parameters, headers).then((response) => {
                if (response.ok) {
                    resolve(response.data);
                }
                else {
                    reject(mapResponseToError(response));
                }
            }).catch((error) => {
                reject(mapToError(error));
            });
        });
    }
    /**
     * Get children by a parent identifier.
     *
     * @param id - Identifier of the parent content.
     * @param request - Additional request parameters.
     * @returns A promise with an array of ContentData or a ContentCollection if 'top'
     * or a 'continuationToken' is provided. Otherwise rejected with a ContentLoaderError.
     */
    getChildren(id, request) {
        let parameters = __classPrivateFieldGet(this, _api).getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand);
        let headers = __classPrivateFieldGet(this, _api).getDefaultHeaders(request === null || request === void 0 ? void 0 : request.branch);
        if ((request === null || request === void 0 ? void 0 : request.top) || (request === null || request === void 0 ? void 0 : request.continuationToken)) {
            if (request === null || request === void 0 ? void 0 : request.top)
                parameters = Object.assign(Object.assign({}, parameters), { top: request === null || request === void 0 ? void 0 : request.top });
            if (request === null || request === void 0 ? void 0 : request.continuationToken)
                headers = Object.assign(Object.assign({}, headers), { 'x-epi-continuation': request.continuationToken });
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _api).get(`/content/${encodeURIComponent(id)}/children`, parameters, headers).then((response) => {
                    if (response.ok) {
                        resolve({
                            items: response.data,
                            continuationToken: response.headers.get('x-epi-continuation')
                        });
                    }
                    else {
                        reject(mapResponseToError(response));
                    }
                }).catch((error) => {
                    reject(mapToError(error));
                });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _api).get(`/content/${encodeURIComponent(id)}/children`, parameters, headers).then((response) => {
                    if (response.ok) {
                        resolve(response.data);
                    }
                    else {
                        reject(mapResponseToError(response));
                    }
                }).catch((error) => {
                    reject(mapToError(error));
                });
            });
        }
    }
    /**
     * Get ancestors by a parent identifier.
     *
     * @param parentId - Identifier of the content.
     * @param request - Additional request parameters.
     * @returns A promise with an array of ContentData, otherwise rejected with a ContentLoaderError.
     */
    getAncestors(id, request) {
        const parameters = __classPrivateFieldGet(this, _api).getDefaultParameters(request === null || request === void 0 ? void 0 : request.select, request === null || request === void 0 ? void 0 : request.expand);
        const headers = __classPrivateFieldGet(this, _api).getDefaultHeaders(request === null || request === void 0 ? void 0 : request.branch);
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _api).get(`/content/${encodeURIComponent(id)}/ancestors`, parameters, headers).then((response) => {
                if (response.ok) {
                    resolve(response.data);
                }
                else {
                    reject(mapResponseToError(response));
                }
            }).catch((error) => {
                reject(mapToError(error));
            });
        });
    }
}
exports.ContentLoader = ContentLoader;
_api = new WeakMap();
function mapResponseToError(response) {
    return {
        errorCode: response.status,
        errorMessage: response.statusText,
    };
}
function mapToError(error) {
    return {
        errorMessage: error.statusText,
    };
}
//# sourceMappingURL=contentLoader.js.map