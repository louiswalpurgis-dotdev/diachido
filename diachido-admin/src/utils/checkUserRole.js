function checkUserRole(userRole, roles) {
    if (roles.includes(userRole) || roles.length === 0) {
        return true;
    } else {
        return false;
    }
}

export default checkUserRole;
