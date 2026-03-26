module.exports = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Ensure user is attached (from auth middleware)
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized: No user info"
                });
            }

            // Convert single role → array
            const roles = Array.isArray(allowedRoles)
                ? allowedRoles
                : [allowedRoles];

            // Check role
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Forbidden: Access denied"
                });
            }

            next();
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    };
};