
NS.events = {};

NS.events.ready = (function () {
    var cb = [],
        readyStateCheckInterval = setInterval(function () {
            if (document.readyState === "complete") {
                clearInterval(readyStateCheckInterval);
                for (var i = 0, l = cb.length; i < l; i++) {
                    cb[i].call(this);
                }
            }
        }, 10);
    return function (c) {
        if (document.readyState === "complete") {
            c.call(this);
        } else {
            cb.push(c);
        }
    };
})();

NS.events.getOffset = function (e, trg) {
    e = e || window.event;

    var target = trg || e.target || e.srcElement,
        coord = NS.events.coord(e),
        rect = target.getBoundingClientRect(),
        offsetX = coord[0] - rect.left,
        offsetY = coord[1] - rect.top;
    return [offsetX, offsetY];
};


NS.events.coord = function (ev) {
    var WD = window.document,
        x,
        y,
        e;

    // if is a touch take the first finger
    e = (ev.touches && ev.touches.length) ? ev.touches[0] : ev;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + WD.body.scrollLeft + WD.documentElement.scrollLeft;
        y = e.clientY + WD.body.scrollTop + WD.documentElement.scrollTop;
    }
    return [x, y];
};