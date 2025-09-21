import { selectUsers } from '@/services/user';
import { useRequest } from 'ahooks';

export default () => {
    const { data: users, loading: loading, run } = useRequest(async () => {
        const res = await selectUsers();
        const userArr = res?.data?.users;
        if (Array.isArray(userArr)) {
        return userArr;
        }
        return [];
    }, {
        manual: true,
    });

    return {
        users,
        loading,
        run
    };
};
