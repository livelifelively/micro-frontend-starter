/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Icon from '@ant-design/icons';
import PropTypes from 'prop-types';

import SLogo from '../assets/svg/logo.svg';
import Dashboard from '../assets/svg/Group 5157.svg';
import Technology from '../assets/svg/Group 5135.svg';
import Keyword from '../assets/svg/Group 5231.svg';
import Company from '../assets/svg/Group 5136.svg';
import Lead from '../assets/svg/Group 5137.svg';
import Enrichment from '../assets/svg/Group 5138.svg';
import JobPosting from '../assets/svg/Group 5139.svg';
import BranchInsight from '../assets/svg/Group 5140.svg';
import Search from '../assets/svg/Group 5167.svg';
import SourceLink from '../assets/svg/Group 5207.svg';
import ShareLink from '../assets/svg/Group 5184.svg';
import Info from '../assets/svg/Group 5179.svg';
import Ellipsis from '../assets/svg/Group 5175.svg';
import OkSign from '../assets/svg/oksign.svg';
import Person from '../assets/svg/Group 5246.svg';
import NoItems from '../assets/svg/Group 5300.svg';
import RightArrow from '../assets/svg/Path 805.svg';
import EventsTheme from '../assets/svg/Group 5315.svg';
import GrowthTheme from '../assets/svg/Group 5348.svg';
import AcquisitionTheme from '../assets/svg/Group 5318.svg';
import TechnologiesTheme from '../assets/svg/Group 5320.svg';
import ExpansionTheme from '../assets/svg/Group 5322.svg';
import LeadershipChangesTheme from '../assets/svg/Group 5324.svg';
import FundingTheme from '../assets/svg/Group 5326.svg';
import IPOTheme from '../assets/svg/Group 5328.svg';
import PartnershipsTheme from '../assets/svg/Group 5330.svg';
import ProductLaunchesTheme from '../assets/svg/Group 5332.svg';

export const LogoIcon = (props) => <Icon component={() => <SLogo {...props} />} />;
export const DashboardIcon = (props) => <Icon component={() => <Dashboard {...props} />} />;
export const TechnologyIcon = (props) => <Icon component={() => <Technology {...props} />} />;
export const KeywordIcon = (props) => <Icon component={() => <Keyword {...props} />} />;
export const CompanyIcon = (props) => <Icon component={() => <Company {...props} />} />;
export const LeadIcon = (props) => <Icon component={() => <Lead {...props} />} />;
export const EnrichmentIcon = (props) => <Icon component={() => <Enrichment {...props} />} />;
export const EllipsisIcon = (props) => <Icon component={() => <Ellipsis {...props} />} />;
export const OkSignIcon = (props) => <Icon component={() => <OkSign {...props} />} />;
export const JobPostingIcon = (props) => <Icon component={() => <JobPosting {...props} />} />;
export const BranchInsightIcon = (props) => <Icon component={() => <BranchInsight {...props} />} />;
export const SearchIcon = (props) => <Icon component={() => <Search {...props} />} />;
export const SourceLinkIcon = (props) => <Icon component={() => <SourceLink {...props} />} />;
export const ShareLinkIcon = (props) => <Icon component={() => <ShareLink {...props} />} />;
export const InfoIcon = (props) => <Icon component={() => <Info {...props} />} />;
export const NoItemsIcon = (props) => <Icon component={() => <NoItems {...props} />} />;
export const RightArrowIcon = (props) => <Icon component={() => <RightArrow {...props} />} />;
export const PersonIcon = (props) => <Icon component={() => <Person {...props} />} />;
export const EventsThemeIcon = (props) => <Icon component={() => <EventsTheme {...props} />} />;
export const GrowthThemeIcon = (props) => <Icon component={() => <GrowthTheme {...props} />} />;
export const FundingThemeIcon = (props) => <Icon component={() => <FundingTheme {...props} />} />;
export const IpoThemeIcon = (props) => <Icon component={() => <IPOTheme {...props} />} />;
export const ExpansionThemeIcon = (props) => <Icon component={() => <ExpansionTheme {...props} />} />;
export const TechnologiesThemeIcon = (props) => <Icon component={() => <TechnologiesTheme {...props} />} />;
export const AcquisitionThemeIcon = (props) => <Icon component={() => <AcquisitionTheme {...props} />} />;
export const LeadershipChangesThemeIcon = (props) => <Icon component={() => <LeadershipChangesTheme {...props} />} />;
export const PartnershipsThemeIcon = (props) => <Icon component={() => <PartnershipsTheme {...props} />} />;
export const ProductLaunchesThemeIcon = (props) => <Icon component={() => <ProductLaunchesTheme {...props} />} />;

export const ThemeIcon = ({ theme, ...props }) => {
  switch (theme) {
    case 'funding':
      return <Icon component={() => <FundingTheme {...props} />} />;
    case 'acquisition':
      return <Icon component={() => <AcquisitionTheme {...props} />} />;
    case 'events':
      return <Icon component={() => <EventsTheme {...props} />} />;
    case 'partnerships':
      return <Icon component={() => <PartnershipsTheme {...props} />} />;
    case 'technologies':
      return <Icon component={() => <TechnologiesTheme {...props} />} />;
    case 'expansion':
      return <Icon component={() => <ExpansionTheme {...props} />} />;
    case 'growth':
      return <Icon component={() => <GrowthTheme {...props} />} />;
    case 'leadership_changes':
      return <Icon component={() => <LeadershipChangesTheme {...props} />} />;
    case 'product_launches':
      return <Icon component={() => <ProductLaunchesTheme {...props} />} />;
    case 'executive_movements':
      return <Icon component={() => <LeadershipChangesTheme {...props} />} />;
    case 'ipos':
      return <Icon component={() => <IPOTheme {...props} />} />;
    default:
      return <Icon component={() => <TechnologiesTheme {...props} />} />;
  }
};

ThemeIcon.propTypes = {
  theme: PropTypes.string.isRequired,
};
