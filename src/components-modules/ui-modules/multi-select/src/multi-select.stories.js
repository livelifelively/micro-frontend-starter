import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import MultiSelect from '.';

export default {
  component: MultiSelect,
  title: 'Design System/UI Components/Multi Select',
};

export const Empty = () => {
  const [selected] = useState([{ label: 'value 1' }]);

  return (
    <div>
      <MultiSelect
        fetchData={() => []}
        init={selected}
        keyParam={(val) => {
          return val.label;
        }}
        onChange={action('Value Changed')}
        placeholder="Type Your Input Here"
        valParam={(val) => {
          return val.label;
        }}
      />
    </div>
  );
};
