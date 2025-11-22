import { gql } from "@apollo/client";

export const FETCH_USER_LOGGED_IN = gql`
  query {
    fetchUserLoggedIn {
      _id
      email
      name
    }
  }
`;
// 유저 포인트랑 사진은 추후 업데이트 해야하는 부분
