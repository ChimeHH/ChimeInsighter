import React, { useEffect, useState } from 'react';
import { Descriptions, Typography } from 'antd';
import { useIntl, useParams } from 'umi';
import { getLicenseDetail } from './service';
import { LicenseDetailResponse } from './data';
import styles from './style.less';

const { Text, Paragraph } = Typography;
const baseMessageId = 'pages.license.detail';

const LicenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LicenseDetailResponse>();
  const { formatMessage, locale } = useIntl();

  // 语言翻译映射
  const localeMap: { [key: string]: string } = {
    'zh-CN': 'cn', // 中文
    'en-US': 'en', // 英文
  };

  const handleGetLicenseDetail = async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    const res = await getLicenseDetail(id);
    if (res?.data) {
      setLoading(false);
      setResult(res.data);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetLicenseDetail();
  }, [id]);

  const currentReference = result?.license?.reference[localeMap[locale]];

  return (
    <>
      <div
        style={{
          backgroundColor: '#fff',
          fontWeight: 500,
          fontSize: 16,
          color: 'rgba(0,0,0,0.85)',
          padding: '16px 24px',
          marginBottom: 16,
        }}
      >
        {`${result?.license?.license}`}
      </div>

      <Descriptions className={styles.panel} column={2}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.type` })}>
          <Text>{result?.license?.type}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.url` })}>
          <Text>{result?.license?.url || '无'}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.reference` })} className={styles.panel} column={1}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.reference.abbreviation` })}>
          <Text>{currentReference?.abbreviation}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.reference.fullName` })}>
          <Text>{currentReference?.fullName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.reference.summary` })}>
          <Paragraph>{currentReference?.summary}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.reference.usageSuggestion` })}>
          <Paragraph>{currentReference?.usageSuggestion}</Paragraph>
        </Descriptions.Item>
      </Descriptions>
    
      <Descriptions title={formatMessage({ id: `${baseMessageId}.text` })} className={styles.panel}>
        <Descriptions.Item>
          {result?.license?.text && (
            <div style={{ marginTop: 16 }}>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                <code>{result?.license?.text}</code>
              </pre>
            </div>
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default LicenseDetailPage;
