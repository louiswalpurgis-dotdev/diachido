import React, { useContext, useState } from 'react';

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
} from '@nextui-org/react';
import { EyeFilledIcon, EyeSlashFilledIcon, MailIcon, PlusIcon, SelectorIcon, User } from '../Icons';
import { userRoles } from '../constant';
import { ValidateAddUser } from '../../validates/AddUser';
import { createUserWithEmailAndPW } from '../../firebase/services';
import showMessage from '../../utils/message';
import { checkPermission } from '../../validates/checkPermission';
import { AuthContext } from '../../Context/AuthProvider';

export default function AddUser() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [role, setRole] = useState(new Set(['user']));
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [isVisiblePW, setIsVisiblePW] = useState(false);
    const [isVisibleRePW, setIsVisibleRePW] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {
        user: { role: currentRole },
    } = useContext(AuthContext);
    const handlAddUser = async () => {
        const roleUser = role.values().next().value;
        displayName.trim();
        email.trim();
        password.trim();
        rePassword.trim();

        const isvalid = ValidateAddUser(displayName, email, password, rePassword);
        if (!isvalid) return;
        if (!checkPermission(currentRole, ['admin'])) {
            showMessage('Bạn không có quyền thêm người dùng', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await createUserWithEmailAndPW(email, password, displayName, roleUser);
            showMessage('Thêm người dùng thành công', 'success');
            onOpen();
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVisibilityPW = () => setIsVisiblePW(!isVisiblePW);
    const toggleVisibilityRePW = () => setIsVisibleRePW(!isVisibleRePW);
    return (
        <>
            <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
                Thêm mới
            </Button>
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 uppercase">Thêm người dùng</ModalHeader>
                            <ModalBody className="items-center">
                                <Input
                                    type="text"
                                    label="Tên hiển thị"
                                    placeholder="Tên hiển thị"
                                    isRequired
                                    className="max-w-xs"
                                    value={displayName}
                                    onValueChange={setDisplayName}
                                    endContent={
                                        <User className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                                    }
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="Email của bạn"
                                    isRequired
                                    className="max-w-xs"
                                    value={email}
                                    onValueChange={setEmail}
                                    endContent={
                                        <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                                    }
                                />
                                <Input
                                    type={isVisiblePW ? 'text' : 'password'}
                                    label="Mật khẩu"
                                    placeholder="Mật khẩu của bạn"
                                    isRequired
                                    className="max-w-xs"
                                    value={password}
                                    onValueChange={setPassword}
                                    endContent={
                                        <button
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={toggleVisibilityPW}
                                        >
                                            {isVisiblePW ? (
                                                <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                                            ) : (
                                                <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                                            )}
                                        </button>
                                    }
                                />
                                <Input
                                    type={isVisibleRePW ? 'text' : 'password'}
                                    label="Nhập lại mật khẩu"
                                    placeholder="Nhập lại mật khẩu của bạn"
                                    isRequired
                                    className="max-w-xs"
                                    value={rePassword}
                                    onValueChange={setRePassword}
                                    endContent={
                                        <button
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={toggleVisibilityRePW}
                                        >
                                            {isVisibleRePW ? (
                                                <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                                            ) : (
                                                <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                                            )}
                                        </button>
                                    }
                                />
                                <Select
                                    label="Vai trò người dùng"
                                    placeholder="Vai trò người dùng"
                                    selectedKeys={role}
                                    classNames={{
                                        base: 'max-w-xs',
                                        trigger: 'capitalize',
                                    }}
                                    onSelectionChange={setRole}
                                    selectorIcon={<SelectorIcon />}
                                >
                                    {userRoles.map((role) => (
                                        <SelectItem key={role.uid} value={role.uid} className="capitalize">
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={handlAddUser} isLoading={isLoading}>
                                    Thêm mới
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
