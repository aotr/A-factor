const root = document.querySelector('[a-data]');
let rawData = getInitialData();
let data = observe(rawData);

registerLister();
reloadDom();
function observe(data) {
    return new Proxy(data, {
        set(target, key, value) {
            target[key] = value;
            reloadDom();
        }
    });
}
function reloadDom() {
    walkDom(root, element => {
        if (element.hasAttribute('a-show')) {
            let expression = element.getAttribute('a-show');
            element.style.display = eval(
                `with (data){
                    (${expression})
                }`
            )?  "block":"none";
        }
        if (!element.hasAttribute('a-text')) return;
        let expression = element.getAttribute('a-text');
        element.innerHTML = eval(
            `with (data){
                (${expression})
            }`
        );
    });
}
function registerLister() {
    walkDom(root, element => {
        if (element.hasAttribute('@click')) {
            element.addEventListener('click', () => {
                let expression = element.getAttribute('@click');
                eval(
                    `with (data){
                        (${expression})
                    }`
                );
            })
        } 
    });
}
function walkDom(el, callback) {
    callback(el);
    el = el.firstElementChild;
    while (el) {
        walkDom(el,callback);
        el = el.nextElementSibling;
    }
}
function getInitialData() {
    let dataString = root.getAttribute('a-data');
    return eval(`(${dataString})`)
}