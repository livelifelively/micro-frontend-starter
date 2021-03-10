/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */

import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Table, Tooltip } from 'antd';
import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { formatDate } from '@slintel/s-date-time';
import { debounce } from 'lodash';

const AddToListForm = ({
  listObj,
  setSelectedList,
  openCreateList,
  pageStart,
  setPageStart,
  searchTerm,
  setSearchTerm,
  getTheList,
  loading,
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      // sorter: hasMore
      //   ? true
      //   : (a, b) => {
      //       if (a.title < b.title) {
      //         return -1;
      //       }
      //       if (a.title > b.title) {
      //         return 1;
      //       }
      //       return 0;
      //     },
      width: '30%',
      render: (text, record) => (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={text.length > 30 ? text : ''}>
              <Text style={{ width: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {text}
              </Text>
            </Tooltip>
            <Text type="secondary" style={{ fontSize: '12px', letterSpacing: 0 }}>
              {`${record.itemCount || 0} Company(s)`}
            </Text>
          </div>
        </>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      // sorter: hasMore
      //   ? true
      //   : (a, b) => {
      //       if (a.createdAt < b.createdAt) {
      //         return -1;
      //       }
      //       if (a.createdAt > b.createdAt) {
      //         return 1;
      //       }
      //       return 0;
      //     },
      render: (text) => formatDate(text),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedList(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleSearch = (value) => {
    setPageStart(1);
    getTheList(value);
  };

  const debounceHandleSearch = useMemo(() => debounce(handleSearch, 500), []);
  useEffect(() => {
    debounceHandleSearch(searchTerm);
  }, [searchTerm]);

  const hasMore = pageStart * 25 < listObj.count;
  const onChange = (pagination) => {
    if (hasMore || pagination.current < pageStart) {
      setPageStart(pagination.current);
      getTheList(searchTerm, pagination.current);
    }
  };

  return (
    <div className="create-list-drawer__form" style={{ overflow: 'hidden', height: 'calc(100vh - 150px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Input
          style={{
            background: '#FFFFFF',
            borderColor: '#DFE7F0',
            borderRadius: '5px',
            width: '240px',
            height: '36px',
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          maxLength={50}
          placeholder="Search"
          suffix={
            searchTerm ? (
              <CloseOutlined
                onClick={() => {
                  setSearchTerm('');
                  getTheList('');
                }}
                style={{ color: 'rgba(0,0,0,.45)' }}
              />
            ) : (
              <SearchOutlined style={{ width: '12px', height: '12px', color: '#929CB7' }} />
            )
          }
        />
        <Button
          onClick={openCreateList}
          style={{ borderRadius: '5px', border: '1px solid #5E81F4', color: '#5E81F4' }}
          icon={<PlusOutlined />}
        >
          Create List
        </Button>
      </div>
      <Table
        loading={loading}
        style={{ marginTop: '20px' }}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        onChange={onChange}
        columns={columns}
        rowKey="id"
        dataSource={listObj.rows}
        className="companies-list"
        pagination={{
          current: pageStart,
          responsive: true,
          total: listObj.count,
          position: ['topRight'],
          showSizeChanger: false,
          showTotal: (total, range) => (
            <>
              {`${range[0]}-${range[1]} of `}
              <b>{total}</b>
            </>
          ),
          pageSize: 25,
          size: 'small',
          itemRender: (page, pageType, originalElement) => {
            if (pageType === 'prev' || pageType === 'next') return originalElement;
            return null;
          },
        }}
        scroll={{ y: 'calc(100vh - 330px)' }}
      />
    </div>
  );
};

AddToListForm.defaultProps = {
  searchTerm: '',
  setSearchTerm: null,
};

AddToListForm.propTypes = {
  listObj: PropTypes.shape({
    count: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
  }).isRequired,
  setSelectedList: PropTypes.func.isRequired,
  openCreateList: PropTypes.func.isRequired,
  pageStart: PropTypes.number.isRequired,
  setPageStart: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  getTheList: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AddToListForm;
