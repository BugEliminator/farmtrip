import { gql } from "@apollo/client";

export const DELETE_TRAVELPRODUCT_QUESTION_ANSWER = gql`
  mutation deleteTravelproductQuestionAnswer(
    $travelproductQuestionAnswerId: ID!
  ) {
    deleteTravelproductQuestionAnswer(
      travelproductQuestionAnswerId: $travelproductQuestionAnswerId
    )
  }
`;
