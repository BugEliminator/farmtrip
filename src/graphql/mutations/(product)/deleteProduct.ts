import { gql } from "@apollo/client";

export const DELETE_TRAVEL_PRODUCT = gql`
  mutation deleteTravelproduct($travelproductId: ID!) {
    deleteTravelproduct(travelproductId: $travelproductId)
  }
`;
