import useLatestCommentsAndUsers from '~/services/useLatestCommentsAndUsers';
import getUserForComment from '~/utils/getUserForComment';

import { Tooltip, Dropdown, Modal, Input, Button, message } from 'antd';
import { addDocument, deleteDocument, updateDocumentFields } from '~/firebase/services';

import { LuMoreHorizontal, LuEdit3 } from 'react-icons/lu';
import { BsTrash3 } from 'react-icons/bs';
import { AiOutlineSortAscending, AiOutlineSortDescending, AiOutlineSend } from 'react-icons/ai';
import { Timestamp } from 'firebase/firestore';
import formatTimeToNow from '~/utils/formatDistanceToNow';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '~/Context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { AppContext } from '~/Context/AppProvider';

const { TextArea } = Input;
function Comment({ shopDetail }) {
    const [t] = useTranslation('translation');
    const { language } = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [idCommentModal, setIdCommentModal] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [titleCommentModal, setTitleCommentModal] = useState('');
    const [commentModalContent, setCommentModalContent] = useState('');
    const [loadingSubmitComment, setLoadingSubmitComment] = useState(false);
    const [sortType, setSortType] = useState('newest'); // ['newest', 'oldest']
    const [limitComment, setLimitComment] = useState(10);

    const commentCondition = useMemo(() => {
        return {
            fieldName: 'shopID',
            operator: '==',
            compareValue: shopDetail.id,
        };
    }, [shopDetail]);

    const { latestComments: comments, usersForComments: users } = useLatestCommentsAndUsers(commentCondition, null);

    const submitComment = async () => {
        if (!uid) {
            message.error('Bạn cần đăng nhập để bình luận !');
            return;
        }
        if (!comment) {
            message.error('Bạn cần nhập nội dung bình luận !');
            return;
        }
        try {
            setLoadingSubmitComment(true);
            const CommentData = {
                shopID: shopDetail.id,
                uid: uid,
                content: comment,
                createdAt: Timestamp.now(),
            };
            await addDocument('comments', CommentData);
            message.success('Bình luận thành công !');
            setComment('');
            setLoadingSubmitComment(false);
        } catch (error) {
            message.error('Đã xảy ra lỗi khi bình luận.');
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitComment();
        }
    };
    const showCommentModal = () => {
        setOpenCommentModal(true);
    };
    const handleCommentModalOK = async () => {
        setConfirmLoading(true);
        if (titleCommentModal === t('comment.deleteTitle')) {
            // Xóa bình luận
            try {
                await deleteDocument('comments', idCommentModal);
                message.success('Xóa bình luận thành công !');
            } catch (error) {
                message.error('Đã xảy ra lỗi khi xóa bình luận.');
            }
        } else {
            // Chỉnh sửa bình luận
            try {
                updateDocumentFields('comments', idCommentModal, {
                    content: commentModalContent,
                });
                message.success('Chỉnh sửa bình luận thành công !');
            } catch (error) {
                message.error('Đã xảy ra lỗi khi chỉnh sửa bình luận.');
            }
        }
        setOpenCommentModal(false);
        setConfirmLoading(false);
    };
    const handleCommentModalCancel = () => {
        setCommentModalContent('');
        setOpenCommentModal(false);
    };

    return (
        <div className="rounded-lg w-full h-auto mb-4 pb-4">
            <div className="flex items-center mx-auto pl-4 py-2 max-w-[600px] bg-white rounded-full shadow-amber-200 shadow-sm">
                <Tooltip title={t('comment.sort')}>
                    {sortType === 'newest' ? (
                        <Button
                            type="link"
                            className="text-black bg-gray-100 p-1 rounded-full"
                            onClick={() => {
                                setSortType('oldest');
                            }}
                        >
                            <AiOutlineSortAscending size={24} />
                        </Button>
                    ) : (
                        <Button
                            type="link"
                            className="text-black bg-gray-100 p-1 rounded-full"
                            onClick={() => {
                                setSortType('newest');
                            }}
                        >
                            <AiOutlineSortDescending size={24} />
                        </Button>
                    )}
                </Tooltip>
                <TextArea
                    placeholder={!uid ? t('comment.requireUser') : t('comment.placehoder')}
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    onKeyDown={handleKeyDown}
                    title={!uid ? t('comment.requireUser') : null}
                    autoSize
                    disabled={!uid || loadingSubmitComment ? true : false}
                    className="focus:outline-none w-full border-none outline-none focus:ring-0 shadow-none "
                />
                <Button
                    type="link"
                    className="text-black"
                    loading={loadingSubmitComment}
                    onClick={!loadingSubmitComment ? submitComment : null}
                    disabled={!uid}
                >
                    {loadingSubmitComment ? null : (
                        <i className="rounded-full bg-gray-200 px-3 py-1 flexCenter -mt-1">
                            <AiOutlineSend size={24} />
                        </i>
                    )}
                </Button>
            </div>
            {/* Bình luận */}
            <div className="mx-auto max-w-[600px] bg-white pb-4 mt-2 rounded-lg shadow-sm shadow-gray-300">
                {comments.length > 0 ? (
                    sortComment(comments, sortType)
                        .slice(0, limitComment)
                        .map((comment) => {
                            const itemsForComments = [
                                {
                                    key: 'delete',
                                    label: t('comment.delete'),
                                    action: () => {
                                        setIdCommentModal(comment.id);
                                        setTitleCommentModal(`${t('comment.deleteTitle')}`);
                                        setCommentModalContent(`${t('comment.deleteConfirm')}`);
                                        showCommentModal();
                                    },
                                },
                                {
                                    key: 'edit',
                                    label: t('comment.edit'),
                                    action: () => {
                                        setIdCommentModal(comment.id);
                                        setTitleCommentModal(t('comment.editTitle'));
                                        setCommentModalContent(comment.content);
                                        showCommentModal();
                                    },
                                },
                            ];
                            const user = getUserForComment(comment.uid, users);
                            const timeAgo = formatTimeToNow(comment.createdAt.toDate(), language);
                            return (
                                <div className="rounded-lg bg-white flex p-2" key={comment.id}>
                                    <img src={user?.photoURL} alt="" className="w-12 h-12 rounded-full" />
                                    <div className="flex flex-col ml-2 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <h3 className="font-bold">{user?.displayName}</h3>
                                                <span className="ml-2 text-xs text-gray-400">
                                                    {timeAgo} {t('comment.timeAgo')}
                                                </span>
                                            </div>
                                            {uid === comment.uid && (
                                                <Dropdown
                                                    menu={{
                                                        items: itemsForComments.map((item) => {
                                                            return {
                                                                key: item.key,
                                                                label: (
                                                                    <button
                                                                        className="flex items-center gap-3"
                                                                        onClick={item.action}
                                                                    >
                                                                        {item.key === 'delete' ? (
                                                                            <BsTrash3 size={16} />
                                                                        ) : (
                                                                            <LuEdit3 size={16} />
                                                                        )}
                                                                        <span className="font-semibold">
                                                                            {item.label}
                                                                        </span>
                                                                    </button>
                                                                ),
                                                            };
                                                        }),
                                                    }}
                                                    placement="bottomRight"
                                                    trigger={['click']}
                                                    arrow={{
                                                        pointAtCenter: true,
                                                    }}
                                                >
                                                    <button type="text" className="p-1 hover:bg-gray-100 rounded-full">
                                                        <LuMoreHorizontal size={16} />
                                                    </button>
                                                </Dropdown>
                                            )}
                                        </div>
                                        <div className="line-clamp-3">{comment.content}</div>
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <div className="w-full mx-auto text-center py-4">{t('comment.noResult')}</div>
                )}
                {limitComment <= comments.length && (
                    <div className="flex justify-center items-center">
                        <button
                            type="text"
                            onClick={() => {
                                setLimitComment((prev) => prev + 10);
                            }}
                            className="mb-2"
                        >
                            {t('comment.loadMore')}
                        </button>
                    </div>
                )}
                <Modal
                    title={titleCommentModal}
                    open={openCommentModal}
                    onOk={handleCommentModalOK}
                    onCancel={handleCommentModalCancel}
                    confirmLoading={confirmLoading}
                    footer={[
                        <Button
                            key="cancel"
                            type="default"
                            onClick={handleCommentModalCancel}
                            style={{ background: 'white' }}
                        >
                            {t('comment.cancel')}
                        </Button>,
                        <Button key="ok" type="primary" onClick={handleCommentModalOK} className="bg-blue-600">
                            {t('comment.ok')}
                        </Button>,
                    ]}
                >
                    {commentModalContent === t('comment.deleteConfirm') ? (
                        commentModalContent
                    ) : (
                        <Input.TextArea
                            rows={4}
                            value={commentModalContent}
                            onChange={(e) => setCommentModalContent(e.target.value)}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
}
function sortComment(comments, type) {
    if (type === 'newest') {
        return comments.sort((a, b) => b.createdAt - a.createdAt);
    } else {
        return comments.sort((a, b) => a.createdAt - b.createdAt);
    }
}
export default Comment;
