// 상품 or 체험 글쓰는 곳
import { gql } from "@apollo/client";

export const CREATE_TRAVEL_PRODUCT = gql`
  mutation createTravelproduct(
    $createTravelproductInput: CreateTravelproductInput!
  ) {
    createTravelproduct(createTravelproductInput: $createTravelproductInput) {
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
