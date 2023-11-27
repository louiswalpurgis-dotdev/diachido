import { message } from 'antd';

export default function showMessage(content, type = 'success') {
    const messageType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    message[messageType](content);
}
