(function (exports) {
    'use strict';

    var success_status = [200, 201, 202, 203, 204, 205, 206];

    function create_http_request_obj() {
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        } else {
            throw new Error('Unable to create XMLHttpRequest object.');
        }
    }

    function request(method, url, success_cb, error_cb, data) {
        var http_request = create_http_request_obj();

        http_request.onreadystatechange = function handle_state_change() {
            if (http_request.readyState === 4) {
                if (success_status.indexOf(http_request.status) !== -1) {
                    var result = null;

                    if (http_request.responseText.length) {
                        result = JSON.parse(http_request.responseText);
                    }
                    console.log(result);
                    success_cb(result);
                } else {
                    error_cb({
                        status: http_request.status,
                        statusText: http_request.statusText,
                        error_detail: http_request.responseText
                    });
                }
            }
        };

        http_request.open(method, url, true);
        if (data) {
            http_request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        }
        http_request.send(JSON.stringify(data));
    }

    exports.SuperSimpleAjax = {
        get: function get(url, success_cb, error_cb) {
            request('GET', url, success_cb, error_cb);
        },

        patch: function patch(url, success_cb, error_cb, data) {
            request('PATCH', url, success_cb, error_cb, data);
        },

        put: function put(url, success_cb, error_cb, data) {
            request('PUT', url, success_cb, error_cb, data);
        },

        post: function get(url, success_cb, error_cb, data) {
            request('POST', url, success_cb, error_cb, data);
        },

        del: function del(url, success_cb, error_cb) {
            request('DELETE', url, success_cb, error_cb);
        }
    };
}(this));
