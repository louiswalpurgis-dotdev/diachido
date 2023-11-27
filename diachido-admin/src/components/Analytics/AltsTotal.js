import { Link } from 'react-router-dom';
import useCollectionCount from '../../hooks/useCollectionCount';
import { ArrowDown, ArrowUp, CommentIcon, SpecialOfferIcon, StoreIcon, UserIcon } from '../Icons';
import LineChart from '../LineChart';
import Text from '../Text';

export default function AltsTotal({ allStyles }) {
    const { totalCount, aWeekCount, countByDay } = useCollectionCount('users');
    const {
        totalCount: totalCountStore,
        aWeekCount: aWeekCountStore,
        countByDay: countByDayStore,
    } = useCollectionCount('shops');
    const {
        totalCount: totalCountDiscount,
        aWeekCount: aWeekCountDiscount,
        countByDay: countByDayDiscount,
    } = useCollectionCount('discounts');
    const {
        totalCount: totalCountComment,
        aWeekCount: aWeekCountComment,
        countByDay: countByDayComment,
    } = useCollectionCount('comments');
    return (
        <div className={`flex gap-2 ${allStyles}`}>
            <div className="w-1/4 flex-1">
                <TotalItem
                    title="Người dùng"
                    value={totalCount}
                    percent={aWeekCount}
                    chart={<LineChart dataChart={countByDay} />}
                    icon={<UserIcon fontSize="16px" />}
                    href="/users"
                />
            </div>
            <div className="w-1/4 flex-1">
                <TotalItem
                    title="Cửa hàng"
                    value={totalCountStore}
                    percent={aWeekCountStore}
                    chart={<LineChart dataChart={countByDayStore} />}
                    icon={<StoreIcon fontSize="16px" />}
                    href="/stores"
                />
            </div>
            <div className="w-1/4 flex-1">
                <TotalItem
                    title="Ưu đãi"
                    value={totalCountDiscount}
                    percent={aWeekCountDiscount}
                    chart={<LineChart dataChart={countByDayDiscount} />}
                    icon={<SpecialOfferIcon fontSize="16px" />}
                    href="/discounts"
                />
            </div>
            <div className="w-1/4 flex-1">
                <TotalItem
                    title="Bình luận"
                    value={totalCountComment}
                    percent={aWeekCountComment}
                    chart={<LineChart dataChart={countByDayComment} />}
                    icon={<CommentIcon fontSize="16px" />}
                    href="/comments"
                />
            </div>
        </div>
    );
}

// Chỉnh sửa component ở đây
const TotalItem = ({ title, value, percent, chart, href, icon }) => {
    return (
        <Link to={href}>
            <div className="flex-1 rounded-2xl bg-white/70 p-4 hover:bg-gray-100">
                <div className="flex flex-shrink-0 items-center">
                    <div className="flex max-w-full items-center gap-x-1 rounded-full bg-zinc-200/60 px-2.5 py-0.5">
                        <span className="hidden md:block">
                            {icon}
                        </span>
                        <Text text={title} fontSize="14px" fontWeight="font-semibold" />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-between xl:flex-row xl:items-center">
                    <div className="order-2 xl:order-none">
                        <div className="flex items-center gap-x-2">
                            <Text text={value} fontSize="24px" fontWeight="font-bold" />
                            <div className="flex items-center gap-x-0.5">
                                {percent > 0 ? <ArrowUp /> : <ArrowDown />}
                                <span className="text-sm font-semibold text-green-600/80">{percent}%</span>
                            </div>
                        </div>
                        <Text text="Trong tuần qua" fontSize="16px" fontWeight="font-medium" />
                    </div>
                    <div className="flex w-full items-center justify-center">{chart}</div>
                </div>
            </div>
        </Link>
    );
};
