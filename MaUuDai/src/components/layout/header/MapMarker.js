import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '~/Context/AppProvider';
import { IconSvg } from '~/components/constant';

const DropdownOption = ({ option, handleOptionSelect, t }) => {
    const { district } = useContext(AppContext);
    return (
        <Link
            to="#"
            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                option.value === district ? 'bg-gray-100' : ''
            }`}
            onClick={() => {
                handleOptionSelect(option);
            }}
        >
            {option.value === '1' ? t('all') : option.label}
        </Link>
    );
};

const MapMarker = ({ t }) => {
    const MapMarkerRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Khu vực');
    const { setDistrict, districtOptions } = useContext(AppContext);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option.label);
        setIsOpen(false);
        setDistrict(option.value);
    };

    useEffect(() => {
        // Định nghĩa hàm để đóng menu
        let closeMenu = (e) => {
            if (!MapMarkerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        // Lắng nghe sự kiện click trên document
        document.addEventListener('mousedown', closeMenu);

        // Cleanup: Gỡ bỏ lắng nghe sự kiện khi component bị hủy
        return () => {
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    return (
        <div className="flexCenter" ref={MapMarkerRef}>
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className={`inline-flex items-center justify-between w-28 radiusButton bgBlur animation200 hover:scale-105 ${
                        isOpen ? 'bg-gray-200/30 focus-within:bg-white/70' : 'bg-gray-200/30'
                    }`}
                    onClick={toggleDropdown}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    <span className="flexStart overflow-hidden">
                        <p className="truncate">{selectedOption === 'all' ? t('all') : selectedOption}</p>
                    </span>
                    <img
                        src={IconSvg.expandArrow}
                        alt="arrow-down"
                        className={`-mr-1 ml-2 h-3 w-3 transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div
                        className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <div className="py-1" role="none">
                            <p className="font-light text-xs my-1 ml-2">Đà Nẵng:</p>
                            {districtOptions.map((option) => (
                                <DropdownOption
                                    key={option.value}
                                    option={option}
                                    t={t}
                                    handleOptionSelect={handleOptionSelect}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapMarker;
