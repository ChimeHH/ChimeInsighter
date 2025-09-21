import { Descriptions, Tag, Tree, Typography } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { getLocale, useParams, history, useIntl } from 'umi';
import type { Version } from '../version/data';
import { selectFileDetail } from './service';
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

const FileDetail = () => {
  const { vid, uid } = useParams<{ vid: string; uid: string }>();
  const [version, setVersion] = useState<Version>();
  const [detail, setDetail] = useState<FileDetail>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { formatMessage } = useIntl();

  const initPaths = useCallback((fileDetail: FileDetail) => {
    // console.log(fileDetail);
    if (!Array.isArray(fileDetail.filepath)) {
      return;
    }

    const pathsInfo: DataNode[] = [];
    fileDetail.filepath.forEach((item) => {
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
    const res = await selectFileDetail({
      uid: uid,
    });
    if (res?.data) {
      const fileDetail = res.data.file;
      setVersion(res.data.version);
      setDetail(fileDetail);
      initPaths(fileDetail);
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
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.file` })}>
          {`${detail?.checksum} ${detail?.version}`}
        </Descriptions.Item>

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.filepath` })}>
          {detail?.filepath_r?.map((path, index) => (
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
      
    </>
  );
};

export default FileDetail;
