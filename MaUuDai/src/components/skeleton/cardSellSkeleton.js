const cardSellSkeleton = () => {
    return (
        // <div className="bg-white px-4 py-6 w-full rounded-lg mt-2 shadow-sm shadow-stone-200">
        // {/* <div className="border rounded-lg"> */}
        <div className="flex flex-wrap -mx-2 -my-2">
            <section className="flex w-calc max-w-3xl mx-2 my-2 animate-pulse">
                <div className="flex wh-full flex-grow flex-col radiusFill bgColor border border-white px-6 py-2 overflow-hidden">
                    {/* TITLE */}
                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col w-full gap-y-0.5">
                            <span className="w-[70%] h-3 ct_skeleton animate-pulse"></span>
                            <span className="flexStart gap-x-1">
                                <span className="w-2.5 h-2.5 ct_skeleton animate-pulse"></span>
                                <span className="w-[75%] h-2.5 ct_skeleton animate-pulse"></span>
                            </span>
                            <span className="flexStart gap-x-1">
                                <span className="w-2.5 h-2.5 ct_skeleton animate-pulse"></span>
                                <span className="w-[40%] h-2.5 ct_skeleton animate-pulse"></span>
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-7 h-7 bg-zinc-100 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="relative my-1 flex items-center justify-between w-full border-[1px] border-dashed border-zinc-50 animation200">
                        <div className="absolute -left-12 h-10 w-10 rounded-full bg-white"></div>
                        <div className="absolute -right-12 h-10 w-10 rounded-full bg-white"></div>
                    </div>
                    {/* TIME TICKET */}
                    <div className="flex flex-col w-full gap-y-0.5">
                        <div className="flex flex-col gap-y-0.5">
                            <span className="w-12 h-2.5 ct_skeleton animate-pulse"></span>
                            <span className="w-[85%] h-2.5 ct_skeleton animate-pulse"></span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <span className="w-14 h-2.5 ct_skeleton animate-pulse"></span>
                            <span className="w-[20%] h-2.5 ct_skeleton animate-pulse"></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        // {/* </div> */}
        // </div>
    );
};

export default cardSellSkeleton;
