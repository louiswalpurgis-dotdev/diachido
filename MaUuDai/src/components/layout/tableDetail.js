import React, { useContext, useState } from 'react';
import { convertFirestoreTimestampToTime } from '~/utils/ConvertFirestoreTimeStamp';
import formatPrice from '~/utils/formatPrice';
import UpdateIcon from '~/components/customIcons/update';
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { GoLinkExternal } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import { IconSvg } from '~/components/constant';
import { message } from 'antd';
import { AppContext } from '~/Context/AppProvider';

function createData(name, sale, startTime, endTime, url, note, code) {
    return {
        name,
        sale,
        startTime,
        endTime,
        url,
        note,
        code,
    };
}

function Row({ row }) {
    const [open, setOpen] = useState(false);
    const [t] = useTranslation('translation');
    const [translatedText, setTranslatedText] = useState(row.name);
    const [loadingTranslate, setLoadingTranslate] = useState(false);
    const { language } = useContext(AppContext);
    const [cache, setCache] = useState({});

    const handleTranslate = async () => {
        // kiểm tra ngôn ngữ hiện tại có phải là tiếng việt hay không
        if (language === 'vi') {
            message.warning('Đã là tiếng việt');
            return;
        }
        // Kiểm tra đã translate hay chưa nếu có sẽ trả về text cũ
        if (translatedText !== row.name) {
            setTranslatedText(row.name);
            return;
        }
        setLoadingTranslate(true);
        if (cache[row.name]) {
            setTranslatedText(cache[row.name]);
            setLoadingTranslate(false);
            return;
        }
        const res = await fetch('https://translate.argosopentech.com/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: row.name,
                source: 'vi',
                target: language,
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setTranslatedText(data.translatedText);
        setCache({ ...cache, [row.name]: data.translatedText });
        setLoadingTranslate(false);
    };
    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <AiOutlineUp /> : <AiOutlineDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                    <div className=" flex items-center gap-2">
                        <p className="relative">
                            {translatedText}
                            {row.code && (
                                <Tooltip title={t('storeDetail.required')} arrow>
                                    <span className="absolute top-0 -right-2 text-red-500 select-none">*</span>
                                </Tooltip>
                            )}
                        </p>
                        <IconButton
                            size="small"
                            aria-label="Translate"
                            className={`w-6 h-6 ${loadingTranslate ? 'animate-spin' : ''}`}
                            onClick={handleTranslate}
                        >
                            <UpdateIcon fill={`${translatedText !== row.name ? 'blue' : '#000000'}`} />
                        </IconButton>
                    </div>
                </TableCell>
                <TableCell align="right">{formatPrice(row.sale)}</TableCell>
                <TableCell align="right">
                    {convertFirestoreTimestampToTime(row.startTime)} - {convertFirestoreTimestampToTime(row.endTime)}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {t('sale.note')}
                            </Typography>
                            <p>{row.note}</p>
                            {row.code && (
                                <div className="mt-4 flex items-center gap-1">
                                    Code yêu cầu: <span className="font-semibold">{row.code}</span>
                                    <img
                                        src={IconSvg.copy}
                                        alt="Copy"
                                        className="h-4 w-4 cursor-pointer hover:bg-gray-200 rounded-lg"
                                        title="Sao chép"
                                        onClick={() => {
                                            navigator.clipboard.writeText(row.code);
                                            message.success('Đã sao chép mã giảm giá');
                                        }}
                                    />
                                </div>
                            )}
                            <Link
                                to={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center mt-4 gap-2 text-blue-500"
                            >
                                Xem chi tiết <GoLinkExternal size={18} />
                            </Link>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function CollapsibleTable({ data }) {
    const [t] = useTranslation('translation');
    let rows = data.map((item) =>
        createData(item.name, item.amount, item.startTime, item.endTime, item.forwardURL, item.description, item.code),
    );
    return (
        <TableContainer className="rounded-lg bg-gray-100 overflow-y-hidden">
            <Table aria-label="Đang khuyến mãi">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>
                            <span className="font-bold">{t('sale.name')}</span>
                        </TableCell>
                        <TableCell align="right">
                            <span className="font-bold">{t('sale.offer')}</span>
                        </TableCell>
                        <TableCell align="right">
                            <span className="font-bold">{t('sale.time')}</span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="odd:bg-red-500 even:bg-slate-50">
                    {rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
