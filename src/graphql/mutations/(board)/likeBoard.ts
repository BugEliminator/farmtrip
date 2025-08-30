import { gql } from "@apollo/client";

// 게시판 좋아요
export const LIKE_BOARD = gql`
  mutation likeBoard($boardId: ID!) {
    likeBoard(boardId: $boardId)
  }
`;
