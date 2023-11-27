import React, { createContext, useState, useEffect } from 'react';
import { auth } from '~/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { message } from 'antd';
import { IconSvg } from '~/components/constant';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setIsLoading(true);

            if (user) {
                const { displayName, email, uid, photoURL } = user;
                const userRef = collection(db, 'users');
                const userQuery = query(userRef, where('uid', '==', uid));

                try {
                    const querySnapshot = await getDocs(userQuery);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setUser({ displayName, email, uid, photoURL, ...userData });
                    } else {
                        setUser({ displayName, email, uid, photoURL, point: 0 });
                    }
                } catch (error) {
                    message.error('Đã xuất hiện lỗi khi truy xuất dữ liệu người dùng!');
                }
            } else {
                setUser({});
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {isLoading ? (
                <div className="w-full h-screen flexCenter">
                    <img src={IconSvg.loading} className="my-auto" alt="Loading" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
