import { gql } from "@apollo/client";

export const UPDATE_TRAVELPRODUCT_QUESTION = gql`
  mutation updateTravelproductQuestion(
    $updateTravelproductQuestionInput: UpdateTravelproductQuestionInput!
    $travelproductQuestionId: ID!
  ) {
    updateTravelproductQuestion(
      updateTravelproductQuestionInput: $updateTravelproductQuestionInput
      travelproductQuestionId: $travelproductQuestionId
    ) {
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
  }
`;
