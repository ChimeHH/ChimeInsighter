import React from 'react';
// import { useModel } from 'umi';
// import { createFromIconfontCN } from '@ant-design/icons';
import classNames from 'classnames';
import style from './index.less';

type Props = {
    type: string;
    className?: string;
    customStyle?: React.CSSProperties;
};

const CustomIcon: React.FC<Props> = (props) => {
    const { type, className, customStyle } = props;
    // const { initialState } = useModel('@@initialState');

    // const IconFont = createFromIconfontCN({
    //     scriptUrl: initialState?.settings?.iconfontUrl
    // });

    // return (<IconFont type={type} className={className} style={customStyle} />);
    return (
        <svg aria-hidden='true' className={classNames(style.icon, className)} style={customStyle}>
            <use xlinkHref={`#${type}`} />
        </svg>
    );
};

export default CustomIcon;
