import { gql } from "@apollo/client";

export const DELETE_TRAVELPRODUCT_QUESTION = gql`
  mutation deleteTravelproductQuestion($travelproductQuestionId: ID!) {
    deleteTravelproductQuestion(
      travelproductQuestionId: $travelproductQuestionId
    )
  }
`;
