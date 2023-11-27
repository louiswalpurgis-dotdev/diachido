import { useMemo } from 'react';
import useFirestore from '~/hooks/useFirestore';

function useLatestCommentsAndUsers(condition, limit) {
    const { documents: latestComments } = useFirestore('comments', condition, limit);

    const uids = useMemo(() => {
        return latestComments.map((item) => item.uid);
    }, [latestComments]);

    const userForCommentCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: uids,
        };
    }, [uids]);

    const { documents: usersForComments } = useFirestore('users', userForCommentCondition);

    return {
        latestComments,
        usersForComments,
    };
}

export default useLatestCommentsAndUsers;
