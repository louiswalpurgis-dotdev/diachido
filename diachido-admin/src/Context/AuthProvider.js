import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Spinner } from '@nextui-org/react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setIsLoading(true);
            if (user) {
                let { displayName, email, uid, photoURL, isDeleted, role } = user;
                const userRef = collection(db, 'users');
                const userQuery = query(userRef, where('uid', '==', uid));

                onSnapshot(userQuery, (snapshot) => {
                    const userData = snapshot.docs[0].data();
                    isDeleted = userData.isDeleted;
                    setUser({ displayName, email, uid, photoURL, role, ...userData });
                });
                if (isDeleted) {
                    alert('Tài khoản của bạn đã bị khoá. Hãy liên hệ admin để biết thêm chi tiết');
                    auth.signOut();
                    setUser({});
                    localStorage.removeItem('accessToken');

                    return;
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
                <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-2">
                    <Spinner size="lg" />
                    <h2>Đang tải dữ liệu...</h2>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}
