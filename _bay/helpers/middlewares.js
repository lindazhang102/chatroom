export const loginRequired = (req, res, next) => {
    const loginUrl = req.app.locals.LOGIN_URL;
    if (!res.locals.currentUser) {
        res.redirect(`${loginUrl}/?next=${encodeURIComponent(res.req.originalUrl)}`);
    } else {
        next();
    }
};
