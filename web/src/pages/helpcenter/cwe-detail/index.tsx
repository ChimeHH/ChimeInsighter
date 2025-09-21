import React, { useEffect, useState } from 'react';
import { Descriptions, Typography, Row, Col, Tag } from 'antd';
import { useIntl, useParams, history } from 'umi';
import { getCweDetail } from './service';
import { CweDetailResponse } from './data';
import styles from './style.less'; // 确保 styles 被正确导入

const { Text, Paragraph } = Typography;

const baseMessageId = 'pages.cwe.detail';

const CweDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CweDetailResponse>();
  const { formatMessage } = useIntl();

  const handleGetCweDetail = async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    const res = await getCweDetail(id);
    if (res?.data) {
      setLoading(false);
      setResult(res.data);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetCweDetail();
  }, [id]);

  // 替换分号为换行符
  const replaceSemicolonWithNewLine = (code: string | null) => {
    if (code === null) {
      return ''; // 或者返回其他默认值
    }
    return code.replace(/;/g, ';\n');
  };


  // 处理 CWE ID 点击事件
  const handleCweIdClick = (cweId: string) => {
    history.push(`/helpcenter/cwe/CWE-${cweId}`);
  };

  // 处理 CVE ID 点击事件
  const handleCveIdClick = (cveId: string) => {
    history.push(`/helpcenter/vulnerability/${cveId}`);
  };

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
        {`${result?.cwe?.cwe_id} / ${result?.cwe?.name}`}
      </div>

      <Descriptions className={styles.panel} column={2}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.status` })}>
          <Text>{result?.cwe?.status}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.structure` })}>
          <Text>{result?.cwe?.structure}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.abstraction` })}>
          <Text>{result?.cwe?.abstraction}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.webLink` })}>
          <a href={result?.cwe?.web_link} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}> {/* 将 webLink 颜色改为蓝色 */}
            <Text style={{ color: 'blue' }}>{result?.cwe?.web_link}</Text> {/* 确保 Text 的颜色也是蓝色 */}
          </a>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.description` })} className={styles.panel} column={1} layout="vertical">
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
          <Paragraph>{result?.cwe?.description}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.extendedDescription` })}>
          <Paragraph>{result?.cwe?.extended_description}</Paragraph>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.applicablePlatforms` })} className={styles.panel} column={2}>
        {result?.cwe?.applicable_platforms.map((platform, index) => (
          <Descriptions.Item key={index} label={`${platform.Class} - ${platform.Prevalence}`}>
            <Text>{platform.Class} - {platform.Prevalence}</Text>
          </Descriptions.Item>
        ))}
      </Descriptions>

      {result?.cwe?.demonstrative_examples.map((example, index) => (
        <div key={index} style={{ marginTop: 16 }}>
          <Descriptions title={formatMessage({ id: `${baseMessageId}.demonstrativeExample` }, { index: index + 1 })} className={styles.panel} column={1} layout="vertical">
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.demonstrativeExample.introText` })}>
              <Paragraph strong>{example.Intro_Text}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.demonstrativeExample.exampleCode` })}>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                <code>
                  {replaceSemicolonWithNewLine(example.Example_Code.Code)}
                </code>
              </pre>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ))}

      {result?.cwe?.observed_examples.map((example, index) => (
        <div key={index} style={{ marginTop: 16 }}>
          <Descriptions title={formatMessage({ id: `${baseMessageId}.observedExample` }, { index: index + 1 })} className={styles.panel} column={1} layout="vertical">
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.observedExample.description` })}>
              <Paragraph strong>{example.Description}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.observedExample.reference` })}>
              {example.Reference.startsWith('CVE-') ? (
                <a onClick={() => handleCveIdClick(example.Reference)} style={{ cursor: 'pointer', color: 'blue' }}> {/* 将 CVE 链接颜色改为蓝色 */}
                  <Text style={{ color: 'blue' }}>{example.Reference}</Text> {/* 确保 Text 的颜色也是蓝色 */}
                </a>
              ) : (
                <Text>{example.Reference}</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ))}

      {result?.cwe?.potential_mitigations.map((mitigation, index) => (
        <div key={index} style={{ marginTop: 16 }}>
          <Descriptions title={formatMessage({ id: `${baseMessageId}.potentialMitigation` }, { index: index + 1 })} className={styles.panel} column={1} layout="vertical">
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.potentialMitigation.phase` })}>
              <Paragraph strong>{mitigation.Phase}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.potentialMitigation.description` })}>
              <Paragraph>{mitigation.Description}</Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ))}

      {result?.cwe?.related_weaknesses.map((weakness, index) => (
        <div key={index} style={{ marginTop: 16 }}>
          <Descriptions title={formatMessage({ id: `${baseMessageId}.relatedWeakness` }, { index: index + 1 })} className={styles.panel} column={2} layout="horizontal">
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.relatedWeakness.cweId` })}>
              <Paragraph strong>{weakness.CWE_ID}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.relatedWeakness.nature` })}>
              <Paragraph>{weakness.Nature}</Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ))}

      {/* 增加 view 部分的显示 */}
      {result?.view.map((view, index) => (
        <div key={index} style={{ marginTop: 16 }}>
          <Descriptions title={view.name} className={styles.panel} column={1} layout="vertical">
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.view.objective` })}>
              <Paragraph>{view.objective}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.view.status` })}>
              <Descriptions column={2}>
                <Descriptions.Item label="状态">
                  <Paragraph>{view.status}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="类型">
                  <Paragraph>{view.type}</Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.view.members` })}>
              <Paragraph>
                {view.members.map((member, idx) => (
                  <span key={idx} style={{ marginRight: 8 }}>
                    <a onClick={() => handleCweIdClick(member)} style={{ cursor: 'pointer', color: 'blue' }}> {/* 将 members 中的 ID 颜色改为蓝色 */}
                      {member}
                    </a>
                    {idx < view.members.length - 1 && ', '}
                  </span>
                ))}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ))}
    </>
  );
};

export default CweDetailPage;
