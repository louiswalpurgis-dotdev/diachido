import { Card, CardFooter, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { SpecialOfferIcon, StoreIcon } from '../Icons';
import Text from '../Text';
export default function AltsAdd() {
    return (
        <div className="flex justify-center gap-4">
            <Card isFooterBlurred radius="lg" className="flex w-1/2 items-center justify-center border-none">
                <StoreIcon className="h-1/2 w-1/2" />
                <CardFooter className="absolute bottom-2 z-10 w-[calc(100%_-_16px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-2 shadow-small before:rounded-xl before:bg-white/10">
                    <Text
                        text="Cập nhật thêm dữ liệu Cửa Hàng"
                        color="#323232"
                        fontSize="0.8rem"
                        fontWeight="font-medium"
                    />
                    <Button className="bg-[#457b9d]" variant="shadow" radius="lg" size="sm">
                        <Text
                            text="Thêm ngay"
                            color="#fff"
                            fontSize="0.8rem"
                            fontWeight="font-normal"
                            href="/add-store"
                        />
                    </Button>
                </CardFooter>
            </Card>
            <Card isFooterBlurred radius="lg" className="flex w-1/2 items-center justify-center border-none">
                <SpecialOfferIcon className="h-1/2 w-1/2 fill-blue-300" />
                <CardFooter className="absolute bottom-2 z-10 w-[calc(100%_-_16px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-2 shadow-small before:rounded-xl before:bg-white/10">
                    <Text
                        text="Cập nhật thêm dữ liệu Ưu Đãi"
                        color="#323232"
                        fontSize="0.8rem"
                        fontWeight="font-medium"
                    />

                    <Button className="bg-[#457b9d]" variant="shadow" radius="lg" size="sm">
                        <Text
                            text="Thêm ngay"
                            color="#fff"
                            fontSize="0.8rem"
                            fontWeight="font-normal"
                            href="/add-discount"
                        />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
