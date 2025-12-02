export function requireUserLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/user/login?message=Please login to continue");
  }
  next();
}
