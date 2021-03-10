/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { ConfigProvider, Button, Popover, Table, Text } from 'antd';
import { ConfigProvider, Button, Popover, Table, Space, Menu, Dropdown } from 'antd';
import { PlusOutlined, CaretUpOutlined, MinusOutlined, CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

import CompanyAvatarInfo from '@slintel/bc-company-avatar-info';
import BuyingSignal from '@slintel/bc-buying-signals';
import Text from 'antd/lib/typography/Text';

import EmptyCompaniesList from './empty-companies-list';
import './companies-list.scss';

const BUYING_SIGNALS_ORDER = ['funding', 'jobs', 'size', 'renewal', 'technology', 'technologyCategory'];

export default class CompaniesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
    };
  }

  allColumns = () => {
    // TODO: evolve this into interface to select columns and their order.
    return [this.companyColumn(), this.scoreColumn(), this.buyingSignalsColumn(), this.actionsColumn()];
  };

  // the columns render keyed companies data, from companies-to-target-feed
  companyColumn = () => {
    const { oldDashboardURL } = this.props;
    return {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      className: 'companies-list__company-details',
      width: 450,
      render: (company) => <CompanyAvatarInfo company={company} oldDashboardURL={oldDashboardURL} />,
    };
  };

  scoreColumn = () => {
    return {
      title: 'Score',
      dataIndex: 'propensity',
      key: 'propensity',
      width: 200,
      render: (propensity) => {
        return (
          <div className="companies-list__score">
            <Popover placement="bottom" content={propensity.brief}>
              {propensity.score}
              {propensity.change > 0 && (
                <div className="companies-list__score-change companies-list__score-change--positive">
                  <PlusOutlined style={{ fontSize: '10px' }} />
                  {propensity.change}
                  <CaretUpOutlined />
                </div>
              )}
              {propensity.change < 0 && (
                <div className="companies-list__score-change companies-list__score-change--negative">
                  <MinusOutlined style={{ fontSize: '10px' }} />
                  {propensity.change * -1}
                  <CaretDownOutlined />
                </div>
              )}
              {propensity.change === 0 && (
                <div className="companies-list__score-change companies-list__score-change--same">
                  <MinusOutlined />
                </div>
              )}
            </Popover>
          </div>
        );
      },
      sorter: (a, b) => {
        return a.propensity.score - b.propensity.score;
      },
    };
  };

  buyingSignalsColumn = () => {
    const { preferencesDrawerToggle } = this.props;
    return {
      title: (
        <div>
          Strength of buying signals&nbsp;
          <Popover
            placement="bottom"
            content={() => {
              return <div>Buying signals contribute to the overall intent score of a company</div>;
            }}
          >
            <InfoCircleOutlined />
          </Popover>
        </div>
      ),
      key: 'Strength of buying signals',
      dataIndex: 'buyingSignals',
      width: 350,
      render: (buyingSignals) => {
        // FIXME This code is crying DRY!!!
        return (
          <>
            {BUYING_SIGNALS_ORDER.map((val) => {
              return (
                <BuyingSignal
                  signalStrength={buyingSignals[val]}
                  signalType={val}
                  subcategory={buyingSignals.subcategory}
                  subcategoryLabel={buyingSignals.subcategoryLabel}
                  category={buyingSignals.category}
                  key={val}
                  threshold={buyingSignals.minimumScoresThreshold[val]}
                  addPreferencesDrawer={preferencesDrawerToggle}
                />
              );
            })}
          </>
        );
      },
    };
  };

  actionsColumn = () => {
    const { mixpanel, oldDashboardURL } = this.props;

    return {
      key: 'action',
      dataIndex: 'company',
      render: (company) => {
        return (
          <div className="companies-list__action">
            <Button
              type="primary"
              ghost
              className="companies-list__action--view-leads"
              onClick={() => {
                window.open(`${oldDashboardURL}leads?company_name=${company.name}`);
                if (mixpanel) mixpanel.track('intent_tab', { payload: { name: 'View Leads', company: company.name } });
              }}
            >
              View Leads
            </Button>
            {/* <MoreOutlined className="companies-list__action--view-more" /> */}
          </div>
        );
      },
      align: 'right',
    };
  };

  onCompaniestTableChange = (pagination) => {
    const { fetchCompanies } = this.props;

    fetchCompanies(pagination.current, pagination.pageSize);
  };

  onSelectChange = (newSelectedKeys, selectedRows) => {
    const { setCheckedItems } = this.props;
    this.setState({
      selectedRowKeys: newSelectedKeys,
    });
    setCheckedItems(selectedRows);
  };

  addToListOptions = () => {
    const { selectedRowKeys } = this.state;
    const { totalDataUnits, addToListDrawerToggle } = this.props;
    return (
      <Menu>
        <Menu.Item disabled={!selectedRowKeys.length} onClick={() => addToListDrawerToggle(false)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                marginRight: '20px',
                width: '150px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text style={{ color: '#29275F', fontSize: '14px' }}>Add selected</Text>
              <Text style={{ color: '#929CB7', fontSize: '12px' }}>{`${selectedRowKeys.length} item(s)`}</Text>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item disabled={!totalDataUnits} onClick={() => addToListDrawerToggle(true)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                marginRight: '20px',
                width: '150px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text style={{ color: '#29275F', fontSize: '14px' }}>Add all</Text>
              <Text style={{ color: '#929CB7', fontSize: '12px' }}>{`${totalDataUnits} item(s)`}</Text>
            </div>
          </div>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const {
      companies,
      totalDataUnits,
      preferencesDrawerToggle,
      identifier,
      // mixpanel,
      type,
      pageSize,
    } = this.props;
    const columns = this.allColumns();
    const rowSelection = {
      selectedRowKeys,
      preserveSelectedRowKeys: true,
      onChange: this.onSelectChange,
      fixed: true,
    };

    return (
      <ConfigProvider
        renderEmpty={() => (
          <EmptyCompaniesList preferencesOrFilter={type} togglePrefsDrawer={preferencesDrawerToggle} />
        )}
      >
        <div className="companies-list">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={companies}
            pagination={{
              responsive: true,
              total: totalDataUnits,
              position: ['topRight'],
              style: { marginRight: '15px', marginBottom: '5px' },
              showSizeChanger: false,
              showTotal: (total, range) => (
                <>
                  {`${range[0]}-${range[1]} of `}
                  <b>{total}</b>
                </>
              ),
              pageSize,
              size: 'small',
              itemRender: (page, pageType, originalElement) => {
                if (pageType === 'prev' || pageType === 'next') return originalElement;
                return null;
              },
            }}
            className={`${identifier} companies-list`}
            scroll={{ y: 550 }}
            onChange={this.onCompaniestTableChange}
            title={() => (
              <div
                style={{
                  top: '-38px',
                  position: 'absolute',
                }}
              >
                {totalDataUnits > 0 && (
                  <Space>
                    <Dropdown
                      getPopupContainer={(trigger) => trigger.parentNode}
                      overlay={this.addToListOptions}
                      placement="bottomLeft"
                      arrow
                    >
                      <Button>Add To List</Button>
                    </Dropdown>
                  </Space>
                )}
              </div>
            )}
          />
        </div>
      </ConfigProvider>
    );
  }
}

CompaniesList.propTypes = {
  // companies: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.string,
  //     key: PropTypes.string,
  //     company: {
  //       id: PropTypes.string,
  //       name: PropTypes.string,
  //       logo: PropTypes.string,
  //       website: PropTypes.string,
  //       // location: PropTypes.string,
  //     },
  //     category: PropTypes.string,
  //     subCategory: PropTypes.string,
  //     propensity: {
  //       score: PropTypes.string,
  //       change: PropTypes.string,
  //     },
  //     buyingSignals: {
  //       jobs: PropTypes.string,
  //       keywords: PropTypes.number,
  //       funding: PropTypes.number,
  //       size: PropTypes.number,
  //       technology: PropTypes.number,
  //     },
  //   })
  // ).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  companies: PropTypes.array.isRequired,
  totalDataUnits: PropTypes.number.isRequired,
  fetchCompanies: PropTypes.func.isRequired,
  preferencesDrawerToggle: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  pageSize: PropTypes.number.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  type: PropTypes.string.isRequired,
  oldDashboardURL: PropTypes.string.isRequired,
  addToListDrawerToggle: PropTypes.func.isRequired,
  setCheckedItems: PropTypes.func.isRequired,
};

CompaniesList.defaultProps = {
  mixpanel: null,
};
