import { gql } from "@apollo/client";

export const UPDATE_TRAVELPRODUCT_QUESTION_ANSWER = gql`
  mutation updateTravelproductQuestionAnswer(
    $updateTravelproductQuestionAnswerInput: UpdateTravelproductQuestionAnswerInput!
    $travelproductQuestionAnswerId: ID!
  ) {
    updateTravelproductQuestionAnswer(
      updateTravelproductQuestionAnswerInput: $updateTravelproductQuestionAnswerInput
      travelproductQuestionAnswerId: $travelproductQuestionAnswerId
    ) {
      _id
      contents
      travelproductQuestion {
        _id
        contents
        travelproduct {
          _id
          name
          remarks
          contents
          price
          tags
          images
          pickedCount
          travelproductAddress {
            _id
            zipcode
            address
            addressDetail
            lat
            lng
            createdAt
            updatedAt
            deletedAt
          }
          buyer {
            _id
            name
            picture
          }
          seller {
            _id
            name
            picture
          }
          soldAt
          createdAt
          updatedAt
          deletedAt
        }
        user {
          _id
          email
          name
          picture
          createdAt
          updatedAt
          deletedAt
        }
        createdAt
        updatedAt
        deletedAt
      }
      user {
        _id
        email
        name
        picture
        createdAt
        updatedAt
        deletedAt
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
