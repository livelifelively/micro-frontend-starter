/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable import/no-unresolved */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import RightHandSideDrawer from '@slintel/uic-drawer';
import DrawerTitle from '@slintel/uic-drawer-title';
import { showError } from '@slintel/s-notifications';
import CreateListForm from './create-list-form';

const CreateListDrawer = ({ visible, onClose, onSubmit, setReloadListItems }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    form.setFieldsValue({
      title: '',
    });
    onClose();
  };

  const onFormSubmit = () => {
    form.submit();
  };

  const onFinish = async (values) => {
    try {
      if (!values.title) {
        throw new Error('Please enter a valid list name.');
      }
      setLoading(true);
      const response = await onSubmit(values);
      setLoading(false);
      if (response.error) {
        throw new Error(response.error);
      }
      setReloadListItems(true);
      form.setFieldsValue({
        title: '',
      });
      onClose();
    } catch (ex) {
      showError(ex.message);
    }
  };

  return (
    <RightHandSideDrawer
      visible={visible}
      onClose={onCancel}
      content={<CreateListForm Form={Form} formRef={form} onFinish={onFinish} />}
      title={
        <DrawerTitle
          title="CREATE A SMART LIST"
          actions={[
            { title: 'Cancel', type: 'default', size: 'large', onClick: onCancel },
            {
              loading,
              title: 'Create',
              type: 'primary',
              size: 'large',
              onClick: onFormSubmit,
            },
          ]}
        />
      }
    />
  );
};

CreateListDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setReloadListItems: PropTypes.func.isRequired,
};

export default CreateListDrawer;
