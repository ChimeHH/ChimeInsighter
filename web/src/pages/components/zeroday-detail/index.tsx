import { Col, Descriptions, Row, Tag, Button, Upload, Tree } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useEffect, useState, Fragment } from 'react';
import { useParams, history, useIntl } from 'umi';
import { selectThreatDetail, insertSymbol } from './service';

import styles from './style.less';
import { severityMap, zerodayMetaTypeMap, zerodayMetaSubTypeMap } from '@/utils/constant';
import type { Version } from '../version/data';

const colorsMap = {
  1: '#b7c5c7',
  2: '#fd9e38',
  3: '#f56767',
  4: '#e50100',
};

const template = (templateStr?: string, data?: object) => {
  if (!templateStr || !data) {
    return '';
  }

  let str = templateStr;
  for (const key in data) {
    if (key === 'read_more') {
      str = str.replace('{read_more}.', '');
      continue;
    }

    str = str.replaceAll(`{${key}}`, data[key]);
  }

  return str;
};



const baseMessageId = 'pages.detail';

const ZerodayDetail = () => {
  const { vid, tid } = useParams<{ vid: string; tid: string }>();
  const [version, setVersion] = useState<Version>();
  const [detail, setDetail] = useState<ZerodayDetail>();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const { formatMessage } = useIntl();
  
  // 假设 renderMessages 存在于某个父组件或上下文中
  const [renderMessages, setRenderMessages] = useState(null);
    
  const initPaths = (threatDetail: SecurityDetail) => {
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

  const getData = async () => {
    const res = await selectThreatDetail({
      threat_id: tid,
    });
    if (res?.data) {
      setVersion(res.data.version);
      setDetail(res.data.detail);      
      initPaths(res.data.detail);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file }) => {
        const res = await insertSymbol({
            threat_id: tid,
            file,
        });
        if (res?.data) {
            setDetail(res.data.detail);  // 更新 detail
            getData();  // 刷新页面的数据
        }
        return res.status_code === 0;
    },
  };

  const renderStory = {

    "read-more": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.read-more' }),

    "null-dereference": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.null-dereference' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.function_rva || '<function_rva>')
            .replace(/<deref_rva>/g, metadata?.rva || '<deref_rva>'),

    "return-of-stack-variable": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.return-of-stack-variable' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<ret_rva>/g, metadata?.rva || '<ret_rva>'),

    "unchecked-return-value": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.unchecked-return-value' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "obsolete-function": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.obsolete-function' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>'),

    "use-after-free": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.use-after-free' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<used_rva>/g, metadata?.rva || '<used_rva>')
            .replace(/<free_rva>/g, metadata?.free_rva || '<free_rva>'),

    "double-free": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.double-free' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<definition_rva>/g, metadata?.definition_rva || '<definition_rva>')
            .replace(/<previous_free_rva>/g, metadata?.previous_free_rva || '<previous_free_rva>')
            .replace(/<free_rva>/g, metadata?.rva || '<free_rva>'),

    "free-non-heap-obj": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.free-non-heap-obj' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<free_rva>/g, metadata?.rva || '<free_rva>'),

    "network-deadlock": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.network-deadlock' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "input-analysis": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.input-analysis' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<function_rva>/g, metadata?.function_rva || '<function_rva>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<memory_location>/g, metadata?.memory_location || '<memory_location>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>')
            .replace(/<buffer_size>/g, metadata?.buffer_size || '<buffer_size>'),

    "forbidden-function": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.forbidden-function' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<memory_location>/g, metadata?.buffer_definition_rva || '<memory_location>'),

    "forbidden-mktemp-call": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.forbidden-mktemp-call' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>'),

    "toc-tou": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.toc-tou' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<first_call_rva>/g, metadata?.first_call_rva || '<first_call_rva>'),

    "forbidden-function-used": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.forbidden-function-used' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "weak-crypto-method": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.weak-crypto-method' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "copy-to-static-overflow": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.copy-to-static-overflow' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<memory_location>/g, metadata?.memory_location || '<memory_location>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>'),

    "invalid-memory-buffer": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.invalid-memory-buffer' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>')
            .replace(/<memory_location>/g, metadata?.memory_location || '<memory_location>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>')
            .replace(/<buffer_size>/g, metadata?.buffer_size || '<buffer_size>'),

    "invalid-read-memory-buffer": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.invalid-read-memory-buffer' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>')
            .replace(/<memory_location>/g, metadata?.memory_location || '<memory_location>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>'),

    "invalid-argument": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.invalid-argument' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>')
            .replace(/<memory_location>/g, metadata?.memory_location || '<memory_location>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>'),

    "uninitialized-return": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.uninitialized-return' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<return_rva>/g, metadata?.return_rva || '<return_rva>'),

    "uninitialized-input": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.uninitialized-input' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.function_rva || '<function_rva>'),

    "wrong-size-memset": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.wrong-size-memset' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>'),

    "format-string": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.format-string' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "format-string-overflow": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.format-string-overflow' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>'),

    "heap-overflow-string": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.heap-overflow-string' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<function_rva>/g, metadata?.rva || '<function_rva>'),

    "string-corruption": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.string-corruption' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>')
            .replace(/<buffer_size>/g, metadata?.buffer_size || '<buffer_size>'),

    "mutex-deadlock": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.mutex-deadlock' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<deadlock_branch_rva>/g, metadata?.deadlock_branch_rva || '<deadlock_branch_rva>'),

    "command-injection": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.command-injection' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "signed-unsigned-overflow": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.signed-unsigned-overflow' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<compare_rva>/g, metadata?.compare_rva || '<compare_rva>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),

    "information-exposure": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.information-exposure' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<leaked_string>/g, metadata?.leaked_string || '<leaked_string>'),

    "information-exposure-via-error": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.information-exposure-via-error' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<leaked_string>/g, metadata?.leaked_string || '<leaked_string>'),

    "code-complexity": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.code-complexity' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<complexity>/g, metadata?.complexity || '<complexity>'),

    "recursion": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.recursion' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<recursion_path>/g, metadata?.recursion_path || '<recursion_path>'),

    "infinite-loop": (metadata) =>
        formatMessage({ id: 'pages.vulnerability.infinite-loop' })
            .replace(/<file_name>/g, metadata?.file_name || '<file_name>')
            .replace(/<file_line>/g, metadata?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>'),
  };

  const callerName = (metadata: any, rva: string): any | undefined => {
    // 检查 metadata 和 source 是否存在
    if (metadata && metadata.source) {
        return metadata.source[rva]; // 返回 rvaInfo
    }
    return undefined; // 如果没找到，返回 undefined
  };


  

  const renderRemediation = {
    "null-dereference": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.null-dereference' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "return-of-stack-variable": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.return-of-stack-variable' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>');
    },
  
    "unchecked-return-value": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.unchecked-return-value' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "obsolete-function": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.obsolete-function' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')            
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "forbidden-function-use": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.forbidden-function-use' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')            
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "weak-crypto-method": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.weak-crypto-method' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "use-after-free": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        const rvaInfo2 = callerName(metadata, metadata.free_rva);
        return formatMessage({ id: 'pages.remediation.use-after-free' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<file_name2>/g, rvaInfo2?.file_path || '<file_name2>')
            .replace(/<file_line2>/g, rvaInfo2?.file_line || '<file_line2>')
            .replace(/<caller_name2>/g, rvaInfo2?.func_name || '<caller_name2>');
    },
  
    "double-free": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        return formatMessage({ id: 'pages.remediation.double-free' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>');
    },
    
    "free-non-heap-obj": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        const rvaInfo2 = callerName(metadata, metadata.definition_rva);

        return formatMessage({ id: 'pages.remediation.free-non-heap-obj' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<file_name2>/g, rvaInfo2?.file_path || '<file_name2>')
            .replace(/<file_line2>/g, rvaInfo2?.file_line || '<file_line2>')
            .replace(/<caller_name2>/g, rvaInfo2?.func_name || '<caller_name2>');
    },
  
    "network-deadlock": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        
        return formatMessage({ id: 'pages.remediation.network-deadlock' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "input-analysis": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);

        return formatMessage({ id: 'pages.remediation.input-analysis' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>');
    },
  
    "forbidden-mktemp-call": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);

        return formatMessage({ id: 'pages.remediation.forbidden-mktemp-call' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "toc-tou": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        
        return formatMessage({ id: 'pages.remediation.toc-tou' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "forbidden-function-used": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        
        return formatMessage({ id: 'pages.remediation.forbidden-function-used' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "copy-to-static-overflow": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);
        
        return formatMessage({ id: 'pages.remediation.copy-to-static-overflow' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "invalid-memory-buffer": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);        
        const rvaInfo2 = callerName(metadata, metadata.buffer_definition_rva);
        
        return formatMessage({ id: 'pages.remediation.invalid-memory-buffer' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<file_name2>/g, rvaInfo2?.file_path || '<file_name2>')
            .replace(/<file_line2>/g, rvaInfo2?.file_line || '<file_line2>')
            .replace(/<caller_name2>/g, rvaInfo2?.func_name || '<caller_name2>')           
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<buffer_size>/g, metadata?.buffer_size || '<buffer_size>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>');
    },
  
    "invalid-read-memory-buffer": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.invalid-read-memory-buffer' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<memory_location>/g, metadata?.memory_location || '<memory_location>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>');
    },
  
    "invalid-argument": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.invalid-argument' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "uninitialized-return": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.uninitialized-return' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "uninitialized-input": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.uninitialized-input' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "wrong-size-memset": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.wrong-size-memset' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "format-string": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.format-string' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "format-string-overflow": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.format-string-overflow' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "heap-overflow-string": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.heap-overflow-string' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>');
    },
  
    "string-corruption": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  
        const rvaInfo2 = callerName(metadata, metadata.buffer_definition_rva);  

        return formatMessage({ id: 'pages.remediation.string-corruption' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<file_name2>/g, rvaInfo2?.file_path || '<file_name2>')
            .replace(/<file_line2>/g, rvaInfo2?.file_line || '<file_line2>')
            .replace(/<caller_name2>/g, rvaInfo2?.func_name || '<caller_name2>')           
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<buffer_size>/g, metadata?.buffer_size || '<buffer_size>')
            .replace(/<operation_size>/g, metadata?.operation_size || '<operation_size>')
            .replace(/<buffer_definition_rva>/g, metadata?.buffer_definition_rva || '<buffer_definition_rva>');
    },
  
    "mutex-deadlock": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.mutex-deadlock' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')            
            .replace(/<func_name>/g, metadata?.function_name || '<func_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<deadlock_branch_rva>/g, metadata?.branch_rva || '<deadlock_branch_rva>');
    },
  
    "command-injection": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.command-injection' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>');
    },
  
    "signed-unsigned-overflow": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.signed-unsigned-overflow' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
            .replace(/<rva>/g, metadata?.rva || '<rva>');
    },
  
    "information-exposure": (metadata) => {
        return formatMessage({ id: 'pages.remediation.information-exposure' })
            .replace(/<leaked_string>/g, metadata?.leaked_string || '<leaked_string>');
    },
  
    "information-exposure-via-error": (metadata) => {
        return formatMessage({ id: 'pages.remediation.information-exposure-via-error' })
            .replace(/<leaked_string>/g, metadata?.leaked_string || '<leaked_string>');
    },
  
    "code-complexity": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.code-complexity' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<complexity>/g, metadata?.complexity || '<complexity>');
    },
  
    "recursion": (metadata) => {
        return formatMessage({ id: 'pages.remediation.recursion' })
            .replace(/<rva>/g, metadata?.rva || '<rva>')
            .replace(/<recursion_path>/g, metadata?.recursion_path || '<recursion_path>');
    },
  
    "infinite-loop": (metadata) => {
        const rvaInfo = callerName(metadata, metadata.rva);  

        return formatMessage({ id: 'pages.remediation.infinite-loop' })
            .replace(/<file_name>/g, rvaInfo?.file_path || '<file_name>')
            .replace(/<file_line>/g, rvaInfo?.file_line || '<file_line>')
            .replace(/<caller_name>/g, rvaInfo?.func_name || '<caller_name>')
    }
  };
  
  const renderMetadataC = (metadata) => {
    return (
      <>
      <Descriptions className={styles.panel} column={2}>
        {/* <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.fileName` })}>
          {detail?.vulnerability_story.params.values.file_name}
        </Descriptions.Item> */}

        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
          {`${zerodayMetaTypeMap[metadata.vulnerability_type] || metadata.vulnerability_type} / \
            ${zerodayMetaSubTypeMap[metadata.vulnerability_sub_type] || metadata.vulnerability_sub_type}`}
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
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.offset` })}>
          {metadata.rva}
        </Descriptions.Item>
        {/* <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.risk` })}>
          {detail?.risks.toString().replaceAll(',', ' ')}
        </Descriptions.Item> */}
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.cwe` })}>
          {metadata.cwes ? (metadata.cwes.map((item, index) => (
            <div key={item}>
              {index > 0 && <span style={{ padding: '0 4px' }}>|</span>}
              <a onClick={() => history.push(`/helpcenter/cwe/${item.replace(/[^0-9]/gi, '')}`)}>
                {item}
              </a>
            </div>
          ))) : null }
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
          title={formatMessage({ id: `${baseMessageId}.vulnerabilityStory` })} // 添加标题
          className={classNames(styles.panel, styles.mt12)}
      >
          <Descriptions.Item label="" style={{ whiteSpace: 'pre-line' }}>
              {metadata ? (
                  (() => {
                      let sub_type = detail.metadata.vulnerability_sub_type;

                      // 预处理 sub_type
                      if (sub_type === "deadlock") {
                          sub_type = detail.metadata.vulnerability_type.includes("Network") ? "network-deadlock" : "mutex-deadlock";
                      }

                      // 获取 renderRemediation 的返回值，并在每个分号后面添加换行
                      return (renderStory[sub_type]?.(detail.metadata) || "<na>")
                          .replace(/;/g, ';\n'); // 在每个分号后面添加换行符
                  })()
              ) : (
                  "<na>"
              )}
          </Descriptions.Item>

      </Descriptions>

      <Descriptions
          title={formatMessage({ id: `${baseMessageId}.vulnerabilityRemediation` })} // 添加标题
          className={classNames(styles.panel, styles.mt12)}
      >
          <Descriptions.Item label="" style={{ whiteSpace: 'pre-line' }}>
              {metadata ? (
                  (() => {
                      let sub_type = detail.metadata.vulnerability_sub_type;

                      // 预处理 sub_type
                      if (sub_type === "deadlock") {
                          sub_type = detail.metadata.vulnerability_type.includes("Network") ? "network-deadlock" : "mutex-deadlock";
                      } else if (sub_type === "forbidden-function") {
                          sub_type = detail.metadata.vulnerability_type.includes("overflow") ? "forbidden-function-use" : "forbidden-function-used";
                      }

                      // 获取 renderRemediation 的返回值，并在每个分号后面添加换行
                      return (renderRemediation[sub_type]?.(detail.metadata) || "<na>")
                          .replace(/;/g, ';\n'); // 在每个分号后面添加换行符
                  })()
              ) : (
                  "<na>"
              )}
          </Descriptions.Item>

      </Descriptions>

      <Descriptions
        title={formatMessage({ id: `${baseMessageId}.sourceCode` })}
        className={classNames(styles.panel, styles.mt12)}
        extra={
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>
              {formatMessage({ id: `${baseMessageId}.sourceCode.upload` })}
            </Button>
          </Upload>
        }
      >
        {metadata?.source?.[metadata.rva]?.func_name && (
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.sourceCode.function` })}>
            {metadata.source?.[detail.metadata.rva]?.func_name}
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* {detail?.vulnerability_remediation && (
        <Descriptions
          title={formatMessage({ id: `${baseMessageId}.howToFix` })}
          className={classNames(styles.panel, styles.mt12)}
        >
          <Descriptions.Item label="" style={{ whiteSpace: 'pre-line' }}>
            {template(
              detail?.vulnerability_remediation.content,
              detail?.vulnerability_remediation.params.values,
            )}
          </Descriptions.Item>
        </Descriptions>
      )} */}

      {(!!metadata?.callstack?.length || !!Object.keys(metadata?.regs ?? {}).length) && (
        <Descriptions
          title={formatMessage({ id: `${baseMessageId}.dynamicInformation` })}
          className={classNames(styles.panel, styles.mt12)}
          layout="vertical"
          column={2}
        >
          <Descriptions.Item
            label={formatMessage({ id: `${baseMessageId}.dynamicInformation.callStack` })}
          >
            <Row>
              {metadata?.regs &&
                metadata?.callstack?.map((item) => (
                  <Col span={50} key={item.name}>
                    {item.is_exported.toLowerCase() === 'true' && <Tag>EXPORT</Tag>}
                    {`${item.name} (${item.address})`}
                  </Col>
                ))}
            </Row>
          </Descriptions.Item>
          <Descriptions.Item
            label={formatMessage({ id: `${baseMessageId}.dynamicInformation.registers` })}
          >
            <Row>
              {metadata.regs &&
                Object.keys(detail.metadata.regs).map((key) => {
                  if(detail.metadata.regs[key]!='Dynamic Var'){
                    return (
                      <Col key={key} span={20}>
                        <span style={{ marginRight: 20 }}>{key}</span>
                        <span>{detail.metadata.regs[key]}</span>
                      </Col>
                    );
                  }
                })}
            </Row>
          </Descriptions.Item>
        </Descriptions>
      )}

      {metadata?.disassembly && (
        <Descriptions
          title={formatMessage({ id: `${baseMessageId}.disassembly` })}
          className={classNames(styles.panel, styles.mt12)}
          layout="vertical"
          column={1}
        >
          {metadata.disassembly?.map((item) => (
            <Descriptions.Item
              key={item.function_name}
              style={{ whiteSpace: 'pre-line' }}
              label={`${item.function_name}(${item.block_addr})`}
            >
              {item.block_ins.map((ins) => `${ins.address} ${ins.instruction}\n`)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}
      </>
    );
  };

  const renderMetadataQ = (metadata) => {
    return (
      
      <Descriptions className={styles.panel} column={1}>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
          {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.severity` })}>
          {metadata.severity && (
            <Tag
              style={{ borderColor: colorsMap[metadata.severity], color: colorsMap[metadata.severity] }}
            >
              {severityMap[metadata.severity]}
            </Tag>
          )}
        </Descriptions.Item>
        {metadata.category && (
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.category` })}>
            {metadata.category}
          </Descriptions.Item>
        )}

        {metadata.description && (
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
            {metadata.description}
          </Descriptions.Item>
        )}
        {metadata.file_object && (
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.fileObject` })}>
            {metadata.file_object}
          </Descriptions.Item>
        )}
        {metadata.line_number && (
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.lineNumber` })}>
            {metadata.line_number}
          </Descriptions.Item>
        )}
      </Descriptions>
      
    );
  };
  

  const renderMetadataFiles = (files, indent) => {  
    const filesArray = Array.isArray(files) ? files : [files];
    
    return filesArray.map((file, idx) => (  
      <Fragment key={idx}>  
        <div style={{ paddingLeft: indent, fontWeight: 'bold', marginTop: '16px' }}>{`File ${idx + 1}:`}</div>  
        <div style={{ paddingLeft: indent }}>{`File Path: ${file.file_path}`}</div>
        
        {file.match_lines && file.match_lines.length > 0 && (
          <div style={{ paddingLeft: indent }}>{`Match Lines: ${file.match_lines.join(', ')}`}</div>
        )}
        
        {file.match_position && file.match_position.length > 0 && (
          <div style={{ paddingLeft: indent }}>{`Match Position: ${file.match_position.join(', ')}`}</div>
        )}
        
        {file.match_string && (
          <div style={{ paddingLeft: indent }}>{`Match String: ${file.match_string}`}</div>
        )}

        <div style={{ marginBottom: '16px' }}></div>
      </Fragment>   
    ));  
  };   


  const renderMetadataM = (metadata) => {
    return (
      <div className={styles.panel}>

        <Descriptions className={styles.panel} column={1}>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
            {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
            {metadata.description || "<na>"}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.severity` })}>
            {metadata.severity && (
              <Tag
                style={{ borderColor: colorsMap[metadata.severity], color: colorsMap[metadata.severity] }}
              >
                {severityMap[metadata.severity]}
              </Tag>
            )}
          </Descriptions.Item>
          {metadata.cwe && (
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.cwe` })}>
              <a onClick={() => history.push(`/helpcenter/cwe/${metadata.cwe}`)}>
                {metadata.cwe}
              </a>
            </Descriptions.Item>
          )}
          {metadata.masvs && (
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.masvs` })}>
              {metadata.masvs}
            </Descriptions.Item>
          )}
          {metadata["owasp-mobile"] && (
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.owasp-mobile` })}>
              {metadata["owasp-mobile"]}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.reference` })}>
            {metadata.reference || "<na>"}
          </Descriptions.Item>          
        </Descriptions>

        <Descriptions title={formatMessage({ id: `${baseMessageId}.files` })} column={1}>  
          {metadata.files && renderMetadataFiles(metadata.files, '16px')}
        </Descriptions>

      </div>
    );
  };
  
  const renderSourceLine = (lines, indent) => {  
    const sourceLineArray = Array.isArray(lines) ? lines : [lines];  
    
    return sourceLineArray.map((line, idx) => (  
      <Fragment key={idx}>  
        <div style={{ paddingLeft: indent, fontWeight: 'bold', marginTop: '16px' }}>{`Source Line ${idx + 1}:`}</div>  
        <div style={{ paddingLeft: indent }}>{`Class Name: ${line.classname || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Source File: ${line.sourcefile || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Source Path: ${line.sourcepath || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Start: ${line.start || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`End: ${line.end || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Start Bytecode: ${line.startBytecode || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`End Bytecode: ${line.endBytecode || "<na>"}`}</div>  
        <div style={{ marginBottom: '16px' }}></div>
      </Fragment>  
    ));  
  };  

  const renderMethod = (methods, indent) => {  
    const methodArray = Array.isArray(methods) ? methods : [methods];  
  
    return methodArray.map((method, idx) => (  
      <Fragment key={idx}>  
        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>{`Method ${idx + 1}:`}</div>  
        <div style={{ paddingLeft: indent }}>{`Class Name: ${method.classname || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Name: ${method.name || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Signature: ${method.signature || "<na>"}`}</div>  
        <div style={{ paddingLeft: indent }}>{`Is Static: ${method.isStatic || "<na>"}`}</div>  
        {method.SourceLine && renderSourceLine(method.SourceLine, `${parseInt(indent, 10) + 16}px`)}  
      </Fragment>  
    ));  
  };  

  const renderClass = (classData, indent) => {  
    if (!classData) {  
      return <div>{"<na>"}</div>;  
    }  
  
    return (  
      <Fragment>          
        <div style={{ paddingLeft: indent }}>{`Class Name: ${classData.classname || "<na>"}`}</div>  
        {classData.SourceLine && renderSourceLine(classData.SourceLine, `${parseInt(indent, 10) + 16}px`)}  
      </Fragment>  
    );  
  };
  
  const renderField = (fieldData, indent) => {
    if (!fieldData) {
      return <div>{"<na>"}</div>;
    }
  
    return (
      <Fragment>
        <div style={{ paddingLeft: indent }}>{`Class Name: ${fieldData.classname || "<na>"}`}</div>
        <div style={{ paddingLeft: indent }}>{`Name: ${fieldData.name || "<na>"}`}</div>
        <div style={{ paddingLeft: indent }}>{`Signature: ${fieldData.signature || "<na>"}`}</div>
        <div style={{ paddingLeft: indent }}>{`Is Static: ${fieldData.isStatic || "<na>"}`}</div>
        {fieldData.SourceLine && renderSourceLine(fieldData.SourceLine, `${parseInt(indent, 10) + 16}px`)}
      </Fragment>
    );
  };

  const renderLocalVariable = (localVariables, indent) => {
    const variablesArray = Array.isArray(localVariables) ? localVariables : [localVariables]; 
  
    return variablesArray.map((localVariable, idx) => (
      <Fragment key={idx}>
        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>{`Local Variable ${idx + 1}:`}</div>
        <div style={{ paddingLeft: indent }}>{`Name: ${localVariable.name || "<na>"}`}</div>
        <div style={{ paddingLeft: indent }}>{`PC: ${localVariable.pc || "<na>"}`}</div>
        <div style={{ paddingLeft: indent }}>{`Register: ${localVariable.register || "<na>"}`}</div>
        <div style={{ paddingLeft: indent }}>{`Role: ${localVariable.role || "<na>"}`}</div>
      </Fragment>
    ));
  };
  
  
  const renderMetadataS = (metadata) => {
    const bugCodeText = renderMessages.bugCodes[metadata.abbrev] ? renderMessages.bugCodes[metadata.abbrev].text : null;
    const displayAbbrev = bugCodeText ? `${metadata.abbrev} (${bugCodeText})` : metadata.abbrev;

    const categoryInfo = renderMessages.bugCategories[metadata.category] || {};
    const categoryDescription = categoryInfo.Description || "<na>";
    const categoryDetails = categoryInfo.Details || "<na>";

    const patternInfo = renderMessages.bugPatterns[metadata.vulnerability_sub_type] || {};
    const patternShortDescription = patternInfo.ShortDescription || "<na>";
    const patternLongDescription = patternInfo.LongDescription || "<na>";
    const patternDetails = patternInfo.Details || "<na>";

    return (
      <div className={styles.panel}>
        
  
        <Descriptions column={1}>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.abbrev` })}>
            {displayAbbrev}
          </Descriptions.Item>
          
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.rank` })}>
            {metadata.rank || "<na>"}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.severity` })}>
            {metadata.severity && (
              <Tag
                style={{ borderColor: colorsMap[metadata.severity], color: colorsMap[metadata.severity] }}
              >
                {severityMap[metadata.severity]}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.vulnerabilityType` })}>
            {metadata.vulnerability_type || "<na>"}
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.vulnerabilitySubType` })}>
            {metadata.vulnerability_sub_type || "<na>"}
          </Descriptions.Item>
          
          {metadata.cwe && (
            <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.cwe` })}>
              <a onClick={() => history.push(`/helpcenter/cwe/${metadata.cwe}`)}>
                {metadata.cwe}
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Descriptions title={formatMessage({ id: `${baseMessageId}.category` })}>          
          <>
            <Fragment>
              <div style={{ whiteSpace: 'pre-wrap', display: 'block', paddingLeft: '20px' }}>{metadata.category}</div>
            </Fragment>
            <Fragment>
              <div style={{ whiteSpace: 'pre-wrap', display: 'block', marginTop: '4px', paddingLeft: '20px' }}>{categoryDescription}</div>
            </Fragment>
            <Fragment>
              <div style={{ whiteSpace: 'pre-wrap', display: 'block', marginTop: '4px', paddingLeft: '20px' }}>{categoryDetails}</div>
            </Fragment>
          </>
        </Descriptions>

        <Descriptions title={formatMessage({ id: `${baseMessageId}.pattern` })}>          
          <>
            <Fragment>
              <div style={{ whiteSpace: 'pre-wrap', display: 'block', paddingLeft: '20px' }}>{patternShortDescription}</div>
            </Fragment>
            <Fragment>
              <div style={{ whiteSpace: 'pre-wrap', display: 'block', marginTop: '4px', paddingLeft: '20px' }}>{patternLongDescription}</div>
            </Fragment>
            <Fragment>
              <div style={{ whiteSpace: 'pre-wrap', display: 'block', marginTop: '4px', paddingLeft: '20px' }}>{patternDetails}</div>
            </Fragment>
          </>          
        </Descriptions>


        
        <Descriptions title={formatMessage({ id: `${baseMessageId}.class` })} column={1}>  
          {metadata.Class && renderClass(metadata.Class, '16px')}  
        </Descriptions> 

        <Descriptions title={formatMessage({ id: `${baseMessageId}.field` })} column={1}>  
          {metadata.Field && renderField(metadata.Field, '16px')}  
        </Descriptions> 

        <Descriptions title={formatMessage({ id: `${baseMessageId}.localVariable` })} column={1}>  
          {metadata.LocalVariable && renderLocalVariable(metadata.LocalVariable, '16px')}  
        </Descriptions> 

        <Descriptions title={formatMessage({ id: `${baseMessageId}.sourceLine` })} column={1}>  
          {metadata.SourceLine && renderSourceLine(metadata.SourceLine, '16px')}  
        </Descriptions>  

        <Descriptions title={formatMessage({ id: `${baseMessageId}.method` })} column={1}>  
          {metadata.Method && renderMethod(metadata.Method, '16px')}  
        </Descriptions>
 
      </div>
    );
  };
  

  
  const renderMetadata = (metadata) => {
    switch (metadata?.vulnerability_type) {
      case 'qscan':
        return renderMetadataQ(metadata);
      case 'mscan':
        return renderMetadataM(metadata);
      case 'sscan':
        return renderMetadataS(metadata);
      default:
        return renderMetadataC(metadata);
    }
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
        {`${version?.version_name} / ${detail?.threat_id}`}
      </div>
      
      {detail?.metadata ? renderMetadata(detail.metadata) : "missing metadata"}

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

export default ZerodayDetail;
