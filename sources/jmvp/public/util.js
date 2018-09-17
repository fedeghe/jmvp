NS.util = {};
NS.util.toQs = function (obj, params) {
    "use strict";
    var qsElems = [],
        qs,
        k, j;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            if ((obj[k] + '').match(/\{.*\}/)) {
                for (j in params) obj[k] = ("" + obj[k]).replace('{' + j + '}', encodeURIComponent(params[j]));
            }
            qsElems.push(k + '=' + encodeURIComponent(obj[k]));
        }
    }
    qs = '?' + qsElems.join('&');
    return qs;
}