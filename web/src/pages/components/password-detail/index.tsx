import { severityMap } from '@/utils/constant';
import { Descriptions, Tag, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useParams, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreatDetail } from './service';

import styles from './style.less';

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const baseMessageId = 'pages.detail';

const PasswordDetail = () => {
  const { vid, tid } = useParams<{ vid: string; tid: string }>();
  const [version, setVersion] = useState<Version>();
  const [detail, setDetail] = useState<PasswordDetail>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { formatMessage } = useIntl();

  const initPaths = (threatDetail: PasswordDetail) => {
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
  };

  const getThreatDetail = async () => {
    const res = await selectThreatDetail({      
      threat_id: tid,
    });
    
    if (res?.data) {
      const threatDetail = res.data.detail;      
      setVersion(res.data.version);
      setDetail(threatDetail);
      initPaths(threatDetail);
    }
  };

  const getData = async () => {    
    await getThreatDetail();
  };

  useEffect(() => {
    getData();    
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
          marginBottom: 16,
        }}
      >
        {version?.version_name && detail?.threat_id ? `${version.version_name} / ${detail.threat_id}` : version?.version_name}
      </div>
      
      <Descriptions title={ formatMessage({ id: `${baseMessageId}.properties` }) } className={styles.panel} column={2}>        
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.severity` })}>
          {
            <Tag
              style={{ borderColor: colorsMap[detail?.severity], color: colorsMap[detail?.severity] }}
            >
              {severityMap[detail?.severity]}
            </Tag>
          }
        </Descriptions.Item>
        
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.type` })}>
          {detail?.sub_type}
        </Descriptions.Item>
        
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.data` })}>
          {detail?.metadata.text}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.offset` })}>
          {detail?.metadata.offset}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.password` })}>
          {detail?.metadata.password}
        </Descriptions.Item>         
        
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.type` })}>
          {detail?.metadata.type}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        title={formatMessage({ id: `${baseMessageId}.paths` })}
        className={classNames(styles.panel, styles.mt12)}
      >
        <Descriptions.Item>
          {!!treeData.length && (
            <Tree.DirectoryTree treeData={treeData} defaultExpandAll selectable={false} />
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PasswordDetail;
