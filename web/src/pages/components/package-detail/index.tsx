import { Descriptions, Tag, Tree, Typography } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { getLocale, useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectPackageDetail } from './service';
import ReactMarkdown from 'react-markdown';

import styles from './style.less';

const { Text, Paragraph } = Typography;

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const locale = getLocale();

const baseMessageId = 'pages.detail';

const PackageDetail = () => {
  const { vid, uid } = useParams<{ vid: string; uid: string }>();
  const [version, setVersion] = useState<Version>();
  const [detail, setDetail] = useState<PackageDetail>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { formatMessage } = useIntl();

  const initPaths = useCallback((packageDetail: PackageDetail) => {
    // console.log(packageDetail);
    if (!Array.isArray(packageDetail.filepath)) {
      return;
    }

    const pathsInfo: DataNode[] = [];
    packageDetail.filepath.forEach((item) => {
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
    const res = await selectPackageDetail({
      uid: uid,
    });
    if (res?.data) {
      const packageDetail = res.data.package;
      setVersion(res.data.version);
      setDetail(packageDetail);
      initPaths(packageDetail);
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
      <Descriptions title={detail?.uid} className={styles.panel} column={2}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.package` })}>
          {`${detail?.fullname} ${detail?.version}`}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.release_time` })}>
          {detail?.release_time}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.checksum` })}>
          {detail?.checksum}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.integrity` })}>
          {detail?.integrity}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.scale` })}>
          {detail?.scale}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.fullname` })}>
          {detail?.fullname}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.version` })}>
          {detail?.version}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.copyrights` })}>
          {detail?.copyrights?.map((copyright, index) => (
            <p key={index}>{copyright}</p>
          ))}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.downloadurl` })}>
          {detail?.downloadurl}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.filepath` })}>
          {detail?.filepath?.map((path, index) => (
            <p key={index}>{path}</p>
          ))}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title={formatMessage({ id: `${baseMessageId}.paths` })} className={classNames(styles.panel, styles.mt12)}>
        <Descriptions.Item>
          {!!treeData.length && (
            <Tree.DirectoryTree treeData={treeData} defaultExpandAll selectable={false} />
          )}
        </Descriptions.Item>
      </Descriptions>
      
      <Descriptions title={formatMessage({ id: `${baseMessageId}.licenses` })} className={styles.panel} column={1}>
        {detail?.licenses?.map((license, index) => {
          const referenceData = locale === 'zh-CN' ? license?.reference?.cn : license?.reference?.en;

          return (
            <Descriptions.Item key={index} label={`License ${index + 1}`}>
              <div key={index}>
                <p> {`${license?.license}, ${referenceData?.fullName}, ${license?.type}, ${license?.url}`}</p>                              
                <p>{referenceData?.summary}</p>
                <p>{referenceData?.usageSuggestion}</p>           
                <ReactMarkdown>{license?.comments}</ReactMarkdown>
              </div>
            </Descriptions.Item>
          );
        })}
      </Descriptions>

    </>
  );
};

export default PackageDetail;
