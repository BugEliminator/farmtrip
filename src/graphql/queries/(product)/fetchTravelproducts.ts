// 상품 리스트 조회

import { gql } from "@apollo/client";

export const FETCH_TRAVEL_PRODUCTS = gql`
  query fetchTravelproducts($isSoldout: Boolean, $search: String, $page: Int) {
    fetchTravelproducts(isSoldout: $isSoldout, search: $search, page: $page) {
      _id
      name
      images
      price
      tags
    }
  }
`;
