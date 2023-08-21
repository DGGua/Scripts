// ==UserScript==
// @name         tjupt url copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy url from menu rather than click into the detail page
// @author       You
// @match        https://www.tjupt.org/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tjupt.org
// @grant        none
// ==/UserScript==



function copyToClipboard(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

async function read(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let html = '';

    await reader.read().then(function processText({ done, value }) {
        if (done) {
            return;
        }

        html += decoder.decode(value);
        return reader.read().then(processText);
    });
    const regex = /data-clipboard-text="(.*?)"/;

    const match = regex.exec(html)

    return match[1]
}


(function() {
    'use strict';

    var elems =Array.from(document.querySelectorAll('table.torrents tbody tr td.embedded a[title]'));
    elems.forEach(elem => {
        var button = document.createElement('button');
        button.addEventListener('click', () => {
            fetch(elem.href, {credentials: "include"}).then(res => read(res.body)).then(url => {
                copyToClipboard(url)
                button.innerHTML = "已复制！"
            })
        })
        button.style = "padding-top: unset;padding-bottom: unset"
        button.innerHTML = "复制链接"
        elem.parentNode.insertBefore(button, elem.nextElementSibling)
    })
})();
