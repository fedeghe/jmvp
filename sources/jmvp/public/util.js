NS.util = {};

NS.util.toQs = function (obj, params) {
    'use strict';
    var qsElems = [],
        qs,
        k, j;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            if ((obj[k] + '').match(/\{.*\}/)) {
                for (j in params) obj[k] = ('' + obj[k]).replace('{' + j + '}', encodeURIComponent(params[j]));
            }
            qsElems.push(k + '=' + encodeURIComponent(obj[k]));
        }
    }
    qs = '?' + qsElems.join('&');
    return qs;
};

/**
 *
 * @param {*} size meant to be given in KB
 */
NS.util.toMemFormat = function (size, post) {
    'use strict';
    if (!size) return size + (post || '');
    var div = 2 << 9,
        units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        index = 0;
    while (size / Math.pow(div, index + 1) > 1) {
        index++;
    }
    return '' + (size / Math.pow(div, index)).toFixed(2).replace(/\.?0+$/, '') + units[index] + (post || '');
};

NS.util.dateFormat = function (d) {
    var data = new Date(d);
    return data.toLocaleString(navigator.language);
};

NS.util.isElement = function (el) {
    return !!(el && el.nodeType === 1);
};
