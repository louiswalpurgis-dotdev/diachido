import React from 'react';
import { auth, ggProvider, fbProvider } from '~/firebase/config';
import { signInWithPopup } from 'firebase/auth';

import { message } from 'antd';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { addDocument } from '~/firebase/services';

const loginProps = {
    fb: {
        provider: fbProvider,
        icon: <BsFacebook size={24} color="blue" />,
        text: 'Facebook',
        classNames: 'rounded-l-xl',
    },
    gg: {
        provider: ggProvider,
        icon: <FcGoogle size={24} />,
        text: 'Google',
        classNames: 'rounded-r-xl',
    },
};

const Login = () => {
    const handleLogin = async (provider) => {
        try {
            const { user, providerId } = await signInWithPopup(auth, provider);
            // Check if user is new
            if (user.metadata.creationTime === user.metadata.lastSignInTime) {
                addDocument('users', {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: providerId,
                    point: 0,
                });
            }
        } catch (error) {
            message.error('Đăng nhập thất bại');
        }
    };
    return (
        <div className="flex items-center justify-center flex-col w-ful">
            <div className="flexCenter mt-4 gap-1">
                {Object.keys(loginProps).map((key) => (
                    <button
                        key={key}
                        onClick={() => {
                            handleLogin(loginProps[key].provider);
                        }}
                        type="submit"
                        className={`w-40 px-4 py-2 border border-gray-200 hover:bg-gray-200 ${loginProps[key].classNames}`}
                    >
                        <div className="flexBetween gap-8 ">
                            <p className="font-bold">{loginProps[key].text}</p>
                            {loginProps[key].icon}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Login;
