import { Button, Input } from '@nextui-org/react';
import { Password, MailIcon, EyeFilledIcon, EyeSlashFilledIcon } from '../components/Icons';
import { useContext, useEffect, useMemo, useState } from 'react';
import { validateEmail, validatePassword } from '../validates/Login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider';

function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibleInput, setVisibleInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?.uid) {
            navigate('dashboard', { replace: true });
        }
        return () => {};
    }, [user, navigate]);
    const handleLogin = () => {
        if (
            email === '' ||
            password === '' ||
            validationStateEmail === 'invalid' ||
            validationStatePassword === 'invalid'
        ) {
            setError('Email hoặc mật khẩu không chính xác.');
            return;
        }
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setIsLoading(false);
                const user = userCredential.user;
                localStorage.setItem('accessToken', user.accessToken);
                navigate('/', { replace: true });
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.code === 'auth/user-disabled') {
                    alert('Tài khoản của  bạn đã bị khoá. Hãy liên hệ admin để biết thêm chi tiết');
                    return;
                }
                setError('Email hoặc mật khẩu không chính xác.');
            });
    };
    const toggleVisibleInput = () => {
        setVisibleInput(!visibleInput);
    };

    const validationStateEmail = useMemo(() => {
        if (email === '') return undefined;

        return validateEmail(email) ? 'valid' : 'invalid';
    }, [email]);
    const validationStatePassword = useMemo(() => {
        if (password === '') return undefined;

        return validatePassword(password) ? 'valid' : 'invalid';
    }, [password]);

    useEffect(() => {
        const listener = (event) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                event.preventDefault();
                handleLogin();
            }
        };

        document.addEventListener('keydown', listener);

        return () => {
            document.removeEventListener('keydown', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, password]);
    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="relative isolate w-full h-screen flex flex-col items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>
                <div className="bg-white/60 rounded-2xl py-8 px-12">
                    <div className="flex flex-col items-center justify-center">
                        <h3 className="flex flex-shrink-0 text-2xl font-bold text-gray-800">Đăng nhập</h3>
                        <p className="flex flex-shrink-0 text-sm text-gray-500">
                            Quản lý của trang website địa chỉ đỏ!
                        </p>
                        <div className="flex flex-col space-y-3 mt-6">
                            <Input
                                type="email"
                                className="max-w-xs"
                                placeholder="Email"
                                labelPlacement="outside"
                                value={email}
                                onValueChange={setEmail}
                                errorMessage={validationStateEmail === 'invalid' && 'Hãy nhập một email chính xác.'}
                                variant="bordered"
                                validationState={validationStateEmail}
                                color={validationStateEmail === 'invalid' ? 'danger' : 'success'}
                                startContent={<MailIcon className="text-2xl text-default-400 pointer-events-none" />}
                                isRequired
                            />
                            <Input
                                type={visibleInput ? 'text' : 'password'}
                                className="max-w-xs"
                                placeholder="Mật khẩu"
                                labelPlacement="outside"
                                value={password}
                                onValueChange={setPassword}
                                errorMessage={
                                    validationStatePassword === 'invalid' &&
                                    'Mật khẩu ít nhất 8 ký tự, bao gồm chữ và số.'
                                }
                                variant="bordered"
                                validationState={validationStatePassword}
                                color={validationStatePassword === 'invalid' ? 'danger' : 'success'}
                                startContent={<Password className="text-2xl text-default-400 pointer-events-none" />}
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibleInput}>
                                        {visibleInput ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <div className="flex items-center justify-center">
                                <Button
                                    auto
                                    color="primary"
                                    variant="shadow"
                                    isLoading={isLoading ? true : false}
                                    onClick={() => {
                                        handleLogin();
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
        </div>
    );
}

export default Home;
