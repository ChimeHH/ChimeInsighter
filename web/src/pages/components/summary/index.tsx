import { Card, Row, Col, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, history, useIntl, getLocale } from 'umi';
import type { Version } from '../version/data';
import type { VersionSummary, ThreatCount, SecurityScores } from './data';
import { selectVersionSummary, exportVersion } from './service';
import { Dropdown, Menu, message } from 'antd';
import moment from 'moment';
import { download } from '@/utils/common';
import { Pie, Bar } from '@ant-design/charts'; // 导入 Bar 组件
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const baseMessageId = 'pages.summary';

const SummaryPage = () => {
  const { vid } = useParams<{ vid: string }>();
  const [version, setVersion] = useState<Version>();
  const [summaryData, setSummaryData] = useState<ThreatCount[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();

  const [securityScores, setSecurityScores] = useState<SecurityScores>();
  const [filesData, setFilesData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [licensesData, setLicensesData] = useState([]);
  const [severityData, setSeverityData] = useState([]);

  const threatCountArr: ThreatCount[] = [
    {
      key: 'zeroday',
      title: formatMessage({ id: `${baseMessageId}.zeroday` }),
      type: 'zeroday',
      path: 'zeroday',
    },
    {
      key: 'mobile',
      title: formatMessage({ id: `${baseMessageId}.mobile` }),
      type: 'mobile',
      path: 'mobile',
    },
    {
      key: 'public',
      title: formatMessage({ id: `${baseMessageId}.public` }),
      type: 'public',
      path: 'public',
    },
    {
      key: 'security',
      title: formatMessage({ id: `${baseMessageId}.security` }),
      type: 'security',
      path: 'security',
    },
    {
      key: 'misconfiguration',
      title: formatMessage({ id: `${baseMessageId}.misconfiguration` }),
      type: 'misconfiguration',
      path: 'misconfiguration',
    },
    {
      key: 'infoleak',
      title: formatMessage({ id: `${baseMessageId}.infoleak` }),
      type: 'infoleak',
      path: 'leakage',
    },
    {
      key: 'malware',
      title: formatMessage({ id: `${baseMessageId}.malware` }),
      type: 'malware',
      path: 'malware',
    },
    {
      key: 'compliance',
      title: formatMessage({ id: `${baseMessageId}.compliance` }),
      type: 'compliance',
      path: 'compliance',
    },
    {
      key: 'files',
      title: formatMessage({ id: `${baseMessageId}.files` }),
      type: 'files',
      path: 'files',
    },
    {
      key: 'packages',
      title: formatMessage({ id: `${baseMessageId}.packages` }),
      type: 'packages',
      path: 'packages',
    },    
    {
      key: 'licenses',
      title: formatMessage({ id: `${baseMessageId}.licenses` }),
      type: 'licenses',
      path: 'licenses',
    },
    {
      key: 'password',
      title: formatMessage({ id: `${baseMessageId}.password` }),
      type: 'password',
      path: 'password',
    },
  ];

  const getData = async () => {
    await getVersionSummary();
  };

  const generateReports = async () => {
    const locale = getLocale();
    setLoading(true);
    try {
      // 调用生成报告的服务
      const res = await exportVersion(version.version_id, null, locale);
  
      if (res.response.status === 202) {
        message.success(formatMessage({ id: 'pages.message.reportGenerating' }));
      } else {
        message.error(formatMessage({ id: 'pages.message.reportGenerateFailed' }));
      }
    } catch (error) {
      console.error('Generate report failed:', error);
      message.error(formatMessage({ id: 'pages.message.reportGenerateFailed' }));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async (format: string) => {
    const locale = getLocale();
    const hide = message.loading(formatMessage({ id: 'pages.message.downloading' }));
    try {
      const res = await exportVersion(version.version_id, format, locale);

      if (res.response.status === 202) {
        hide();
        message.warning(formatMessage({ id: 'pages.message.reportNotReady' }));
        return; // 直接返回，不进行下载
      }

      if (res.response.status !== 200) {
        hide();
        message.error(formatMessage({ id: 'pages.message.downloadFailed' }));
        return; // 处理其他状态码错误
      }

      if (res) {
        const fileName = `${projectName}_${version?.version_name}_${moment().format('YYYYMMDDHHmmss')}.${format}`;
        download(res, fileName);
        message.success(formatMessage({ id: 'pages.message.downloadSuccess' }));
      }
    } catch (error) {
      hide();
      console.error('Download failed:', error);
      message.error(formatMessage({ id: 'pages.message.downloadFailed' }));
    }
  };
  
  useEffect(() => {
    getData();
  }, []);

  const renderPieChart = (data, title, path) => {
    const totalCount = data.reduce((acc, item) => acc + item.count, 0);
  
    return (
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{title}</span>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>Total: {totalCount}</span>
          </div>
        }
        style={{ width: '100%', padding: '0 8px', background: '#e6f7ff', maxHeight: '266px' }} 
        bodyStyle={{ position: 'relative', display: 'flex', justifyContent: 'space-between', height: '100%' }}
        onClick={() => history.push(`./${path}`)}
      >
        <div style={{ width: '60%', height: '200px' }}>
          <Pie
            data={data}
            angleField="count"
            colorField="name" 
            radius={0.8} 
            label={false}
            interactions={[]}
            style={{ width: '100%', height: '100%' }}
            tooltip={false} 
            legend={false} 
          />
        </div>
        <div style={{ top: 0, right: 0, width: '180px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {data.map((item, index) => {
            const name = item.name || 'Unknown';
            const truncatedName = name.length > 16 ? name.slice(0, 15) + '.' : name;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 0, height: 0, backgroundColor: item.color, marginRight: 8 }}></div>
                <span style={{ whiteSpace: 'nowrap', flex: 1 }}>{truncatedName}:</span>
                <span style={{ whiteSpace: 'nowrap', marginLeft: 4, textAlign: 'right', flex: 1 }}>{item.count}</span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };
  
  const getVersionSummary = async () => {
    setLoading(true);
    const res = await selectVersionSummary({
      version_id: vid
    });
    if (res?.data) {
      const versionSummary: VersionSummary = res.data;
      
      const securityScores = versionSummary?.scores || {};
      const threatsStats = versionSummary?.threats || {};
      const filesStats = versionSummary?.files || {};
      const packagesStats = versionSummary?.packages || {};
      const licensesStats = versionSummary?.licenses || {};
  
      setVersion(res.data.version);
      setProjectName(res.data.project.project_name);
      setSecurityScores(securityScores);
  
      const colors = [
        '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96',
        '#a0d911', '#2f54eb', '#13c2c2', '#fadb14', '#bfbfbf', '#ff7a45'
      ]; 
  
      const filesData = Object.entries(filesStats).map(([type, count], index) => ({ name: type || 'overlooked', count, color: colors[index % colors.length] }));
  
      const packagesData = Object.entries(packagesStats).flatMap(([packageName, versions]) => 
        [{ name: packageName || 'Unknown', count: Object.values(versions).reduce((acc, count) => acc + count, 0), color: colors[0] }]
      );
      
      const licensesData = Object.entries(licensesStats).map(([license, count], index) => ({ name: license || 'Unknown', count, color: colors[index % colors.length] }));
    
      setFilesData(filesData);
      setPackagesData(packagesData);
      setLicensesData(licensesData);
  
      const data = threatCountArr.map((threatCount) => {
        let total = 0;
        if (threatCount.key === 'packages') {
          total = Object.values(packagesStats).reduce((acc, versions) => {
            return acc + Object.values(versions).reduce((acc, count) => acc + count, 0);
          }, 0);
        } 
        else if (threatCount.key === 'licenses') {
          total = Object.values(licensesStats).reduce((acc, count) => acc + count, 0);
        }
        else if (threatCount.key === 'files') {
          total = Object.values(filesStats).reduce((acc, count) => acc + count, 0);
        } 
        else {
          if (threatsStats && threatsStats.hasOwnProperty(threatCount.key)) {
            total = Object.values(threatsStats[threatCount.key]).reduce((acc, levelStats) => {
              return acc + Object.values(levelStats).reduce((innerAcc, count) => {
                return innerAcc + (typeof count === 'number' ? count : 0);
              }, 0);
            }, 0);
          }
        }
  
        return {
          ...threatCount,
          title: threatCount.title,
          total,
        };
      });
  
      setSummaryData(data);
  
      const transformedThreatsStats = Object.entries(threatsStats)
      .filter(([type]) => ['zeroday', 'mobile', 'public', 'misconfiguration', 'malware', 'password'].includes(type))
      .reduce((acc, [type, severityStats]) => {
        if (!acc[type]) {
          acc[type] = { critical: 0, high: 0, medium: 0, low: 0, advice: 0, none: 0, no_status: 0 };
        }

        Object.entries(severityStats).forEach(([subType, levels]) => {
          Object.entries(levels).forEach(([level, count]) => {
            if (typeof count === 'number') {
              acc[type][level] += count;
            }
          });
        });

        return acc;
      }, {});

      const severityData = Object.entries(transformedThreatsStats).flatMap(([type, levels]) => {
        return Object.entries(levels).map(([level, count]) => ({ type, level, count }));
      });

      setSeverityData(severityData);
    }
    setLoading(false);
  };
  
  const sbomList = summaryData.filter(item => ['files', 'packages', 'licenses'].includes(item.key));
  const riskList = summaryData.filter(item => !['files', 'packages', 'licenses'].includes(item.key));

  const renderSeverityChart = () => {
    const severityColors = {
      'critical': 'darkred',
      'high': 'red',
      'medium': 'lightcoral',
      'low': 'yellow',
      'advice': 'green',
      'none': 'gray',
      'no-status': 'gray'
    };

    const allTypes = ['zeroday', 'mobile', 'public', 'misconfiguration', 'malware', 'password'];
    const allSeverities = ['critical', 'high', 'medium', 'low', 'advice', 'none', 'no-status'];

    const completeData = allTypes.flatMap(type => 
      allSeverities.map(severity => {
        const found = severityData.find(item => item.type === type && item.level === severity);
        const count = found ? found.count : 0;
        return {
          type,
          severity,
          count
        };
      })
    ).filter(item => item.count > 0);

    const sortedData = completeData.sort((a, b) => {
      return allSeverities.indexOf(a.severity) - allSeverities.indexOf(b.severity);
    });

    return (
      <Card style={{ border: '1px solid #d9d9d9', backgroundColor: '#e6f7ff' }}>
        <Bar
          data={sortedData}
          xField="count"
          yField="type"
          seriesField="severity"
          isStack={true}
          label={{
            position: 'middle',
            layout: [
              { type: 'interval-adjust-position' },
              { type: 'interval-hide-overlap' },
              { type: 'adjust-color' },
            ],
          }}
          color={(datum) => severityColors[datum.severity] || 'gray'}
          barWidthRatio={0.3}
        />
      </Card>
    );
  };

  const getScoreColor = (score: number) => {
    if (score > 8) {
      return 'green';
    } else if (score >= 6) {
      return 'yellow';
    } else if (score >= 4) {
      return 'red';
    } else {
      return 'darkred';
    }
  };

  return (
    <div>
      <Row gutter={24}>
        <Col span={24}>
          <div
            style={{
              backgroundColor: '#fff',
              fontWeight: 500,
              fontSize: 16,
              color: 'rgba(0,0,0,0.85)',
              padding: "16px 24px",
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              {projectName ? `${projectName}/${version?.version_name}` : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => getData()} 
                style={{ marginRight: 8 }}
                loading={loading}
              />
              <Button
                type="text"
                onClick={() => generateReports()}
                style={{ marginRight: 8, color: 'green' }}
                loading={loading}
              >
                {formatMessage({ id: 'pages.summary.generateReports' })}
              </Button>              
              <Dropdown
                  menu={{
                      items: [
                          {
                              key: 'spdx',
                              label: 'SPDX',
                              onClick: () => handleDownload('spdx'),
                          },
                          {
                              key: 'cyclonedx',
                              label: 'CycloneDX',
                              onClick: () => handleDownload('cyclonedx'),
                          },
                          {
                              key: 'xlsx',
                              label: 'Excel',
                              onClick: () => handleDownload('xlsx'),
                          },
                          {
                              key: 'json',
                              label: 'Json',
                              onClick: () => handleDownload('json'),
                          },
                          {
                              key: 'yaml',
                              label: 'Yaml',
                              onClick: () => handleDownload('yaml'),
                          },
                          {
                              key: 'pdf',
                              label: 'PDF',
                              onClick: () => handleDownload('pdf'),
                          },
                      ],
                  }}
                  trigger={['click']}
              >
                  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                      {formatMessage({ id: 'pages.table.action.report' })}
                  </a>
              </Dropdown>

            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title={formatMessage({ id: 'pages.summary.securityScores' })}>
            <div style={{ marginTop: 16 }}>
              {securityScores ? (
                <div>
                  <span>
                    {formatMessage({ id: 'pages.summary.cvssScore' })}: &nbsp;
                    <span style={{ color: getScoreColor(securityScores.cvssSecurityScore) }}>
                      {securityScores.cvssSecurityScore.toFixed(1)}
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; 
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.exploitabilityScore' })}: &nbsp;
                    <span style={{ color: getScoreColor(securityScores.exploitabilitySecurityScore) }}>
                      {securityScores.exploitabilitySecurityScore.toFixed(1)}
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; 
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.impactScore' })}: &nbsp;
                    <span style={{ color: getScoreColor(securityScores.impactSecurityScore) }}>
                      {securityScores.impactSecurityScore.toFixed(1)}
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; 
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.overallScore' })}: &nbsp;
                    <span style={{ color: getScoreColor(securityScores.overallSecurityScore) }}>
                      {securityScores.overallSecurityScore.toFixed(1)}
                    </span>
                  </span>
                </div>
              ) : (
                <p>{formatMessage({ id: 'pages.summary.loadingScores' })}</p> 
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Card 
            title={
              <>
                {version && version.progress ? (
                  <>
                    {formatMessage({ id: 'pages.summary.progress' })} 
                    &nbsp;({(version.progress.percent * 100).toFixed(1)}%)
                  </>
                ) : (
                  formatMessage({ id: 'pages.summary.progress' })
                )}
              </>
            }
          >
            <div style={{ marginTop: 16 }}>
              {version?.progress ? (
                <div>
                  <span>
                    {formatMessage({ id: 'pages.summary.queued' })}: <span style={{ color: '#007BFF' }}>{version.progress.queued}</span> &nbsp;|&nbsp;
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.initiated' })}: <span style={{ color: '#28A745' }}>{version.progress.initiated}</span> &nbsp;|&nbsp;
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.cancelled' })}: <span style={{ color: '#6C757D' }}>{version.progress.cancelled}</span> &nbsp;|&nbsp;
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.failed' })}: <span style={{ color: '#DC3545' }}>{version.progress.failed}</span> &nbsp;|&nbsp;
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.unknown' })}: <span style={{ color: '#FFC107' }}>{version.progress.unknown}</span> &nbsp;|&nbsp;
                  </span>
                  <span>
                    {formatMessage({ id: 'pages.summary.completed' })}: <span style={{ color: '#28A745' }}>{version.progress.completed}</span>
                  </span>
                </div>
              ) : (
                <p>{formatMessage({ id: 'pages.summary.noProgressData' })}</p>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title={formatMessage({ id: 'pages.summary.sbomList' })}>
            <Row gutter={24}>
              <Col span={6}>
                {renderPieChart(filesData, formatMessage({ id: `${baseMessageId}.files` }), 'files')}
              </Col>
              <Col span={6}>
                {renderPieChart(packagesData, formatMessage({ id: `${baseMessageId}.packages` }), 'packages')}
              </Col>
              <Col span={6}>
                {renderPieChart(licensesData, formatMessage({ id: `${baseMessageId}.licenses` }), 'packages')}
              </Col>
              <Col span={6}>
                {/* 预留的空白区域，将来补充饼图用 */}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title={formatMessage({ id: `${baseMessageId}.riskList` })}>            
            <Row gutter={24}>
              <Col span={6}>
                <Row gutter={0}>
                  {riskList.map(item => (
                    <Col key={item.key} span={24}>
                      <Card
                        key={item.key}
                        onClick={() => history.push(`./${item.path}`)}
                        style={{ marginBottom: 16, backgroundColor: '#cce8ff', borderRadius: '4px', overflow: 'hidden', height: '40px', padding: '0 8px' }}
                        bodyStyle={{ padding: 0 }}
                      >
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{item.title}</span>
                          <span style={{ fontSize: 26, fontWeight: 300 }}>{'    '}{item.total ?? 0}</span>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col span={12}>
                {renderSeverityChart()}
              </Col>
              <Col span={6}>
                {/* 预留的空白区域，将来补充内容用 */}
              </Col>
            </Row>            
          </Card>
        </Col>
      </Row>
    </div>
  );
};  

export default SummaryPage;
