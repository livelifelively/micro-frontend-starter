/* eslint-disable import/no-unresolved */
import React from 'react';
import { notification } from 'antd';
import { CloseOutlined, InfoOutlined } from '@ant-design/icons';

import { OkSignIcon } from '@qbila/uic-icons';
import Text from 'antd/lib/typography/Text';

export const showError = (errorMessage) => {
  return notification.open({
    message: <Text style={{ color: '#F65F4B' }}>{errorMessage}</Text>,
    style: {
      borderRadius: '5px',
      color: '#F65F4B',
    },
    top: '10px',
    icon: <InfoOutlined style={{ fill: '#F65F4B' }} />,
    closeIcon: <CloseOutlined style={{ color: '#F65F4B' }} />,
  });
};

export const showSuccess = (successMessage, duration = 4.5) => {
  return notification.open({
    message: <Text style={{ color: '#6EC194' }}>{successMessage}</Text>,
    style: {
      borderRadius: '5px',
      color: '#6EC194',
    },
    duration,
    top: '10px',
    icon: <OkSignIcon fill="#6EC194" />,
    closeIcon: <CloseOutlined style={{ color: '#6EC194' }} />,
  });
};
