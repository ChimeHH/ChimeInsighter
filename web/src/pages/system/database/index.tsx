import { download } from '@/utils/common';
import { Button, Card, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'umi';
import {
  backupDatabase,
  restoreDatabase
} from './service';

const Database = () => {
  const [downloadInfo, setDownloadInfo] = useState<ActionInfo>({});
  const [uploadInfo, setUploadInfo] = useState<ActionInfo>({});    
  const [loading, setLoading] = useState(true);
  const { formatMessage } = useIntl();

  const downloadFile = async () => {
    const hide = message.loading(formatMessage({ id: 'pages.database.pending' })); // 显示下载中提示
  
    try {
      const res = await backupDatabase(); // 调用备份数据库接口
      hide(); // 隐藏加载提示      
      setLoading(true);

      if (res) {
        const fileName = `database_backup_${moment().format('YYYYMMDDHHmmss')}.tar.gz`; // 文件名
        download(res, fileName); // 直接调用下载
        
        message.success(formatMessage({ id: 'pages.database.backup.success' })); // 成功提示
      }
    } catch (error) {
      hide(); // 隐藏加载提示      
      setLoading(false);
    }
  };
    

  const uploadFile = async ({ file }: { file: string | Blob | RcFile }) => {
    setUploadInfo({
      loading: true,
    });
    const hide = message.loading(formatMessage({ id: 'pages.database.pending' }), 0);
    const res = await restoreDatabase({ file });
    if(res.status_code === 0) {
      hide();
      setUploadInfo({
        loading: false,
      });
      message.success(formatMessage({ id: 'pages.database.restore.success' }));
      return;
    }

    hide();
    setUploadInfo({
      loading: false,
    });
  };

  return (
    <>
      <Card bordered={false} title={formatMessage({ id: 'pages.database.backup' })}>
        <Button onClick={downloadFile} loading={downloadInfo.loading}>
          {formatMessage({ id: 'pages.database.backup' })}
        </Button>
      </Card>
      <Card
        bordered={false}
        style={{ marginTop: 24 }}
        title={formatMessage({ id: 'pages.database.restore' })}
      >
        <Upload
          disabled={uploadInfo.loading}
          showUploadList={false}
          multiple={false}
          customRequest={uploadFile}
          beforeUpload={() => {
            if (uploadInfo.loading) {
              return false;
            }

            return true;
          }}
        >
          <Button loading={uploadInfo.loading}>{formatMessage({ id: 'pages.database.restore' })}</Button>
        </Upload>
      </Card>
    </>
  );
};

export default Database;
