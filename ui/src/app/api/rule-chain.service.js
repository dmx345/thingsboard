/*
 * Copyright © 2016-2018 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export default angular.module('thingsboard.api.ruleChain', [])
    .factory('ruleChainService', RuleChainService).name;

/*@ngInject*/
function RuleChainService($http, $q, $filter, types, componentDescriptorService) {

    var ruleNodeComponents = null;

    var service = {
        getSystemRuleChains: getSystemRuleChains,
        getTenantRuleChains: getTenantRuleChains,
        getRuleChains: getRuleChains,
        getRuleChain: getRuleChain,
        saveRuleChain: saveRuleChain,
        deleteRuleChain: deleteRuleChain,
        getRuleChainMetaData: getRuleChainMetaData,
        saveRuleChainMetaData: saveRuleChainMetaData,
        getRuleNodeComponents: getRuleNodeComponents,
        getRuleNodeComponentByClazz: getRuleNodeComponentByClazz,
        getRuleNodeSupportedLinks: getRuleNodeSupportedLinks,
        resolveTargetRuleChains: resolveTargetRuleChains
    };

    return service;

    function getSystemRuleChains (pageLink, config) {
        var deferred = $q.defer();
        var url = '/api/system/ruleChains?limit=' + pageLink.limit;
        if (angular.isDefined(pageLink.textSearch)) {
            url += '&textSearch=' + pageLink.textSearch;
        }
        if (angular.isDefined(pageLink.idOffset)) {
            url += '&idOffset=' + pageLink.idOffset;
        }
        if (angular.isDefined(pageLink.textOffset)) {
            url += '&textOffset=' + pageLink.textOffset;
        }
        $http.get(url, config).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function getTenantRuleChains (pageLink, config) {
        var deferred = $q.defer();
        var url = '/api/tenant/ruleChains?limit=' + pageLink.limit;
        if (angular.isDefined(pageLink.textSearch)) {
            url += '&textSearch=' + pageLink.textSearch;
        }
        if (angular.isDefined(pageLink.idOffset)) {
            url += '&idOffset=' + pageLink.idOffset;
        }
        if (angular.isDefined(pageLink.textOffset)) {
            url += '&textOffset=' + pageLink.textOffset;
        }
        $http.get(url, config).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function getRuleChains (pageLink, config) {
        var deferred = $q.defer();
        var url = '/api/ruleChains?limit=' + pageLink.limit;
        if (angular.isDefined(pageLink.textSearch)) {
            url += '&textSearch=' + pageLink.textSearch;
        }
        if (angular.isDefined(pageLink.idOffset)) {
            url += '&idOffset=' + pageLink.idOffset;
        }
        if (angular.isDefined(pageLink.textOffset)) {
            url += '&textOffset=' + pageLink.textOffset;
        }
        $http.get(url, config).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function getRuleChain(ruleChainId, config) {
        var deferred = $q.defer();
        var url = '/api/ruleChain/' + ruleChainId;
        $http.get(url, config).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function saveRuleChain(ruleChain) {
        var deferred = $q.defer();
        var url = '/api/ruleChain';
        $http.post(url, ruleChain).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function deleteRuleChain(ruleChainId) {
        var deferred = $q.defer();
        var url = '/api/ruleChain/' + ruleChainId;
        $http.delete(url).then(function success() {
            deferred.resolve();
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function getRuleChainMetaData(ruleChainId, config) {
        var deferred = $q.defer();
        var url = '/api/ruleChain/' + ruleChainId + '/metadata';
        $http.get(url, config).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function saveRuleChainMetaData(ruleChainMetaData) {
        var deferred = $q.defer();
        var url = '/api/ruleChain/metadata';
        $http.post(url, ruleChainMetaData).then(function success(response) {
            deferred.resolve(response.data);
        }, function fail() {
            deferred.reject();
        });
        return deferred.promise;
    }

    function getRuleNodeSupportedLinks(nodeType) { //eslint-disable-line
        //TODO:
        var deferred = $q.defer();
        var linkLabels = [
            { name: 'Success', custom: false },
            { name: 'Fail', custom: false },
            { name: 'Custom', custom: true },
        ];
        deferred.resolve(linkLabels);
        return deferred.promise;
    }

    function getRuleNodeComponents() {
        var deferred = $q.defer();
        if (ruleNodeComponents) {
            deferred.resolve(ruleNodeComponents);
        } else {
            loadRuleNodeComponents().then(
                (components) => {
                    ruleNodeComponents = components;
                    ruleNodeComponents.push(
                        types.ruleChainNodeComponent
                    );
                    deferred.resolve(ruleNodeComponents);
                },
                () => {
                    deferred.reject();
                }
            );
        }
        return deferred.promise;
    }

    function getRuleNodeComponentByClazz(clazz) {
        var res = $filter('filter')(ruleNodeComponents, {clazz: clazz}, true);
        if (res && res.length) {
            return res[0];
        }
        return null;
    }

    function resolveTargetRuleChains(ruleChainConnections) {
        var deferred = $q.defer();
        if (ruleChainConnections && ruleChainConnections.length) {
            var tasks = [];
            for (var i = 0; i < ruleChainConnections.length; i++) {
                tasks.push(getRuleChain(ruleChainConnections[i].targetRuleChainId.id));
            }
            $q.all(tasks).then(
                (ruleChains) => {
                    var ruleChainsMap = {};
                    for (var i = 0; i < ruleChains.length; i++) {
                        ruleChainsMap[ruleChains[i].id.id] = ruleChains[i];
                    }
                    deferred.resolve(ruleChainsMap);
                },
                () => {
                    deferred.reject();
                }
            );
        } else {
            deferred.resolve({});
        }
        return deferred.promise;
    }

    function loadRuleNodeComponents() {
        return componentDescriptorService.getComponentDescriptorsByTypes(types.ruleNodeTypeComponentTypes);
    }


}