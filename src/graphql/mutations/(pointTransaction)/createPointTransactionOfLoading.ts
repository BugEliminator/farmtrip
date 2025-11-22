import { gql } from "@apollo/client";

export const CREATE_POINT_TRANSACTION_OF_LOADING = gql`
  mutation createPointTransactionOfLoading($paymentId: ID!) {
    createPointTransactionOfLoading(paymentId: $paymentId) {
      _id
      impUid
      amount
      balance
      status
      statusDetail
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
          email
          name
          picture
          userPoint {
            _id
            amount
          }
          createdAt
          updatedAt
          deletedAt
        }
        seller {
          _id
          email
          name
          picture
          userPoint {
            _id
            amount
          }
          createdAt
          updatedAt
          deletedAt
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
        userPoint {
          _id
          amount
        }
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
