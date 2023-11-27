import { Breadcrumbs, Chip } from '@mui/material';
import { Button, Divider, Space, message } from 'antd';
import { arrayRemove, increment } from 'firebase/firestore';
import { t } from 'i18next';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoBookmarkSlash } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';
import { updateDocumentFields } from '~/firebase/services';
import { TabTitle } from '~/utils/generalFunctions';

const Saved = () => {
    const [t] = useTranslation('translation');
    TabTitle(t('save.saved'));

    const {
        user: { uid },
    } = useContext(AuthContext);
    const { savedShops } = useContext(AppContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!uid) {
            message.error('Bạn cần đăng nhập để xem trang này!');
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid]);
    const handleRemoveSavedShop = async (shop) => {
        const updateField = {
            followers: arrayRemove(uid),
            followersCount: increment(-1),
        };
        try {
            await updateDocumentFields('shops', shop.id, updateField);
            message.success(`Đã bỏ lưu ${shop.name}!`);
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật dữ liệu.');
        }
    };
    return (
        <div className="w-full h-full min-h-screen bg-gray-50 rounded-lg">
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pl-3 pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" className="text-black" to="saved" aria-current="page">
                    {t('save.saved')}
                </Link>
            </Breadcrumbs>
            <div className="flex items-center flex-col gap-3 mt-2">
                {savedShops.length === 0 || savedShops === null ? (
                    <NoSavedShopsMessage />
                ) : (
                    savedShops.map((shop) => {
                        return <SavedShopCard shop={shop} key={shop.id} handle={handleRemoveSavedShop} />;
                    })
                )}
            </div>
        </div>
    );
};
const SavedShopCard = ({ shop, handle }) => {
    return (
        <div className="h-auto bg-white shadow-sm shadow-stone-200 rounded-lg flex p-4 md:w-[520px] lg:w-[520px]">
            <Link
                to={`/store/${shop.shopName}`}
                className="flex-shrink-0 flex items-center justify-center align-middle"
            >
                <img src={shop.imageURL} alt={shop.name} className="w-20 h-20 md:w-32 md:h-32 object-fill rounded-lg" />
            </Link>
            <div className="ml-4 flex flex-col w-full">
                <Divider
                    style={{
                        margin: '0',
                    }}
                >
                    <Chip label={shop.name} className="font-semibold" />
                </Divider>
                <div className="line-clamp-2">{shop.description}</div>
                <Space wrap className="mt-2 flex justify-start items-center">
                    <Link to={`/store/${shop.shopName}`}>
                        <Button type="default" className={'font-semibold bg-gray-700 text-white rounded-lg'}>
                            {t('save.toStore')}
                        </Button>
                    </Link>
                    <Button
                        type="default"
                        icon={<GoBookmarkSlash />}
                        className={'flex items-center font-semibold bg-gray-700 text-white rounded-lg'}
                        onClick={() => {
                            handle(shop);
                        }}
                    >
                        {t('save.unsave')}
                    </Button>
                </Space>
            </div>
        </div>
    );
};

function NoSavedShopsMessage() {
    return <div className="flex justify-center items-center w-full h-96">{t('save.noResult')}</div>;
}
export default Saved;
