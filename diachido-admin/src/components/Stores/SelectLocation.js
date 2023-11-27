import { useEffect, useMemo, useState } from 'react';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { SelectorIcon } from '../Icons';
import { findLevel1ById } from 'dvhcvn';

export default function SelectLocation({ completedAddress, setCompletedAddress, index, hasAddress }) {
    const [selectedDistrict, setSelectedDistrict] = useState(new Set([]));
    const [selectedVillage, setSelectedVillage] = useState(new Set([]));
    const [address, setAddress] = useState('');

    const districts = useMemo(() => findLevel1ById('48').children, []);
    const villages = useMemo(() => {
        if (selectedDistrict.size === 0) return [];
        const keySearch = selectedDistrict.currentKey || selectedDistrict.values().next().value;
        return districts.find((district) => district.name.includes(keySearch)).children;
    }, [selectedDistrict, districts]);

    useEffect(() => {
        const updatedAddress = [...completedAddress];
        if (selectedVillage.size === 0 || !address) {
            updatedAddress[index] = '';
            setCompletedAddress(updatedAddress);
            return;
        }
        if (address) {
            const village = selectedVillage.currentKey || selectedVillage.values().next().value;
            const district = selectedDistrict.currentKey || selectedDistrict.values().next().value;
            let newAddress = `${address}, ${village}, ${district}, Đà Nẵng`;
            updatedAddress[index] = newAddress;
            setCompletedAddress(updatedAddress);
        }
    }, [selectedVillage, address, completedAddress, index, setCompletedAddress, selectedDistrict]);

    useEffect(() => {
        if (hasAddress) {
            const splittedAddress = hasAddress.split(', ');
            setAddress(splittedAddress[0]);
            setSelectedDistrict(new Set([splittedAddress[2]]));
            setSelectedVillage(new Set([splittedAddress[1]]));
        }
    }, [hasAddress, villages]);
    return (
        <div className="flex items-center justify-center">
            <Select
                items={districts}
                isRequired
                label="Thành phố"
                variant="flat"
                selectionMode="single"
                selectorIcon={<SelectorIcon />}
                placeholder="Đà Nẵng"
                className="mx-4 w-1/4 min-w-max"
                color="secondary"
                isDisabled
            ></Select>
            <Select
                items={districts}
                selectedKeys={selectedDistrict}
                onSelectionChange={setSelectedDistrict}
                isRequired
                label="Quận/Huyện"
                variant="flat"
                selectionMode="single"
                selectorIcon={<SelectorIcon />}
                placeholder="Chọn quận/huyện"
                className="mx-4 w-1/4 min-w-max"
            >
                {(district) => (
                    <SelectItem key={district.name} textValue={district.name}>
                        {district.name}
                    </SelectItem>
                )}
            </Select>
            <Select
                items={villages}
                selectedKeys={selectedVillage}
                onSelectionChange={setSelectedVillage}
                label="Phường/Xã"
                variant="flat"
                selectionMode="single"
                selectorIcon={<SelectorIcon />}
                placeholder="Chọn phường/xã"
                className="mx-4 w-1/4 min-w-max"
                isDisabled={selectedDistrict === ''}
            >
                {(village) => (
                    <SelectItem key={village.name} textValue={village.name}>
                        {village.name}
                    </SelectItem>
                )}
            </Select>
            <Input
                type="text"
                variant="flat"
                label="Địa Chỉ"
                isRequired
                value={address}
                onValueChange={setAddress}
                placeholder="Nhập địa chỉ cửa hàng"
                isDisabled={selectedDistrict.size === 0}
                className="mx-4 w-1/4 min-w-max"
            />
        </div>
    );
}
