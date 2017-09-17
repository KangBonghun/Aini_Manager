'use strict';
/**
 * @memberof ainiApp
 * @ngdoc service
 * @name Connection
 * @description REST api, Socket 통신에 대한 connection 설정
 *
 * (사용 형식)
 * RemoteHttp.controller(컨트롤러 서비스 RequestMapping URL).url(컨트롤러 URL).methods([get|post]).request().then(...);
 * (사용 예)
 * RemoteHttp.controller("/dashboard/rest/dashboard/widget").url("/query/result").methods("get").request().then(...);
 *
 * @param  {Service} $http api Angular http service
 * @param  {Service} $q promise service
 * @param  {Constant} AppConfig Angular constant service
 * @return {Object} Connection
 */
ainiApp.service('RemoteHttp', ['$http', '$q', function($http, $q) {
    var Connection = {

        /**
         * API Base URL
         * @type {[type]}
         */
        _baseUrl: window.location.origin,

        /**
         * Mockup 여부
         * @type {[type]}
         */
        _mockup: false,

        /**
         * Method
         * @type {String}
         */
        _method: "post",

        /**
         * Controller Service URL
         * @type {[type]}
         */
        _controller: '',

        /**
         * Controller URL
         * @type {[type]}
         */
        _url: '',

        /**
         * Request Parameter
         * @type {Object}
         */
        _param: {},

        /**
         * method setter
         * @param  {String} val Method
         * @return {instance}     [description]
         */
        methods: function(val) {
            this._method = val;

            return this;
        },

        /**
         * controller setter
         * @param  {String} val Controller Service URL
         * @return {instance}     [description]
         */
        controller: function(val) {
            this._controller = val;

            return this;
        },

        /**
         * url setter
         * @param  {String} val Controller URL
         * @return {instance}     [description]
         */
        url: function(val) {
            this._url = val;

            return this;
        },

        /**
         * param setter
         * @param  {Object} val Request Parameter
         * @return {instance}     [description]
         */
        param: function(val) {
            this._param = val;

            return this;
        },

        /**
         * Requetst HTTP
         * @return {promise} HTTP Promise
         */
        request: function() {
            var deferred = $q.defer();

            $http({
                    url: this._baseUrl + this._controller + this._url,
                    method: this._method,
                    data: this._param
                }).success(function(data, status, headers, config) {
                    if (status == 200) {
                        deferred.resolve(data);
                    } else {
                        deferred.resolve(null);
                    }
                })
                .error(function(err, status, headers, config) {
                    deferred.reject(err, status);
                });

            return deferred.promise;
        },
    };

    return Connection;
}]);
