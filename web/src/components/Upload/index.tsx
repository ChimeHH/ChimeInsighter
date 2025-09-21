import React, { useState } from 'react';
import { useUpdateEffect } from 'ahooks';
import { Upload, message, Tooltip } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import { upLoadFile } from './service';

interface Props {
    value?: string;
    onChange?: (value: any) => void;
    accept: string; //接受上传的文件类型
    listType?: 'text' | 'picture' | 'picture-card'; //上传列表的内建样式
    uploadType: number; //上传接口的参数type
    showUploadList?: boolean; //是否展示文件列表
    tips?: string; //提示语句
};

const getFileSrc = (type: number) => {
    if (type == 1 || type == 2 || type == 3 || type == 4 || type == 5) {
        return WEB_IMAGE_SRC;
    } else if (type == 6) {
        return RICH_IMAGE_SRC;
    } else if (type == 7 || type == 8 || type == 9) {
        return FILE_SRC;
    } else {
        return '';
    }
};

const UploadCompo: React.FC<Props> = (props) => {
    const { children, value, onChange, accept, listType = 'text', uploadType, showUploadList = true, tips } = props;
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useUpdateEffect(() => {
        if (value) {
            uploadFileList(value);
        }
    }, [value]);

    const uploadFileList = (fileName: string) => {
        const fileSrc = getFileSrc(uploadType);

        setFileList([{
            name: fileName,
            status: 'done',
            uid: `-${(new Date()).getTime()}`,
            url: `${fileSrc + fileName}`,
            thumbUrl: `${fileSrc + fileName}`
        }]);
    };

    //自定义请求
    const customRequest = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options;

        const params = new FormData();
        params.append('file', file);
        params.append('parameter', `{"type":${uploadType}}`);

        const hide = message.loading('正在上传', 0);

        try {
            const { code, data, message: msg } = await upLoadFile(params);
            hide();
            if (code == 0 && data) {
                const filename = data?.[0].filename;
                onSuccess!(filename);
                uploadFileList(filename);
                onChange?.(filename);
            } else {
                message.error(msg);
            }
        } catch (error) {
            hide();
            onError!(error as any);
        }
    };

    //改变
    const uploadBtn = (info: any) => {
        if (info.file.status == 'removed') {
            setFileList([]);
            onChange?.('');
        }
    };

    //配置
    const uploadProps = {
        accept,
        fileList,
        listType,
        showUploadList,
        multiple: false,
        customRequest,
        onChange: (info: any) => uploadBtn(info)
    };

    return (<>
        <Upload
            {...uploadProps}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {children}

                {tips && (
                    <div onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <Tooltip title={tips}>
                            <InfoCircleOutlined style={{ marginLeft: 10 }} />
                        </Tooltip>
                    </div>
                )}
            </div>
        </Upload>
    </>);
};

export default UploadCompo;
