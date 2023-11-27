import React from 'react';
import { Link } from 'react-router-dom';
import { TabTitle } from '~/utils/generalFunctions';

export default function Error() {
    TabTitle('404');

    return (
        <div className="min-h-screen w-full bg-white flexCenter rounded-lg shadow-sm shadow-slate-200">
            <div className="flexCenter flex-col gap-y-2">
                <h1 className="text-9xl font-bold text-red-500 cursor-not-allowed select-none">404</h1>
                <p className="text-2xl font-base">Địa Chỉ không tồn tại.</p>
                <Link to="/" className="text-blue-500 font-medium hover:text-blue-600">
                    Trở về trang chủ.
                </Link>
            </div>
        </div>
    );
}
