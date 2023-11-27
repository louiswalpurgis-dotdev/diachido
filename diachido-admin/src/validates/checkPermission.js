export const checkPermission = (userRole, roles) => {
    return roles.includes(userRole);
};
