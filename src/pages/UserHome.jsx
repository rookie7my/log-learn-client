import { useParams } from "react-router-dom";
import { css } from "@emotion/react";

import PostList from "../components/post/PostList";
import useUserQuery from "../hooks/queries/users/useUserQuery";
import NotFound from "./NotFound";
import UserProfileCard from "../components/user/UserProfileCard";

const UserHome = () => {
  const { username } = useParams();

  const { data: userData, error, isLoading, isError } = useUserQuery(username);

  if(isLoading) {
    return <div>loading...</div>
  }

  if(isError) {
    if(error.response?.status === 404) {
      return <NotFound />;
    }
  }

  return (
    <main css={theme => css`
      margin: 0 auto;
      max-width: ${theme.bp.md};
    `}>
      <UserProfileCard userData={userData} />
      <PostList authorName={userData.username} />
    </main>
  );
};

export default UserHome;
