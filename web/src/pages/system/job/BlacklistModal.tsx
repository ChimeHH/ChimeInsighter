import React, { useEffect, useState, useRef } from 'react';  
import { Modal, Button, Table, Input } from 'antd';  
import { getActiveVersionStatus, updateActiveVersionStatus } from './service';  
import { useIntl } from 'umi';  
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';  
import './style.css';  

const BlacklistModal: React.FC<{ visible: boolean; onClose: () => void; filterVersionId?: string }> = ({ visible, onClose, filterVersionId }) => {  
  const { formatMessage } = useIntl();  
  const [blacklist, setBlacklist] = useState<any[]>([]);  
  const [newEntry, setNewEntry] = useState({ category: '', value: '' });  
  const [hasChanges, setHasChanges] = useState(false); // 跟踪是否有增删操作
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 存储选中的行的 key
  const tableContainerRef = useRef<HTMLDivElement | null>(null); // 创建表格容器的引用  

  useEffect(() => {  
    if (visible && filterVersionId) {  
      fetchData();  
    }  
  }, [visible, filterVersionId]);  

  const fetchData = () => {
    getActiveVersionStatus(filterVersionId).then(response => {  
      const blacklistData = response.data.blacklist.split('|').map(item => {  
        const parts = item.split(':');  
        return {  
          category: parts[0].trim(),  
          value: parts[1]?.trim() || '',  
        };  
      }).filter(entry => entry.category && entry.value);  

      // 使用 Map 确保唯一性  
      const uniqueBlacklist = Array.from(new Map(blacklistData.map(item => [`${item.category}:${item.value}`, item])).values());  
      setBlacklist(uniqueBlacklist);  
      setSelectedRowKeys([]); // 清空选中的行
      setHasChanges(false); // 重置增删操作状态
    }).catch(error => {  
      console.error('Error fetching active version status:', error);  
    });  
  };

  const handleDelete = (index: number) => {  
    const updatedBlacklist = blacklist.filter((_, i) => i !== index);  
    setBlacklist(updatedBlacklist);  
    setHasChanges(true); // 记录增删操作
  };  

  const handleAddEntry = () => {  
    if (newEntry.category && newEntry.value) {  
      const isDuplicate = blacklist.some(entry => entry.category === newEntry.category && entry.value === newEntry.value);  
      if (!isDuplicate) {  
        const updatedBlacklist = [...blacklist, { ...newEntry }];  
        setBlacklist(updatedBlacklist);  
        setHasChanges(true); // 记录增删操作

        // 使用 setTimeout 确保滚动到最底部  
        setTimeout(() => {
          if (tableContainerRef.current) {  
            tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;  
          }  
        }, 0);  

        setNewEntry({ category: '', value: '' }); // 清空输入框  
      } else {  
        console.warn('Same rule already exists in the blacklist.'); // 使用其他方式通知用户  
      }  
    }  
  };  

  const handleSubmit = () => {  
    const blacklistString = blacklist.map(entry => `${entry.category}:${entry.value}`).join('|');  
    updateActiveVersionStatus(filterVersionId, blacklistString).then(response => {  
      const blacklistData = response.data.blacklist.split('|').map(item => {  
        const parts = item.split(':');  
        return {  
          category: parts[0].trim(),  
          value: parts[1]?.trim() || '',  
        };  
      }).filter(entry => entry.category && entry.value);  

      const uniqueBlacklist = Array.from(new Map(blacklistData.map(item => [`${item.category}:${item.value}`, item])).values());  
      setBlacklist(uniqueBlacklist); // 刷新表格数据  
      setNewEntry({ category: '', value: '' }); // 清空输入框  
      setHasChanges(false); // 提交后重置增删操作状态
      setSelectedRowKeys([]); // 清空选择的行
    }).catch(error => {  
      console.error('Error updating active version status:', error);  
    });  
  };

  const handleBatchDelete = () => {
    const updatedBlacklist = blacklist.filter((_, index) => !selectedRowKeys.includes(index));  
    setBlacklist(updatedBlacklist);  
    setHasChanges(true); // 记录增删操作
    setSelectedRowKeys([]); // 清空选择的行
  };

  const columns = [  
    {  
      title: <input
                type="checkbox"
                checked={selectedRowKeys.length === blacklist.length && blacklist.length > 0} // 全选复选框的选中状态
                onChange={() => {
                  if (selectedRowKeys.length === blacklist.length) {
                    // 清空选择
                    setSelectedRowKeys([]);
                  } else {
                    // 全选
                    setSelectedRowKeys(blacklist.map((_, index) => index));
                  }
                }}
             />,
      dataIndex: 'selection',  
      render: (_, __, index) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(index)}
          onChange={() => {
            const newSelectedRowKeys = selectedRowKeys.includes(index)
              ? selectedRowKeys.filter(key => key !== index)
              : [...selectedRowKeys, index];
            setSelectedRowKeys(newSelectedRowKeys);
          }}
        />
      ),
      width: 40,
      align: 'center' // 使复选框居中
    },
    {  
      title: formatMessage({ id: 'pages.blacklist.index' }),  
      render: (_, __, index) => index + 1,  
      width: 50, 
      align: 'center' // 使索引居中
    },  
    { 
      title: formatMessage({ id: 'pages.blacklist.category' }), 
      dataIndex: 'category', 
      key: 'category', 
      width: 80,
      align: 'center' // 使类别居中
    },  
    { 
      title: formatMessage({ id: 'pages.blacklist.value' }), 
      dataIndex: 'value', 
      key: 'value', 
      width: 200,
      align: 'center' // 使值居中
    },  
  ];  

  const tableData = blacklist.map((entry) => ({
    ...entry,
    uniqueKey: `${entry.category}-${entry.value}`, // 组合 category 和 value 生成唯一 key
  }));

  

  return (  
    <Modal  
      title={formatMessage({ id: 'pages.blacklist.management' })}  
      visible={visible}  
      onCancel={onClose}  
      footer={null}  
      width={1000}  
      bodyStyle={{ padding: 0 }}  
    >  
      <div style={{ display: 'flex', flexDirection: 'column', height: '300px', padding: '16px' }}>  
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <ReloadOutlined
            style={{ cursor: 'pointer', marginRight: 16 }}
            onClick={fetchData} // 刷新数据
          />
          <DeleteOutlined
            style={{ cursor: 'pointer', color: 'red', marginRight: 16 }}
            onClick={handleBatchDelete}
          />
        </div>
        <div ref={tableContainerRef} style={{ flex: '1 1 auto', overflowY: 'auto', marginBottom: '16px' }}>  
          <Table  
            dataSource={tableData}  
            columns={columns}  
            rowKey="uniqueKey" // 使用组合后的唯一 key
            pagination={false}  
            bordered  
            style={{ margin: '8px 0' }}  
          />  
        </div>  

        <div style={{ display: 'flex', alignItems: 'center' }}>  
          <Input  
            placeholder={formatMessage({ id: 'pages.blacklist.category' })}  
            value={newEntry.category}  
            onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}  
            style={{ marginRight: 8, flex: 1 }}  
          />  
          <Input  
            placeholder={formatMessage({ id: 'pages.blacklist.value' })}  
            value={newEntry.value}  
            onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}  
            style={{ marginRight: 8, flex: 1 }}  
          />  
          <Button  
            onClick={handleAddEntry}  
            style={{ marginRight: 8 }}
          >
            {formatMessage({ id: 'pages.blacklist.add' })}
          </Button>  
          <Button 
            type="primary" 
            onClick={handleSubmit}
            disabled={!hasChanges} // 仅在有增删操作后才能提交
          >
            {formatMessage({ id: 'pages.blacklist.submit' })}
          </Button>  
        </div>  
      </div>  
    </Modal>  
  );  
};  

export default BlacklistModal;
