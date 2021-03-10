import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from 'antd';

import Drawer from '.';

export default {
  component: Drawer,
  title: 'Design System/UI Components/Drawer',
};

export const toggle = () => {
  const [visibility, setVisibility] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setVisibility(!visibility);
        }}
      >
        {'Toggle Drawer'}
      </Button>
      <Drawer
        content={<div>{'Content'}</div>}
        onClose={action('Drawer Close')}
        title="Drawer Title"
        visible={visibility}
      >
        {'Button'}
      </Drawer>
    </div>
  );
};
