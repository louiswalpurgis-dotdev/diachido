import showMessage from '../utils/message';

const validateRequiredFields = (fields) => {
    for (const field of fields) {
        if (!field) {
            showMessage('Vui lòng nhập đầy đủ thông tin', 'error');
            return false;
        }
    }
    return true;
};

const validateLength = (value, minLength, maxLength, errorMessage) => {
    if (value.length < minLength || value.length > maxLength) {
        showMessage(errorMessage, 'error');
        return false;
    }
    return true;
};

const validatePassword = (password, confirmPassword) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!re.test(password)) {
        showMessage('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số', 'error');
        return false;
    }
    if (password !== confirmPassword) {
        showMessage('Mật khẩu không khớp', 'error');
        return false;
    }
    return true;
};

export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
};

export const ValidateAddUser = (dislayName, email, password, confirmPassword) => {
    // trim all data
    dislayName = dislayName.trim();
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    if (!validateRequiredFields([dislayName, email, password, confirmPassword])) {
        return false;
    }
    if (!validateEmail(email)) {
        return false;
    }
    if (!validatePassword(password, confirmPassword)) {
        return false;
    }
    if (!validateLength(dislayName, 6, 50, 'Tên người dùng phải có độ dài từ 6 đến 50 ký tự')) {
        return false;
    }

    return true;
};
