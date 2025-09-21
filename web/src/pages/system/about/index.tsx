import React, { useEffect, useState } from 'react';  
import { Card, message } from 'antd';  
import { useIntl } from 'umi';  
import ProTable from '@ant-design/pro-table';  
import type { ProColumns } from '@ant-design/pro-table';  
import { getSoftwareList } from './service';  
import { CopyOutlined } from '@ant-design/icons'; // Import only the Copy icon  

const SoftwareListPage: React.FC = () => {  
  const [loading, setLoading] = useState(false);  
  const [dataSource, setDataSource] = useState<any[]>([]);  
  const { formatMessage } = useIntl();  

  // Function to fetch software data  
  const getSoftwares = async () => { 
    setLoading(true);  
    const hide = message.loading(formatMessage({ id: 'pages.software.message.loading' }), 0);  

    try {  
      const res = await getSoftwareList();  

      if (res?.data) {  
        hide();  
        setLoading(false);  
        // message.success(formatMessage({ id: 'pages.software.getList.success' }));  

        const softwaresArray = Object.entries(res.data.versions).map(([software_name, version_name]) => ({  
          software_name: software_name,  
          version_name: version_name || 'Not Available',  
        }));  

        setDataSource(softwaresArray);  
      } else {  
        hide();  
        setLoading(false);  
      }
    } catch (error) {  
      hide();  
      setLoading(false);
    }
  };  

  useEffect(() => {  
    getSoftwares();  
  }, []);  

  // Function to copy dataSource to clipboard  
  const copyToClipboard = () => {  
    const jsonStr = JSON.stringify(dataSource, null, 2); // Convert dataSource to a pretty-printed JSON string  
    navigator.clipboard.writeText(jsonStr)  
      .then(() => {  
        message.success(formatMessage({ id: 'pages.software.copy.success' }));  
      })  
      .catch((err) => {  
        message.error(formatMessage({ id: 'pages.software.copy.error' }));  
        console.error('Could not copy text: ', err);  
      });  
  };  

  const columns: ProColumns<any>[] = [  
    {  
      title: formatMessage({ id: 'pages.software.title.software_name' }),  
      dataIndex: 'software_name',  
      width: 100,  
      hideInSearch: true,  
      sorter: (a, b) => a.software_name.localeCompare(b.software_name),  
    },  
    {  
      title: formatMessage({ id: 'pages.software.title.versionId' }),  
      dataIndex: 'version_name',  
      width: 100,  
      hideInSearch: true,  
      sorter: (a, b) => a.version_name.localeCompare(b.version_name),  
    },    
  ];  

  return (  
    <Card>  
      <ProTable<any>  
        headerTitle={formatMessage({ id: 'pages.software.title.softwareList' })}  
        search={{ defaultCollapsed: false, optionRender: false, labelWidth: 120 }}  
        rowKey="software_name"  
        size="small"  
        options={{  
          density: false,  
          fullScreen: false,  
          reload: () => {  
            setLoading(true);  
            getSoftwares();  // Use existing reload logic  
          },  
        }}  
        loading={loading}  
        dataSource={dataSource}  
        pagination={{  
          pageSize: 10,  
          showQuickJumper: true,  
        }}  
        columns={columns}  
        scroll={{ x: 800 }}  
        bordered  
        toolBarRender={() => [  
          <CopyOutlined key="copy" onClick={copyToClipboard} />, // Add copy icon  
        ]}  
      />  
    </Card>  
  );  
};  

export default SoftwareListPage;