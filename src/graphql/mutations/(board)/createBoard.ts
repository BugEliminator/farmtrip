import { gql } from "@apollo/client";

// 게시글 작성
export const CREATE_BOARD = gql`
  mutation createBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
      writer
      title
      contents
      youtubeUrl
      images
      likeCount
      dislikeCount
      boardAddress {
        zipcode
        address
        addressDetail
      }
      createdAt
      updatedAt
    }
  }
`;
