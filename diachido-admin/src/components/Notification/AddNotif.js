import { Button, Input, Textarea } from '@nextui-org/react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/services';
import showMessage from '../../utils/message';

export default function AddNotification() {
    const {
        user: { displayName, uid },
    } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitNitification = async () => {
        const isValid = title && content;
        if (!isValid) return;
        try {
            setIsLoading(true);
            await addDocument('notifications', {
                title: title,
                content: content,
                uid: uid,
            });
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
            showMessage('Gửi thông báo thành công', 'success');
            setTitle('');
            setContent('');
        }
    };
    return (
        <div className="container mx-auto flex  flex-col rounded-xl bg-white  p-6">
            <h2 className="text-lg font-semibold uppercase text-secondary-500">Thông báo</h2>
            <Input
                type="text"
                isRequired
                variant="underlined"
                label="Tiêu đề thông báo"
                className="whitespace-normal text-3xl font-semibold"
                value={title}
                onValueChange={setTitle}
            />
            <div className="flex items-center space-x-2">
                <span className="font-light text-gray-400 ">Được viết bởi: </span>{' '}
                <span className="text-blue-400"> {displayName} </span>
                <p className="ml-2 text-sm font-light text-gray-400">Thời gian: {Date().toLocaleString()}</p>
            </div>
            <Textarea
                label="Nội dung thông báo"
                labelPlacement="outside"
                placeholder="Nhập nội dung thông báo"
                className="mt-4 whitespace-pre-line text-justify text-base font-normal"
                value={content}
                isRequired
                minRows={14}
                maxRows={20}
                radius="sm"
                onValueChange={setContent}
            />
            <Button
                className="mt-4"
                color="primary"
                auto
                isDisabled={!title || !content || isLoading}
                isLoading={isLoading}
                onClick={() => {
                    handleSubmitNitification();
                }}
            >
                Gửi
            </Button>
        </div>
    );
}
