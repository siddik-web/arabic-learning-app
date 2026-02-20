export function toast(m) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = m;
    t.classList.add('on');
    setTimeout(() => t.classList.remove('on'), 2500);
}

export function getElement(id) {
    return document.getElementById(id);
}
