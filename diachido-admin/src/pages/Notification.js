import { useState } from 'react';
import AddNotification from '../components/Notification/AddNotif';
import useFirestore from '../hooks/useFirebase';
import { Button, Listbox, ListboxItem } from '@nextui-org/react';
import { ChevronRightIcon } from '../components/Icons';
import ViewNotification from '../components/Notification/ViewNotif';

export default function Notification() {
    const [type, setType] = useState('view'); // view, add, edit
    const [selectedDoc, setSelectedDoc] = useState({}); // [ {id, title, content, uid, createdAt}, ...]
    const { documents } = useFirestore('notifications', null, 'createdAt');

    const handleSelectedDoc = (docId) => {
        const doc = documents.find((doc) => doc.id === docId);
        setSelectedDoc(doc);
        setType('view');
    };

    return (
        <div className="flex rounded-lg border">
            <ListboxWrapper>
                <Button
                    fullWidth="true"
                    color="primary"
                    onClick={() => {
                        setType('add');
                    }}
                >
                    Thêm
                </Button>
                <Listbox aria-label="Actions" onAction={(key) => handleSelectedDoc(key)}>
                    {documents.map((doc) => {
                        return (
                            <ListboxItem
                                key={doc.id}
                                description={new Date(doc.createdAt).toLocaleString() || 'Không xác định'}
                                className={`line-clamp-1 text-sm font-normal
                                     ${doc.id === selectedDoc.id ? 'bg-secondary-100' : ''}`}
                                endContent={<ChevronRightIcon />}
                            >
                                {doc.title}
                            </ListboxItem>
                        );
                    })}
                </Listbox>
            </ListboxWrapper>
            <div className="flex-1">
                {type === 'add' ? (
                    <AddNotification />
                ) : selectedDoc.id ? (
                    selectedDoc.id && (
                        <ViewNotification
                            selectedDoc={selectedDoc}
                            setType={setType}
                            type={type}
                            setSelectedDoc={setSelectedDoc}
                        />
                    )
                ) : (
                    <div className="text-center text-2xl font-semibold">Chọn thông báo để xem</div>
                )}
            </div>
        </div>
    );
}

export const ListboxWrapper = ({ children }) => (
    <div className="min-h-[400px] w-full max-w-[300px] rounded-small border-small border-default-200 px-1 py-2">
        {children}
    </div>
);
