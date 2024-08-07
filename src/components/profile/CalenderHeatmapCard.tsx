import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface CalendarHeatmapCardProps {
  startDate: Date;
  endDate: Date;
  submissionData: any[];
}

const CalendarHeatmapCard: React.FC<CalendarHeatmapCardProps> = ({
  startDate,
  endDate,
  submissionData,
}) => {
  return (
    <div className='p-6 bg-white shadow-md rounded-md'>
      <h3 className='text-xl font-semibold mb-4 flex items-center'>
        <FaCalendarAlt className='mr-2' /> Calendar Heatmap
      </h3>
      <div className='calendar-heatmap-wrapper'>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={submissionData}
          classForValue={value => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value.count}`;
          }}
        />
      </div>
    </div>
  );
};

export default CalendarHeatmapCard;
