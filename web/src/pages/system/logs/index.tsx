import { download } from '@/utils/common';
import { Button, Card, DatePicker, Form, message, Tag } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'umi';
import type { LogParams, TagInfo } from './data';
import { getLogs } from './service';
import styles from './style.less';

const { CheckableTag } = Tag;

const Logs = () => {
  const { formatMessage } = useIntl();
  const [selectedKey, setSelectedKey] = useState<number | undefined>(4);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [tags] = useState<TagInfo[]>([
    {
      key: 1,
      value: 1,
      unit: 'h',
      title: formatMessage({ id: 'pages.logs.tags.lastOneHour' }),
    },
    {
      key: 2,
      value: 3,
      unit: 'h',
      title: formatMessage({ id: 'pages.logs.tags.lastThreeHours' }),
    },
    {
      key: 3,
      value: 6,
      unit: 'h',
      title: formatMessage({ id: 'pages.logs.tags.lastSixHours' }),
    },
    {
      key: 4,
      value: 1,
      unit: 'day',
      title: formatMessage({ id: 'pages.logs.tags.lastOneDay' }),
    },
    {
      key: 5,
      value: 7,
      unit: 'days',
      title: formatMessage({ id: 'pages.logs.tags.lastSevenDays' }),
    },
    {
      key: 6,
      value: 30,
      unit: 'days',
      title: formatMessage({ id: 'pages.logs.tags.lastThirtyDays' }),
    },
    {
      key: 7,
      value: 365,
      unit: 'days',
      title: formatMessage({ id: 'pages.logs.tags.last365Days' }),
    },
  ]);

  const handleChange = (tag: TagInfo) => {
    const { key, value, unit } = tag;
    if (key === selectedKey) {
      return;
    }

    setSelectedKey(key);
    const start_timestamp = moment().subtract(value, unit);
    const end_timestamp = moment();
    form.setFieldsValue({
      start_timestamp,
      end_timestamp,
    });
  };

  const handleValuesChange = (values: LogParams) => {
    if (selectedKey) {
      setSelectedKey(undefined);
    }

    const start_timestamp = values.start_timestamp;
    const end_timestamp = values.end_timestamp;
    if (start_timestamp.isAfter(end_timestamp)) {
      message.info(formatMessage({ id: 'pages.logs.message.dateError' }));
    }
  };

  const handFinish = async (values: LogParams) => {
    setLoading(true);
    const hide = message.loading(formatMessage({ id: 'pages.logs.loading' }), 0);
    try {
      const res = await getLogs({
        start_timestamp: values.start_timestamp.unix(),
        end_timestamp: values.end_timestamp.unix(),
      });

      const fileName = `logs_dump_${moment().format('YYYYMMDDHHmmss')}.tar.gz`;
      download(res, fileName);

      hide();
      setLoading(false);
      message.success(formatMessage({ id: 'pages.logs.download.success' }));
    } catch (error) {
      hide();
      setLoading(false);
    }
  };

  return (
    <>
      <Card title={formatMessage({ id: 'pages.logs.tags.title' })}>
        {tags.map((tag) => (
          <CheckableTag
            key={tag.key}
            checked={selectedKey === tag.key}
            onChange={() => handleChange(tag)}
            className={classNames(styles.tag, { [styles.checked]: selectedKey === tag.key })}
          >
            {tag.title}
          </CheckableTag>
        ))}
      </Card>
      <Card>
        <Form
          form={form}
          onValuesChange={(_, values) => handleValuesChange(values)}
          onFinish={handFinish}
        >
          <Form.Item
            name="start_timestamp"
            label={formatMessage({ id: 'pages.logs.form.startDate.label' })}
            initialValue={moment().subtract(1, 'day')}
          >
            <DatePicker
              showTime
              allowClear={false}
              disabledDate={(date) => date && date > moment().endOf('day')}
            />
          </Form.Item>
          <Form.Item
            name="end_timestamp"
            label={formatMessage({ id: 'pages.logs.form.endDate.label' })}
            initialValue={moment()}
          >
            <DatePicker
              showTime
              allowClear={false}
              disabledDate={(date) => date && date > moment().endOf('day')}
            />
          </Form.Item>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" loading={loading}>
              {formatMessage({ id: 'pages.logs.form.submitBtn' })}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Logs;
