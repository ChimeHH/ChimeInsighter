import React, { useEffect, useState } from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';
import { fetchVendorInfo } from '@/services/systemInfo';

const Footer: React.FC = () => {
    const { formatMessage } = useIntl();
    
    // 新增 state 存储供应商信息
    const [vendorInfo, setVendorInfo] = useState<{ title: string; subTitle: string }>({
        title: '',
        subTitle: '',
    });

    // 获取供应商信息
    const loadVendorInfo = async () => {
        const info = await fetchVendorInfo();
        setVendorInfo(info);
    };

    useEffect(() => {
        loadVendorInfo();
    }, []);

    const currentYear = new Date().getFullYear();
    const defaultSubTitle = vendorInfo.subTitle || formatMessage({ id: 'app.subTitle' });

    return (
        <DefaultFooter copyright={`${currentYear} ${defaultSubTitle}`} />
    );
};

export default Footer;
