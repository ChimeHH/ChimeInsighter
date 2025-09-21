import { Descriptions, Tag, Tree } from 'antd';
import classNames from 'classnames';
import { useEffect, useState, Fragment } from 'react';
import { useParams, history, useIntl } from 'umi';
import { selectThreatDetail } from './service';

import styles from './style.less';
import { loadMessages } from '@/utils/common';
import { severityMap } from '@/utils/constant';
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
  const [locale, setLocale] = useState('en-US'); // 当前语言
  
  // 页面加载时检查缓存
  useEffect(() => {
    const fetchMessages = async () => {
      if (!renderMessages) { // 若没有缓存，则加载
        const messages = await loadMessages(locale);
        setRenderMessages(messages.sscanMessages);
      }
    };

    fetchMessages();
  }, [locale]); // locale 变化时重新加载

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
  
  const renderMetadataF_activities = (metadata) => {
    return (
        <div className={styles.panel}>
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.activities` })}>
                    <div>
                        {metadata.activities && metadata.activities.length > 0 ? (
                            metadata.activities.map((activity, index) => (
                                <div key={index}>{activity}</div>
                            ))
                        ) : (
                            "<na>"
                        )}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_permissions = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
                    {metadata.description || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.info` })}>
                    {metadata.info || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.risk` })}>
                    {metadata.risk || "<na>"}
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.type` })}>
                    {metadata.type || "<na>"}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_certificates = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
                    {metadata.description || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.name` })}>
                    {metadata.name || "<na>"}
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
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_manifests = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.title` })}>
                    <span dangerouslySetInnerHTML={{ __html: metadata.title || "<na>" }} />
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
                    {metadata.description || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.rule` })}>
                    {metadata.rule || "<na>"}
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.component` })}>
                    {metadata.component ? metadata.component.join(', ') : "<na>"}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_binary_hardening = (metadata) => {
    return (
        <div className={styles.panel}>
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.data` })}>
                    <div>
                        {Object.entries(metadata.data).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_android_apis = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.name` })}>
                    {metadata.name || "<na>"}
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.files` })}>
                    <div>
                        {Object.entries(metadata.files).map(([filePath, lineNumbers]) => (
                            <div key={filePath}>
                                <strong>{filePath}:</strong> {lineNumbers}
                            </div>
                        ))}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_code_analysis = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.name` })}>
                    {metadata.name || "<na>"}
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
                        {metadata.cwe || "<na>"}
                    </Descriptions.Item>
                )}
                {metadata.masvs && (
                    <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.masvs` })}>
                        {metadata.masvs || "<na>"}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.description` })}>
                    {metadata.description || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.files` })}>
                    <div>
                        {Object.entries(metadata.files).map(([filePath, lineNumbers]) => (
                            <div key={filePath}>
                                <strong>{filePath}:</strong> {lineNumbers}
                            </div>
                        ))}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_urls_analysis = (metadata) => {
    return (
        <div className={styles.panel}>
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.path` })}>
                    {metadata.path || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.urls` })}>
                    <div>
                        {metadata.urls && metadata.urls.length > 0 ? (
                            metadata.urls.map((url, index) => (
                                <div key={index}>
                                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                                </div>
                            ))
                        ) : (
                            "<na>"
                        )}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_apkid_analysis = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.name` })}>
                    {metadata.name || "<na>"}
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
                <Descriptions.Item label="Anti-VM">
                    <div>
                        {metadata.anti_vm && metadata.anti_vm.length > 0 ? (
                            metadata.anti_vm.map((check, index) => (
                                <div key={index}>{check}</div>
                            ))
                        ) : (
                            "<na>"
                        )}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Compiler">
                    <div>
                        {metadata.compiler && metadata.compiler.length > 0 ? (
                            metadata.compiler.map((item, index) => (
                                <div key={index}>{item}</div>
                            ))
                        ) : (
                            "<na>"
                        )}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_behaviour_analysis = (metadata) => {
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.label` })}>
                    <div>
                        {metadata.label && metadata.label.length > 0 ? (
                            metadata.label.map((item, index) => (
                                <div key={index}>{item}</div>
                            ))
                        ) : (
                            "<na>"
                        )}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.files` })}>
                    <div>
                        {Object.entries(metadata.files).map(([filePath, lineNumbers]) => (
                            <div key={filePath}>
                                <strong>{filePath}:</strong> {lineNumbers}
                            </div>
                        ))}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_secrets_analysis = (metadata) => {
    return (
        <div className={styles.panel}>
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.data` })}>
                    <div>
                        {metadata.data && metadata.data.length > 0 ? (
                            metadata.data.map((item, index) => (
                                <div key={index}>{item}</div>
                            ))
                        ) : (
                            "<na>"
                        )}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_sbom_external = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.name` })}>
                    {metadata.name || "<na>"}
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.type` })}>
                    {metadata.type || "<na>"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.version` })}>
                    {metadata.version || "<na>"}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_sbom_internal = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.name` })}>
                    {metadata.name || "<na>"}
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
            </Descriptions>
        </div>
    );
  };

  const renderMetadataF_domains_analysis = (metadata) => {
    return (
        <div className={styles.panel}>
            <Descriptions className={styles.panel} column={1}>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.issueType` })}>
                    {`${metadata.vulnerability_type} / ${metadata.vulnerability_sub_type}`}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.domain` })}>
                    {metadata.domain || "<na>"}
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
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.ofac` })}>
                    {metadata.ofac ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: `${baseMessageId}.reference` })}>
                  <div>
                      {metadata.reference && typeof metadata.reference === 'object' ? (
                          <>
                              {metadata.reference.ip && (
                                  <div>
                                      <strong>IP:</strong> {metadata.reference.ip}
                                  </div>
                              )}
                              {metadata.reference.country_short && (
                                  <div>
                                      <strong>Country Short:</strong> {metadata.reference.country_short}
                                  </div>
                              )}
                              {metadata.reference.country_long && (
                                  <div>
                                      <strong>Country Long:</strong> {metadata.reference.country_long}
                                  </div>
                              )}
                              {metadata.reference.region && (
                                  <div>
                                      <strong>Region:</strong> {metadata.reference.region}
                                  </div>
                              )}
                              {metadata.reference.city && (
                                  <div>
                                      <strong>City:</strong> {metadata.reference.city}
                                  </div>
                              )}
                              {metadata.reference.latitude && (
                                  <div>
                                      <strong>Latitude:</strong> {metadata.reference.latitude}
                                  </div>
                              )}
                              {metadata.reference.longitude && (
                                  <div>
                                      <strong>Longitude:</strong> {metadata.reference.longitude}
                                  </div>
                              )}
                          </>
                      ) : (
                          "<na>"
                      )}
                  </div>
              </Descriptions.Item>

            </Descriptions>
        </div>
    );
  };

  const renderMetadataF = (metadata) => {
      switch (metadata.vulnerability_sub_type) {
          case 'activities':
            return renderMetadataF_activities(metadata);
          case 'permissions':
              return renderMetadataF_permissions(metadata);
          case 'certificates':
              return renderMetadataF_certificates(metadata);
          case 'manifests':
              return renderMetadataF_manifests(metadata);
          case 'binary_hardening':
              return renderMetadataF_binary_hardening(metadata);
          case 'android_apis':
              return renderMetadataF_android_apis(metadata);
          case 'code_analysis':
              return renderMetadataF_code_analysis(metadata);
          case 'urls_analysis':
              return renderMetadataF_urls_analysis(metadata);
          case 'apkid_analysis':
              return renderMetadataF_apkid_analysis(metadata);
          case 'behaviour_analysis':
              return renderMetadataF_behaviour_analysis(metadata);
          case 'secrets_analysis':
              return renderMetadataF_secrets_analysis(metadata);
          case 'sbom_external':
              return renderMetadataF_sbom_external(metadata);
          case 'sbom_internal':
              return renderMetadataF_sbom_internal(metadata);
          case 'domains_analysis':
              return renderMetadataF_domains_analysis(metadata);
          default:
              return <div>{formatMessage({ id: `${baseMessageId}.unknownSubType` })}</div>;
      }
  };





  
  const renderMetadata = (metadata) => {
    switch (metadata?.vulnerability_type) {
      case 'qscan':
        return renderMetadataQ(metadata);
      case 'mscan':
        return renderMetadataM(metadata);
      case 'sscan':
        return renderMetadataS(metadata);
      case 'fscan':
        return renderMetadataF(metadata);
      default:
        return formatMessage({ id: `${baseMessageId}.unknownType` });
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
