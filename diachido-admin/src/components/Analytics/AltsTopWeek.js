import Text from '../Text';
import { Link } from 'react-router-dom';

const ListItem = ({ text, quantity, order }) => {
    return (
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-start gap-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full shadow-sm">
                    {order && (
                        <Text text={order} color="#bc6c25" fontSize="1rem" fontWeight="font-semibold text-center" />
                    )}
                </div>
                <Text text={text} color="#323232" fontSize="1rem" fontWeight="font-semibold" />
            </div>
            <Text text={quantity} color="#323232" fontSize="0.8rem" fontWeight="font-medium" />
        </div>
    );
};

export default function AltsTopWeek({ title, data, href }) {
    const dataList = data || [];
    return (
        <div className="group mb-4 flex w-full flex-col gap-y-3 rounded-xl bg-white/60 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
                <Text text={title} color="#457b9d" fontSize="1.125rem" fontWeight="font-semibold" />
                <Link to={href} className="hidden hover:underline group-hover:block">
                    <Text text="Xem tất cả" color="#457b9d" fontSize="0.8rem" fontWeight="font-medium" />
                </Link>
            </div>
            <div className="flex flex-col items-start gap-y-4">
                {dataList.map((item, index) => (
                    <ListItem key={index} text={item.text} quantity={item.quantity} order={index + 1} />
                ))}
            </div>
        </div>
    );
}
