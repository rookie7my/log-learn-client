import { memo } from "react";
import PropTypes from "prop-types";

import LinkMenuTab from "../common/LinkMenuTab";
import pageUrl from "../../utils/pageUrl";

const UserHomeMenuTab = ({ username }) => {
  const menuList = [
    { name: "포스트", link: pageUrl.getUserHomePageUrl(username) },
    { name: "소개", link: pageUrl.getUserIntroductionPageUrl(username) }
  ];

  return <LinkMenuTab menuList={menuList} />;
};

UserHomeMenuTab.propTypes = {
  username: PropTypes.string.isRequired
};

export default memo(UserHomeMenuTab);
