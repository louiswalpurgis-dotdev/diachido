import { Button, Modal, QRCode, Tooltip, message } from 'antd';
import { List, TextField } from '@mui/material';
import {
    FacebookShareButton,
    FacebookIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    TelegramShareButton,
    TelegramIcon,
} from 'next-share';

import { useContext, useState } from 'react';
import { AppContext } from '~/Context/AppProvider';
import { useTranslation } from 'react-i18next';
import { IconSvg } from '~/components/constant';

const ShareComponent = ({ url, shopName = null }) => {
    const [t] = useTranslation('translation');
    const [type, setType] = useState('share'); //share, qr
    const { openShareModel, setOpenShareModel } = useContext(AppContext);
    const handleCopyUrl = (url) => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    message.info('Đã sao chép liên kết vào bộ nhớ tạm.');
                })
                .catch((error) => {
                    message.error('Sao chép liên kết thất bại.');
                });
        } else {
            message.error('Trình duyệt không hỗ trợ sao chép liên kết.');
        }
        setOpenShareModel(false);
    };
    return (
        <Modal
            title={`${t('share.name')}:`}
            open={openShareModel}
            className="shadow-md shadow-red-100 rounded-lg"
            footer={null}
            centered
            onCancel={() => {
                setOpenShareModel(false);
                setType('share');
            }}
        >
            {type === 'share' ? (
                <>
                    <List className="flex items-center gap-2 md:gap-4">
                        <FacebookShareButton
                            url={url}
                            quote={
                                shopName
                                    ? 'Cập nhật ưu đãi của ' + shopName + ' mới nhất!'
                                    : 'Xem các ưu đãi mới nhất tại DiaChiDo'
                            }
                            hashtag={'#diachido'}
                        >
                            <Tooltip title={`${t('share.shareTo')} Facebook`}>
                                <div className="flex flex-col items-center gap-1">
                                    <FacebookIcon className="w-8 h-8 md:w-10 md:h-10" round />
                                    <p className="text-xs md:text-sm">Facebook</p>
                                </div>
                            </Tooltip>
                        </FacebookShareButton>
                        <FacebookMessengerShareButton url={url} appId={''}>
                            <Tooltip title={`${t('share.shareTo')} Messenger`}>
                                <div className="flex flex-col items-center gap-1">
                                    <FacebookMessengerIcon className="w-8 h-8 md:w-10 md:h-10" round />
                                    <p className="text-xs md:text-sm">Messenger</p>
                                </div>
                            </Tooltip>
                        </FacebookMessengerShareButton>
                        <TelegramShareButton
                            url={url}
                            title={
                                shopName
                                    ? 'Cập nhật ưu đãi của ' + shopName + ' mới nhất!'
                                    : 'Xem các ưu đãi mới nhất tại DiaChiDo'
                            }
                        >
                            <Tooltip title={`${t('share.shareTo')} Telegram`}>
                                <div className="flex flex-col items-center gap-1">
                                    <TelegramIcon className="w-8 h-8 md:w-10 md:h-10" round />
                                    <p className="text-xs md:text-sm">Telegram</p>
                                </div>
                            </Tooltip>
                        </TelegramShareButton>
                        <WhatsappShareButton
                            url={url}
                            title={
                                shopName
                                    ? 'Cập nhật ưu đãi của ' + shopName + ' mới nhất!'
                                    : 'Xem các ưu đãi mới nhất tại DiaChiDo'
                            }
                            separator=":: "
                        >
                            <Tooltip title={`${t('share.shareTo')} Whatsapp`}>
                                <div className="flex flex-col items-center gap-1">
                                    <WhatsappIcon className="w-8 h-8 md:w-10 md:h-10" round />
                                    <p className="text-xs md:text-sm">Whatsapp</p>
                                </div>
                            </Tooltip>
                        </WhatsappShareButton>
                        <TwitterShareButton
                            url={url}
                            title={
                                shopName
                                    ? 'Cập nhật ưu đãi của ' + shopName + ' mới nhất!'
                                    : 'Xem các ưu đãi mới nhất tại DiaChiDo'
                            }
                        >
                            <Tooltip title={`${t('share.shareTo')} Twitter`}>
                                <div className="flex flex-col items-center gap-1">
                                    <TwitterIcon className="w-8 h-8 md:w-10 md:h-10" round />
                                    <p className="text-xs md:text-sm">Twitter</p>
                                </div>
                            </Tooltip>
                        </TwitterShareButton>
                        <button
                            onClick={() => {
                                setType('qr');
                            }}
                        >
                            <Tooltip title="QR">
                                <div className="flex flex-col items-center gap-1">
                                    <img src={IconSvg.qr} className="w-8 h-8 md:w-10 md:h-10" />
                                    <p className="text-xs md:text-sm">QR</p>
                                </div>
                            </Tooltip>
                        </button>
                    </List>
                    <div className="flex items-center border rounded-xl px-2 mt-4">
                        <TextField
                            defaultValue={url}
                            size="middle"
                            InputProps={{
                                readOnly: true,
                            }}
                            className="noBorder flex-grow"
                        />
                        <button
                            className="flexStart cursor-pointer rounded-full bg-blue-700 w-auto py-2 px-4"
                            onClick={() => {
                                handleCopyUrl(url);
                            }}
                        >
                            <p className="font-bold text-white whitespace-nowrap ">{t('share.copy')}</p>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div id="myqrcode" className="flex flex-col justify-center items-center">
                        <QRCode
                            value={url}
                            bgColor="#fff"
                            style={{
                                marginBottom: 16,
                            }}
                        />
                        <Button type="primary" className="bg-blue-500" onClick={downloadQRCode}>
                            Tải xuống
                        </Button>
                    </div>
                    <Button type="text" onClick={() => setType('share')}>
                        <img src={IconSvg.arrowLeft} />
                    </Button>
                </>
            )}
        </Modal>
    );
};

const downloadQRCode = () => {
    const canvas = document.getElementById('myqrcode')?.querySelector('canvas');
    if (canvas) {
        const url = canvas.toDataURL();
        const a = document.createElement('a');
        a.download = 'QRCode.png';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

export default ShareComponent;
