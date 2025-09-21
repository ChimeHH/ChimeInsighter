import { severityMap } from '@/utils/constant';
import { Descriptions, Tag, Tree, Typography } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreatDetail } from './service';

import styles from './style.less';

const { Text, Paragraph } = Typography;

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const baseMessageId = 'pages.detail';

const PublicDetail = () => {
  const { vid, tid } = useParams<{ vid: string; tid: string }>();
  const [version, setVersion] = useState<Version>();
  const [detail, setDetail] = useState<PublicDetail>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { formatMessage } = useIntl();

  const initPaths = useCallback((threatDetail: PublicDetail) => {
    // console.log(threatDetail);
    if (!Array.isArray(threatDetail.filepath)) {
      return;
    }

    const pathsInfo: DataNode[] = [];
    threatDetail.filepath.forEach((item) => {
      const nodeArray = item.split('/');
      let children = pathsInfo;
      nodeArray.forEach((i, index) => {
        const node: DataNode = {
          title: i,
          key: i + index,
        };
        if (index === nodeArray.length - 1) {
          node.isLeaf = true;
        }

        if (children.length === 0) {
          children.push(node);
        }

        let isExist = false;
        for (const j of children) {
          if (j.title === node.title) {
            if (!j.children) {
              j.children = [];
            }

            children = j.children;
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          children.push(node);
          if (!children[children.length - 1].children) {
            children[children.length - 1].children = [];
          }

          children = children[children.length - 1].children!;
        }
      });
    });

    setTreeData(pathsInfo);
  }, []);

  const getData = async () => {
    const res = await selectThreatDetail({
      version_id: vid,
      threat_id: tid,
    });
    if (res?.data) {
      const threatDetail = res.data.detail;
      setVersion(res.data.version);
      setDetail(threatDetail);
      initPaths(threatDetail);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: '#fff',
          fontWeight: 500,
          fontSize: 16,
          color: 'rgba(0,0,0,0.85)',
          padding: '16px 24px',
          marginBottom: 16
        }}
      >
        {version?.version_name}
      </div>
      <Descriptions title={detail?.threat_id} className={styles.panel} column={2}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.package` })}>
          {`${detail?.metadata?.component?.product} ${detail?.metadata?.component?.version}`}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.severity` })}>
          {detail?.severity && (
            <Tag
              style={{ borderColor: colorsMap[detail.severity], color: colorsMap[detail.severity] }}
            >
              {severityMap[detail.severity]}
            </Tag>
          )}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.cve` })}>
          {detail?.metadata?.cve_id ? (
            <a onClick={() => history.push(`/helpcenter/vulnerability/${detail.metadata.cve_id}`)}>
              {detail.metadata.cve_id}
            </a>
          ) : (
            <span>{formatMessage({ id: `${baseMessageId}.noCveId` })}</span>  // 可以自定义提示信息
          )}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publishDate` })}>
          {detail?.metadata.published_date && moment(detail.metadata.published_date).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.cwe` })}>
          {detail?.metadata.problem_types.map((item, index) => (
            <div key={item}>
              {index > 0 && <span style={{ padding: '0 4px', borderRight: '1px solid' }} />}
              <a onClick={() => history.push(`/helpcenter/cwe/${item.replace(/[^0-9]/gi, '')}`)}>
                {item}
              </a>
            </div>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.lastModifiedDate` })}>
          {detail?.metadata.last_modified_date && moment(detail.metadata.last_modified_date).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.exploits` })}>
          {detail?.metadata.exploits?.map((item, index) => (
            <div key={item}>
              {index > 0 && <span style={{ padding: '0 4px', borderRight: '1px solid' }} />}
              <a onClick={() => history.push(`/helpcenter/exploit/${item}`)}>
                {item}
              </a>
            </div>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label={""}>
          {""}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.desc` })}>
          {detail?.metadata.description}
        </Descriptions.Item>
      </Descriptions>

      {detail?.remediation && (
        <Descriptions
          title={formatMessage({ id: `${baseMessageId}.howToFix` })}
          className={classNames(styles.panel, styles.mt12)}
          column={2}
          layout="vertical"
        >
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.howToFix.upgrade` })}>
            {`${formatMessage({ id: `${baseMessageId}.howToFix.currentVersion` })} ${detail.version}`}
          </Descriptions.Item>
          {detail.remediation.patch_references && (
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.howToFix.patchReferences` })}>
              {detail.remediation.patch_references.references.map((item) => (
                <a key={item} href={item} target="_blank" rel="noreferrer">
                  {new URL(item).hostname}
                </a>
              ))}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.howToFix.fixedVersion` })}>
            <Tag>
              {detail.remediation.package_upgrades.not_affected_range?.version_range ??
                `≥${detail.remediation.package_upgrades.not_affected_version.name}`}
            </Tag>
            {detail.remediation.package_upgrades.not_affected_version && (
              <span>
                {moment(detail.remediation.package_upgrades.not_affected_version.date).format(
                  'YYYY/MM/DD',
                )}
              </span>
            )}
          </Descriptions.Item>
          {detail.remediation.package_upgrades.not_affected_version && (
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.howToFix.latestVersion` })}>
              <Tag>{detail.remediation.package_upgrades.not_affected_version.name}</Tag>
              <span>
                {moment(detail.remediation.package_upgrades.not_affected_version.date).format(
                  'YYYY-MM-DD',
                )}
              </span>
            </Descriptions.Item>
          )}
        </Descriptions>
      )}

      <Descriptions
        title={formatMessage({ id: `${baseMessageId}.publicInfo` })}
        className={classNames(styles.panel, styles.mt12)}
        column={1}
      >
         {!!detail?.metadata.metrics.baseMetricV2 &&(
        <Descriptions.Item>
          <Descriptions title="CVSS2" column={1}>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.base` })}>
              {detail?.metadata.metrics.baseMetricV2.cvssV2.baseScore}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.impact` })}>
              {detail?.metadata.metrics.baseMetricV2.impactScore}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.exploitability` })}>
              {detail?.metadata.metrics.baseMetricV2.exploitabilityScore}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.accessVector` })}>
              {detail?.metadata.metrics.baseMetricV2.cvssV2.accessVector}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.accessComplexity` })}>
              {detail?.metadata.metrics.baseMetricV2.cvssV2.accessComplexity}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.vector` })}>
              {detail?.metadata.metrics.baseMetricV2.cvssV2.vectorString}
            </Descriptions.Item>
          </Descriptions>
        </Descriptions.Item>
    )}
       {!!detail?.metadata.metrics.baseMetricV3 &&(
        <Descriptions.Item>
          <Descriptions title="CVSS3" column={1}>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.base` })}>
              {detail?.metadata.metrics.baseMetricV3.cvssV3.baseScore}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.impact` })}>
              {detail?.metadata.metrics.baseMetricV3.impactScore}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.exploitability` })}>
              {detail?.metadata.metrics.baseMetricV3.exploitabilityScore}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.accessVector` })}>
              {detail?.metadata.metrics.baseMetricV3.cvssV3.accessVector}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.accessComplexity` })}>
              {detail?.metadata.metrics.baseMetricV3.cvssV3.accessComplexity}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.publicInfo.vector` })}>
              {detail?.metadata.metrics.baseMetricV3.cvssV3.vectorString}
            </Descriptions.Item>
          </Descriptions>
        </Descriptions.Item>
        )}
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.publicInfo.references` })} className={styles.panel} column={1}>
        {detail?.metadata?.references?.map((reference, index) => (
          <Descriptions.Item key={index} label={`Reference ${index + 1}`}>
            <a href={reference} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
              <Text style={{ color: 'blue' }}>{reference}</Text>
            </a>
          </Descriptions.Item>
        ))}
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.publicInfo.source` })} className={styles.panel} column={1}>
        {detail?.metadata?.source?.map((source, index) => (
          <Descriptions.Item key={index} label={`Source ${index + 1}`}>
            <Text>{source}</Text>            
          </Descriptions.Item>
        ))}
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.paths` })} className={classNames(styles.panel, styles.mt12)}>
        <Descriptions.Item>
          {!!treeData.length && (
            <Tree.DirectoryTree treeData={treeData} defaultExpandAll selectable={false} />
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PublicDetail;
