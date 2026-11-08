const fs = require('fs');
const path = require('path');

let proxies = { http: [], https: [], socks4: [], socks5: [] };

function load() {
    const dir = path.join(__dirname, '..');
    const files = {
        'http.txt': 'http',
        'https.txt': 'https',
        'socks4.txt': 'socks4',
        'socks5.txt': 'socks5',
    };
    for (const [file, type] of Object.entries(files)) {
        const list = [];
        try {
            const data = fs.readFileSync(path.join(dir, file), 'utf8');
            for (const l of data.split(/\r?\n/)) {
                const t = l.trim();
                if (t && !t.startsWith('#') && t.includes(':'))
                    list.push(t);
            }
        } catch (e) {}
        proxies[type] = list;
    }
    return proxies;
}

function random(type) {
    const list = type ? proxies[type] : allFlat();
    if (!list || list.length === 0) load();
    const src = type ? proxies[type] : allFlat();
    if (!src || src.length === 0) return null;
    return src[Math.floor(Math.random() * src.length)];
}

function all(type) {
    if (type) {
        if (proxies[type].length === 0) load();
        return proxies[type];
    }
    return allFlat();
}

function allFlat() {
    const flat = [];
    for (const t of ['http', 'https', 'socks4', 'socks5'])
        for (const p of proxies[t])
            flat.push(p);
    return flat;
}

function count(type) {
    if (type) return proxies[type] ? proxies[type].length : 0;
    return Object.values(proxies).reduce((s, v) => s + v.length, 0);
}

module.exports = { load, random, all, count };
