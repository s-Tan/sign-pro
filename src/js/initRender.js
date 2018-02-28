function resetRender() {
    let baseWidth = 750;
    let currWidth = document.getElementsByTagName('html')[0].offsetWidth;
    let _body = document.getElementsByTagName('body')[0];
    _body.style.zoom = currWidth / baseWidth
};
resetRender();