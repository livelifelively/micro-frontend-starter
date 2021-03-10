/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, Button, Input, Form, AutoComplete, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { OkSignIcon } from '@slintel/uic-icons';

export default class ShareNewsForm extends Component {
  constructor(props) {
    super(props);
    const { linkFormToDrawer } = props;

    this.state = {
      copySuccess: false,
    };

    this.shareNewsForm = React.createRef();
    linkFormToDrawer(this.shareNewsForm);
  }

  InputItem = () => {
    const { domainUsers } = this.props;
    return (
      <AutoComplete
        style={{
          background: '#FFFFFF',
          borderColor: '#DFE7F0',
          borderRadius: '5px',
          width: '420px',
          height: '40px',
          marginTop: '10px',
        }}
        placeholder="Please enter email"
        options={domainUsers.map((e) => ({ value: e.email }))}
        filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      />
    );
  };

  onCopyText = () => {
    this.setState({
      copySuccess: true,
    });
  };

  onFinish = (values) => {
    const { emails, email, notes } = values;
    const { domainUsers, onFormSubmit, newsToShare } = this.props;

    let params = {};
    let emailList = [];

    if (email) {
      emailList.push(email);
    }
    if (emails && emails.length) {
      emailList = emailList.concat(emails);
    }

    params = {
      emailList: [...new Set(emailList.map((e) => e.trim()))].map((emailId) => {
        const domainEmail = domainUsers.find((e) => e.email === emailId);
        return domainEmail || { name: emailId, email: emailId };
      }),
      newsId: newsToShare.id,
      note: notes && notes.trim(),
    };

    onFormSubmit(params);
  };

  render() {
    const { disabled, newsToShare } = this.props;
    const { copySuccess } = this.state;

    return (
      <Spin spinning={disabled}>
        <div className="preferences-drawer__form">
          <Form layout="vertical" hideRequiredMark ref={this.shareNewsForm} onFinish={this.onFinish}>
            <Form.Item
              name="email"
              label={<Text style={{ fontWeight: 500, color: '#29275F' }}>Email</Text>}
              validateTrigger={['onBlur']}
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please enter a valid email.',
                },
              ]}
              style={{
                marginBottom: '0px',
              }}
            >
              {this.InputItem()}
            </Form.Item>
            <Form.List name="emails">
              {(fields, { add, remove }) => {
                return (
                  <div>
                    {fields.map((field) => (
                      <Form.Item required={false} key={field.key} style={{ marginBottom: '0px' }}>
                        <Form.Item
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...field}
                          validateTrigger={['onBlur']}
                          rules={[
                            {
                              required: true,
                              type: 'email',
                              message: 'Please enter a valid email or delete this field.',
                            },
                          ]}
                          noStyle
                        >
                          {this.InputItem()}
                        </Form.Item>
                        {fields.length > 0 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: '0 8px', color: 'red' }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                          add();
                        }}
                        type="text"
                        style={{
                          border: 'none',
                          color: '#5E81F4',
                          padding: '0px',
                          letterSpacing: '0px',
                          marginTop: '10px',
                        }}
                      >
                        Add More
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
            <Form.Item
              name="notes"
              label={
                <>
                  <Text style={{ fontWeight: 500, color: '#29275F' }}> Note </Text>
                  <Text style={{ marginLeft: '5px', color: '#29275F' }}> (Optional) </Text>
                </>
              }
            >
              <Input.TextArea
                style={{
                  width: '420px',
                  height: '100px',
                  border: '1px solid #DFE7F0',
                  borderRadius: '5px',
                  resize: 'none',
                  marginTop: '10px',
                }}
                maxLength={300}
                placeholder="Add a note"
              />
            </Form.Item>
            <Form.Item
              label={
                <>
                  <Text style={{ color: '#929CB7' }}> (or) </Text>
                </>
              }
            />
            <Space size="small">
              <CopyToClipboard onCopy={this.onCopyText} text={newsToShare?.news?.url}>
                <Button
                  type="default"
                  style={{
                    background: '#E6F4FF',
                    borderRadius: '5px',
                    color: '#5E81F4',
                    width: '120px',
                    height: '40px',
                    padding: '0px',
                    letterSpacing: '0.7px',
                  }}
                >
                  Copy Link
                </Button>
              </CopyToClipboard>
              {copySuccess ? (
                <>
                  <OkSignIcon fill="#6EC194" />
                  <Text style={{ color: '#6EC194', fontWeight: 500 }}> Copied </Text>
                </>
              ) : null}
            </Space>
          </Form>
        </div>
      </Spin>
    );
  }
}

ShareNewsForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  linkFormToDrawer: PropTypes.func.isRequired,
  newsToShare: PropTypes.shape({
    id: PropTypes.string,
    news: PropTypes.shape(),
  }).isRequired,
  domainUsers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    })
  ),
  disabled: PropTypes.bool.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
};

ShareNewsForm.defaultProps = {
  mixpanel: null,
  domainUsers: [],
};
