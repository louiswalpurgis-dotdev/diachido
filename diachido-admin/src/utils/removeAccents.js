export const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const removeAccentsAndLowerCase = (str) => {
    // remove space
    str = str.replace(/\s/g, '');
    return removeAccents(str).toLowerCase();
};
