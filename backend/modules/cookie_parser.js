
function getSessionIdFromCookie(res) {
    const cookieHeader = res.headers.cookie;
    if (!cookieHeader) return null;

    const cookie = Object.fromEntries(cookieHeader.split('; ').map(c => {
        const [k, v] = c.split('=');
        return [k, v];
}));

return cookie.sessionId || null;
}

module.exports = {
    getSessionIdFromCookie
}