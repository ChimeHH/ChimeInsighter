import { Select, Transfer } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';

type Props = {
  value?: Partial<ProjectAuthorization>[];
  onChange?: (values: Partial<ProjectAuthorization>[]) => void;
};

const project_roles = [
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'member',
    label: 'Member',
  },
  {
    value: 'viewer',
    label: 'Viewer',
  },
];

const TransferItem: React.FC<Props> = (props) => {
  const { value, onChange } = props;
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const { users } = useModel('user');
  const [dataSource, setDataSource] = useState<Partial<ProjectAuthorization>[]>([]);

  const handleChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
    const data = dataSource.filter(item => nextTargetKeys.includes(item.username!));
    onChange?.(data)
  };

  const handleSelectChange = (username: string, selectedValue: string) => {
    const data = dataSource.map(item => {
      if(item.username === username) {
        item.role = selectedValue;
      }

      return item;
    });
    setDataSource(data);
    onChange?.(data.filter(item => targetKeys.includes(item.username!)));
  }

  useEffect(() => {
    if(value) {
      setTargetKeys(value.map((item: any) => item.username))
      const data = users?.map(user => {
        const authorization = value.find(item => user.username === item?.username);
        return {
          username: user.username,
          role: authorization?.role ?? 'viewer',
        }
      })
      setDataSource(data ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Transfer
      rowKey={(record) => record.username!}
      listStyle={{
        width: 240,
      }}
      dataSource={dataSource}
      render={(item) => {
        return (
          <div
            key={item.username}
            style={{
              width: 180,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {item?.username}
            {
              targetKeys?.includes(item.username!) &&
              <Select
                style={{ width: 88, fontSize: 14 }}
                size="small"
                bordered={false}
                options={project_roles}
                value={item.role}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(selectedValue) => handleSelectChange(item.username!, selectedValue)}
              />
            }
          </div>
        );
      }}
      targetKeys={targetKeys}
      onChange={handleChange}
    />
  );
};

export default TransferItem;
