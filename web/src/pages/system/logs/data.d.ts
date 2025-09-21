import type { Moment, DurationConstructor } from 'moment';

type TagInfo = {
    key: number;
    value: number;
    unit: DurationConstructor;
    title: string;
}

type LogParams = {
  start_timestamp: Moment;
  end_timestamp: Moment;
};
