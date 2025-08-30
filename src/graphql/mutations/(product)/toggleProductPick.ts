import { gql } from "@apollo/client";

export const TOGGLE_TRAVELPRODUCT_PICK = gql`
  mutation toggleTravelproductPick($travelproductId: ID!) {
    toggleTravelproductPick(travelproductId: $travelproductId)
  }
`;
