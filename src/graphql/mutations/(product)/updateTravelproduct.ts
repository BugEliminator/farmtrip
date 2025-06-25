// 상품 or 체험 수정하는 곳
import { gql } from "@apollo/client";

export const UPDATE_TRAVEL_PRODUCT = gql`
  mutation updateTravelproduct(
    $updateTravelproductInput: UpdateTravelproductInput!
    $travelproductId: ID!
  ) {
    updateTravelproduct(
      updateTravelproductInput: $updateTravelproductInput
      travelproductId: $travelproductId
    ) {
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
      }
      createdAt
      soldAt
    }
  }
`;
