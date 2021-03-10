/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */

import React from 'react';
import * as PropTypes from 'prop-types';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import Link from 'antd/lib/typography/Link';
import { Button, Collapse } from 'antd';
import reactStringReplace from 'react-string-replace';
import { cloneDeep } from 'lodash';

import { formatDate } from '@slintel/s-date-time';

import { SourceLinkIcon, ThemeIcon, ShareLinkIcon } from '@slintel/uic-icons';

import { convertAllEscapes } from '@slintel/s-encode-decode';
import { NEWS } from '@slintel/cc-constants';

import './news-card.scss';

import NewsContext from '../news-context';

const { Panel } = Collapse;

// import Share from './share';

const { NEWS_THEMES } = NEWS;

class NewsCard extends React.Component {
  handleOnClickShare = () => {
    const { newsItem } = this.props;
    const { toggleShareNewsDrawerVisibility } = this.context;
    toggleShareNewsDrawerVisibility(cloneDeep(newsItem));
  };

  getSmallThemeHeading = (theme) => {
    if (theme === 'ipos') return 'IPOs';
    return theme ? theme.split('_').join(' ').toUpperCase() : '';
  };

  renderTwitterNewsTitle = (newsTitle) => {
    if (!newsTitle) return null;
    let decodedNewsTitle = convertAllEscapes(newsTitle.replace(/\\\\/g, '\\'));
    decodedNewsTitle = reactStringReplace(decodedNewsTitle, /#(\S*)/g, (match, i) => {
      return (
        <Link href={`https://twitter.com/hashtag/${match}?src=hashtag_click`} target="_blank" key={match + i}>
          {`#${match}`}
        </Link>
      );
    });

    decodedNewsTitle = reactStringReplace(decodedNewsTitle, /@(\S*)/g, (match, i) => {
      return (
        <Link href={`https://twitter.com/${match}`} target="_blank" key={match + i}>
          {`@${match}`}
        </Link>
      );
    });

    decodedNewsTitle = reactStringReplace(decodedNewsTitle, /https:\/\/t.co(\S*)/g, (match, i) => {
      return (
        <Link href={`https://t.co${match}`} target="_blank" key={match + i}>
          {`https://t.co${match}`}
        </Link>
      );
    });
    return decodedNewsTitle;
  };

  renderNewsHeader = () => {
    const { newsItem } = this.props;
    const { oldDashboardURL } = this.context;

    const companies = newsItem.news.company_ids.filter((company) => !!company.companyName);
    const { bgColor, color } = NEWS_THEMES[newsItem.news.theme] || NEWS_THEMES.all;

    return (
      <div className="news-card-header">
        <div className="news-card-header__image">
          <Avatar
            style={{
              background: bgColor,
              borderRadius: '5px',
            }}
            shape="square"
            size={64}
            icon={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <ThemeIcon theme={newsItem.news.theme} fill={color} width={40} height={40} />
            }
          />
        </div>
        <div className="news-card-header__header">
          <div className="small-heading">
            <Text strong="true" style={{ color, marginRight: '10px' }}>
              {this.getSmallThemeHeading(newsItem.news.theme)}
            </Text>
            <>
              {companies.map((company, index) => {
                return (
                  <Link
                    href={`${oldDashboardURL}company-details/${company.companyId}`}
                    target="_blank"
                    key={company.companyId}
                    style={{
                      color: '#5753B5',
                      fontSize: '12px',
                      paddingLeft: '5px',
                      textTransform: 'capitalize',
                      fontWeight: 'normal',
                    }}
                  >
                    {`${company.companyName}${index !== companies.length - 1 ? ',' : ''}`}
                  </Link>
                );
              })}
              {companies.length ? (
                <Text
                  style={{
                    color: '#929CB7',
                    fontSize: '12px',
                    textTransform: 'lowercase',
                    fontWeight: 'normal',
                  }}
                >
                  {`${newsItem.news.company_ids.length ? ' was mentioned in the news' : ''}`}
                </Text>
              ) : null}
            </>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="main-title">
              {newsItem.news.source === 'twitter'
                ? this.renderTwitterNewsTitle(newsItem.news.title)
                : newsItem.news.title}
            </div>
            <div className="card-action-item-block">
              <Button
                icon={<ShareLinkIcon width="13px" height="13px" className="card-action-items" />}
                type="link"
                onClick={() => this.handleOnClickShare(newsItem.id)}
              />
              <Button
                icon={<SourceLinkIcon width="13px" height="13px" className="card-action-items" />}
                type="link"
                style={{
                  marginLeft: '10px',
                }}
                href={newsItem.news.url}
                target="_blank"
              />
            </div>
          </div>
          <Text type="secondary" className="small-text">
            {formatDate(newsItem.news.published_on * 1000)}
          </Text>
        </div>
      </div>
    );
  };

  render() {
    const { newsItem } = this.props;

    return (
      <Collapse bordered={false} ghost>
        <Panel
          className={`news-card ${newsItem.news.description.length > 0 ? 'news-card--active' : 'news-card--disabled'}`}
          showArrow={false}
          header={this.renderNewsHeader()}
        >
          <Text
            style={{
              fontSize: '12px',
              marginLeft: '70px',
              display: 'table',
              color: '#29275F',
            }}
          >
            {newsItem.news.description}
          </Text>
        </Panel>
      </Collapse>
    );
  }
}

NewsCard.contextType = NewsContext;

NewsCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  newsItem: PropTypes.object.isRequired,
  // shareNewsOnEmail: PropTypes.func.isRequired,
};

export default NewsCard;
