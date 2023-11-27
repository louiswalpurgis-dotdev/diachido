import { useContext } from 'react';
import { AltsAdd, AltsTotal } from '../components/Analytics';
import AltsAuthor from '../components/Analytics/AltsAuthor';
import Text from '../components/Text';
import { AuthContext } from '../Context/AuthProvider';
import AltsTopWeek from '../components/Analytics/AltsTopWeek';
const data = [
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
    {
        text: 'Cà phê sữa đá',
        quantity: 100,
    },
];

export default function Dashboard() {
    const {
        user: { uid, role },
    } = useContext(AuthContext);
    return (
        <div className="w-full">
            <div className="flex gap-4">
                <Text
                    text="::.Tổng quan hệ thống"
                    fontSize="25px"
                    fontWeight="font-bold"
                    colorFrom="#e63946"
                    colorVia="#f1af4c"
                    colorTo="#de99fd"
                />
            </div>
            {role === 'admin' ? <AltsTotal allStyles="my-4" /> : <AltsAuthor allStyles="my-4" uid={uid} />}
            <div className="flex w-full flex-col rounded-xl bg-white/60 px-8 pb-8 pt-4 shadow-sm  xl:flex-row">
                <div className="order-1 h-full w-full flex-auto flex-col xl:order-none">
                    <Text text="Thêm dữ liệu" color="#457b9d" fontSize="1.125rem" fontWeight="font-semibold pb-2" />
                    <AltsAdd />
                </div>
            </div>
            <div className="my-4 flex flex-nowrap gap-8">
                <AltsTopWeek title="Top 10 Sales mạnh" data={data} />
                <AltsTopWeek title="Top 10 Store yêu thích" data={data} />
                <AltsTopWeek title="Top 10 hay ngủ" data={data} />
            </div>
        </div>
    );
}
