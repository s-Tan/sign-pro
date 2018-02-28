function getUrlParams(str, key) {
    if (arguments.length === 1) {
        key = str;
        str = window.location.href;
    }
    let reg = new RegExp('[^\\w*]' + key + '=([^#&]*)');
    let r = reg.exec(str);
    return r != null ? r[1] : null;
}
export {getUrlParams}