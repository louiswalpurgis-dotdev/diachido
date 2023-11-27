import { Link } from 'react-router-dom';
import useCountQuery from '../../hooks/useCountQuery';
import { useMemo } from 'react';

export default function AltsAuthor({ allStyles, uid }) {
    const userId = useMemo(() => {
        return uid;
    }, [uid]);
    const { totalCount, published, pending } = useCountQuery('shops', userId);
    return (
        <>
            <h1 className="text-2xl font-semibold text-secondary-300">Cửa hàng</h1>
            <div className={`flex w-full gap-4 ${allStyles}`}>
                <div className="w-1/3">
                    <Item title="Tổng số cửa hàng" value={totalCount} to="/add-store" subTittle="Bạn đã tạo" />
                </div>
                <div className="w-1/3">
                    <Item title="Cửa hàng đã duyệt" value={published} to="/add-store" subTittle="đã phê duyệt" />
                </div>
                <div className="w-1/3">
                    <Item title="Cửa hàng chờ duyệt" value={pending} to="/created-stores" subTittle="đang chờ duyệt" />
                </div>
            </div>
        </>
    );
}

const Item = ({ title, value, to, subTittle }) => {
    return (
        <Link to={to}>
            <div className="flex-1 rounded-xl bg-white p-3">
                <h1 className="text-lg font-semibold">{title}</h1>
                <div className="flex items-center">
                    <p
                        className={`mx-auto text-3xl font-bold ${
                            to === '/created-stores' ? 'text-blue-400' : 'text-green-400'
                        }`}
                    >
                        {value}
                    </p>
                </div>
                <p className="text-sm font-light">{subTittle}</p>
            </div>
        </Link>
    );
};
