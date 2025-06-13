import { gql } from "@apollo/client";

export const FETCH_TRAVEL_PRODUCT = gql`
  query fetchTravelproduct($travelproductId: ID!) {
    fetchTravelproduct(travelproductId: $travelproductId) {
      _id
      name
      remarks
      contents
      price
      tags
      images
      pickedCount
      travelproductAddress {
        address
        addressDetail
      }
      seller {
        _id
        name
        email
        picture
      }
      buyer {
        _id
        name
      }
      soldAt
      createdAt
    }
  }
`;
