import React, { useState } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';

type Props = {
  value?: React.Key[];
  onChange?: (unCheckedkeys: React.Key[]) => void;
};

const tree: TreeDataNode[] = [
  {
    title: 'ZeroDay Vulnerabilities',
    key: 'zeroday',
  },
  {
    title: 'Public Vulnerabilities',
    key: 'public',
  },  
  {
    title: 'Malware',
    key: 'malware',    
  },
  {
    title: 'Information Leakage',
    key: 'infoleak',    
  },
  {
    title: 'Security',
    key: 'security',    
  },
  {
    title: 'Misconfiguration',
    key: 'misconfiguration',    
  },
  {
    title: 'Compliance',
    key: 'compliance',    
  },
  {
    title: 'Password',
    key: 'password',    
  },
];

const allKeys: React.Key[] = [
  'zeroday',
  'public',
  'malware',
  'infoleak',
  'security',
  'misconfiguration',
  'compliance',
  'password'
];

const TreeItem: React.FC<Props> = (props) => {
  const { onChange } = props;
  const [, setUnCheckedKeyArr] = useState<React.Key[]>([]);

  const handleCheck = (checkedKeys: React.Key[]) => {
    const unCheckedKeys = allKeys.filter((item) => !(checkedKeys as React.Key[]).includes(item));
    setUnCheckedKeyArr(unCheckedKeys);
    onChange?.(unCheckedKeys);
  };

  return (
    <Tree
      treeData={tree}
      checkable
      height={140}
      defaultCheckedKeys={['public', 'malware', 'infoleak',
                           'security', 'misconfiguration', 'compliance', 'password' ]}
      selectable={false}
      onCheck={(checked) => handleCheck(checked as React.Key[])}
    />
  );
};

export default TreeItem;
