/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Switch } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import Dropdown from '@slintel/uim-dropdown';

const disableSelect = true;

const LIST_TYPE = [
  // {
  //   label: 'Lead',
  //   value: 'lead',
  // },
  {
    label: 'Company',
    value: 'company',
  },
];

const CreateListForm = ({ Form, formRef, onFinish }) => {
  return (
    <div className="create-list-drawer__form">
      <div>
        <Form
          initialValues={{
            name: '',
            listType: 'company',
            autoUpdate: true,
          }}
          form={formRef}
          onFinish={onFinish}
          layout="vertical"
          hideRequiredMark
        >
          <Form.Item
            name="title"
            label={<Title level={5}> List Name </Title>}
            validateTrigger={['onBlur']}
            rules={[
              {
                required: true,
                message: 'Please enter a valid list name.',
              },
            ]}
          >
            <Input maxLength="50" style={{ width: '420px' }} placeholder="My Smart List" />
          </Form.Item>
          <Form.Item
            name="listType"
            label={
              <>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Title level={5}> List Type </Title>
                  <Text style={{ fontSize: '12px', color: '#929CB7' }}>
                    Note: Your list type cannot be changed once it is created
                  </Text>
                </div>
              </>
            }
          >
            <Dropdown
              defaultValue={{ value: 'company' }}
              placeholder="Select"
              optionList={LIST_TYPE}
              handleOnChange={() => console.log('changing')}
              customStyle={{
                width: '420px',
              }}
              disabled={disableSelect}
            />
          </Form.Item>
          <Form.Item
            name="autoUpdate"
            valuePropName="checked"
            label={
              <>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Title level={5}> Auto Update </Title>
                  <Text style={{ fontSize: '12px', color: '#929CB7' }}>
                    Slintel will automatically enrich records with new information whenever the database is updated.
                  </Text>
                </div>
              </>
            }
          >
            <Switch style={{ opacity: '0' }} checked disabled />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

CreateListForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  Form: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  formRef: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default CreateListForm;
