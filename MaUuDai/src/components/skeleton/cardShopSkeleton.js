import { Skeleton } from '@mui/material';

const cardShopSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="flex-shrink-0 group md:w-[9.5rem] md:h-[10.5rem] w-[9rem] h-[10rem] relative perspective-1000">
                <div className="absolute inset-0 bg-gray-300 rounded-md radiusFill transform -rotate-6 -skew-x-6 group-hover:-rotate-12 group-hover:-skew-x-12 animation200"></div>
                <div className="absolute inset-0 bg-gray-300 backdrop-blur radiusFill border-t-[1px] -rotate-6 -skew-x-6 group-hover:-rotate-12 group-hover:-skew-x-12 animation200"></div>
                <div className="absolute inset-3 md:inset-3.5 md:-translate-y-14 -translate-y-12">
                    <div className="w-32 h-32 animate-pulse bg-gray-300 rounded-lg shadow-md shadow-white/40"></div>
                    <Skeleton className="font-semibold text-[0.8rem] truncate hover:underline animate-pulse" />
                    <Skeleton variant="text" className="font-medium text-[0.7rem] line-clamp-1" />
                    <Skeleton variant="text" className="font-medium text-[0.6rem] animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default cardShopSkeleton;
