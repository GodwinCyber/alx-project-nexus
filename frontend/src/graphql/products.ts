import { gql } from '@apollo/client';

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int, $after: String) {
    allProducts(first: $first, after: $after) {
      edges {
        node {
          id
          name
          description
          price
          amountInStock
          createdAt
          updatedAt
          category {
            id
            name
          }
          subCategory {
            id
            name
          }
          images {
            edges {
              node {
                id
                image
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: Int!) {
    productById(id: $id) {
      id
      name
      description
      price
      amountInStock
      createdAt
      updatedAt
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
      images {
        edges {
          node {
            id
            image
          }
        }
      }
      rating {
        edges {
          node {
            id
            rating
            comment
            createdAt
            ratingFrom {
              id
              username
            }
          }
        }
      }
      comments {
        edges {
          node {
            id
            body
            createdAt
            commentFrom {
              id
              username
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    allCategories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const GET_SUB_CATEGORIES = gql`
  query GetSubCategories($categoryId: Int) {
    allSubCategories(category: $categoryId) {
      edges {
        node {
          id
          name
          category {
            id
            name
          }
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      id
      name
      description
      price
      amountInStock
      createdAt
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
      images {
        edges {
          node {
            id
            image
          }
        }
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      category {
        id
        name
      }
      ok
    }
  }
`;

export const CREATE_SUB_CATEGORY = gql`
  mutation CreateSubCategory($input: SubcategoryInput!) {
    createSubCategory(input: $input) {
      subCategory {
        id
        name
        category {
          id
          name
        }
      }
      ok
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      category {
        id
        name
      }
      ok
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id) {
      ok
    }
  }
`;

export const UPDATE_SUB_CATEGORY = gql`
  mutation UpdateSubCategory($id: Int!, $input: SubcategoryInput!) {
    updateSubCategory(id: $id, input: $input) {
      subCategory {
        id
        name
        category {
          id
          name
        }
      }
      ok
    }
  }
`;

export const DELETE_SUB_CATEGORY = gql`
  mutation DeleteSubCategory($id: Int!) {
    deleteSubCategory(id: $id) {
      ok
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      product {
        id
        name
        description
        price
        amountInStock
        category {
          id
          name
        }
        subCategory {
          id
          name
        }
      }
      ok
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      product {
        id
        name
        description
        price
        amountInStock
        category {
          id
          name
        }
        subCategory {
          id
          name
        }
      }
      ok
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id) {
      ok
    }
  }
`;

export const CREATE_RATING = gql`
  mutation CreateRating($input: RatingInput!) {
    createRating(input: $input) {
      rating {
        id
        rating
        comment
        createdAt
        ratingFrom {
          id
          username
        }
      }
      ok
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      comment {
        id
        body
        createdAt
        commentFrom {
          id
          username
        }
      }
      ok
    }
  }
`;

