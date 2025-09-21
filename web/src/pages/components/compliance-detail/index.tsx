import path from 'path';
import { Descriptions, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useParams, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectThreatDetail } from './service';

import styles from './style.less';

const baseMessageId = 'pages.detail';

const ComplianceDetail = () => {
  const { vid, tid } = useParams<{ vid: string; tid: string }>();
  const [version, setVersion] = useState<Version>();
  const [detail, setDetail] = useState<ComplianceDetail>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { formatMessage } = useIntl();

  const initPaths = (threatDetail: ComplianceDetail) => {
    if (!Array.isArray(threatDetail.filepath)) {
      return;
    }

    const pathsInfo: DataNode[] = [];
    threatDetail.filepath.forEach((item) => {
      const nodeArray = item.split(path.sep);
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

  const getData = async () => {
    const res = await selectThreatDetail({
      threat_id: tid,
    });

    // console.log('Threat Detail:', res);

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
          marginBottom: 16,
        }}
      >
        {version?.version_name}
      </div>
      <Descriptions title={detail?.sub_type} className={styles.panel} column={1}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.rule` })}>
          {detail?.metadata.name}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.explanation` })}>
          {detail?.metadata.description}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.severity` })}>
          {detail?.severity}
        </Descriptions.Item>        
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.function` })}>
          {detail?.metadata?.function}
        </Descriptions.Item>         
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.languages` })}>
          {detail?.metadata?.languages}
        </Descriptions.Item>    
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.requiredState` })}>
          {detail?.metadata?.state}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.source` })}>
          {detail?.metadata?.source}
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

export default ComplianceDetail;
