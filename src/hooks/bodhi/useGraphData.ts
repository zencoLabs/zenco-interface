import { bodhi_ApolloClient } from "@/src/apollo/client";
import { SpaceFactoryUser, UserInfo } from "@/src/libs/model";
import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";

export const GETLATESTCREATE = gql`
  query GetLatestCreate {
    creates(
      first: 1
      orderBy: assetId
      orderDirection: desc
      where: { arTxId_not: "", isContract: false }
    ) {
      id
      assetId
      arTxId
      sender
      blockTimestamp
      transactionHash
    }
  }
`
export const GET_CREATES = gql`
  query GetCreates($first: Int!, $skip: Int!) {
  creates(
      skip: $skip
      first: $first
      where: { arTxId_not: "", isContract: false }
      orderDirection: desc
      orderBy: blockTimestamp
    ) {
     id
     assetId
     arTxId
     sender
     blockTimestamp
     transactionHash
    }
  }
`;


export const GET_ASSETS = gql`
  query GetAssets($assetIds: [Int!]) {
    assets(where: { assetId_in: $assetIds }) {
      assetId
      isDelete
      totalFees
      totalHolders
      totalSupply
      totalTradValue
      totalTradVolume
      totalTrades
      creator {
        address
      }
    }
  }
`;

//asset holder
export const GET_USERASSETS = gql`
  query GetUserAssets($assetId: Int!,$pageCount:Int!) {
     userAssets(
      where: {assetId: $assetId, user_: {isContract: false}}
      orderBy: amount
      orderDirection: desc
      first: $pageCount
    ) {
      user {
        address 
      }
    }
  }
`;


export const GET_USERSPACES = gql`
  query GetSpaces($useArray: [String!]) { 
    spaceFactories(where: {id_in: $useArray}) {
      user
      spaceId
      spaceName
      descriptionAssetId
      avatarArTxId
      spaceAddress
    }
  }
`;

export const GET_ASSETREPLYS = gql`
  query GetAssetReply($parentAssetIds: [Int!]) { 
    spaceCounts(where: {parentId_in: $parentAssetIds}) {
      parentId
      count
    }
  }
`;
  
export const GET_SPACEREPLYS = gql`
  query GetSpaces ($assetId: Int!){
    spaces(orderBy: blockNumber, orderDirection: desc, where: { parentId: $assetId }) {
      id
      sender
      parentId
      assetId
      arTxId
      isDelete
      blockTimestamp
      transactionHash
      spaceFactory {
        user
        spaceName
        avatarArTxId
        descriptionAssetId
        spaceId
        spaceAddress
      }
    }
  }
`;

export const GET_USERINFO = gql`
  query GetUsers ($address: String!){
    users(where: {address: $address}) {
      id
      address
      isContract
      totalAssets
      totalFees
      totalHolders
      totalTradValue
      totalTradVolume
      totalTrades
    }
  }
`;

export const GET_SPACEFATORYUSERINFO = gql`
  query GetSpaceFactoryUser($address: String!) { 
    spaceFactories(where: {user: $address}) {
        id
        user
        spaceId
        spaceName
        descriptionAssetId
        avatarArTxId
        spaceAddress
        spaceAsset {
          totalFees
          totalHolders
          totalSupply
          totalTradValue
          totalTradVolume
          totalTrades
          isDelete
        }
       spaceUser { 
          totalFees
          totalHolders
          totalAssets
          totalTradValue
          totalTradVolume
          totalTrades 
        }
    }
  }
`;


export const GET_SPACEFATORYUSER = gql`
  query GetSpaceFactoryUsers($first: Int!, $skip: Int!) { 
    spaceFactories(
    first: $first
    skip: $skip
    orderBy: spaceUser__totalTradValue
    orderDirection: desc
    ) {
        id
        user
        spaceId
        spaceName
        descriptionAssetId
        avatarArTxId
        spaceAddress
        spaceAsset {
          totalFees
          totalHolders
          totalSupply
          totalTradValue
          totalTradVolume
          totalTrades
          isDelete
        }
        spaceUser { 
          totalFees
          totalHolders
          totalAssets
          totalTradValue
          totalTradVolume
          totalTrades 
        }
    }
  }
`;

export const useGetLatestCreate = () => {
  const { loading, error, data, refetch } = useQuery(GETLATESTCREATE, {
    client: bodhi_ApolloClient
  });
  return { loading, error, data, refetch };
};

export const useGetAssets = (assetIdArray: number[]) => {
  const { loading, error, data, refetch } = useQuery(GET_ASSETS, {
    variables: { assetIds: assetIdArray },
    client: bodhi_ApolloClient
  });
  return { loading, error, data, refetch };
};


export const useGetUserSpaces = (useArray: string[]) => {
  const { loading, error, data, refetch } = useQuery(GET_USERSPACES, {
    variables: { useArray: useArray },
    client: bodhi_ApolloClient,
    fetchPolicy: 'cache-first', // Use cache first
  });
  return { loading, error, data, refetch };
};

export const useGetAssetReplyCounts = (parentAssetIds: number[]) => {
  const { loading, error, data, refetch } = useQuery(GET_ASSETREPLYS, {
    variables: { parentAssetIds: parentAssetIds },
    client: bodhi_ApolloClient
  });
  return { loading, error, data, refetch };
};
 

export const useGetAssetReplys = (assetId: number) => {
  const { loading, error, data, refetch } = useQuery(GET_SPACEREPLYS, {
    variables: { assetId: assetId },
    client: bodhi_ApolloClient
  });
  return { loading, error, data, refetch };
};

export const useGetUserInfo = (address: string) => {
  const { loading, error, data, refetch } = useQuery(GET_USERINFO, {
    variables: { address: address },
    client: bodhi_ApolloClient
  });

  const userInfo: UserInfo | undefined = useMemo(() => {
    if (!error && data) {
      return data.users[0];
    } else {
      return undefined;
    }
  }, [data, error]);

  return {
    userInfo,
    loading,
    error,
    refetch,
  };
};


export const useGetSpaceFactoryUserInfo = (address: string) => {
  const { loading, error, data, refetch } = useQuery(GET_SPACEFATORYUSERINFO, {
    variables: { address: address },
    client: bodhi_ApolloClient,
  });

  const sapceUser: SpaceFactoryUser | undefined = useMemo(() => {
    if (!error && data) {
      return data.spaceFactories[0];
    } else {
      return undefined;
    }
  }, [data, error]);
  return {
    sapceUser,
    loading,
    error,
    refetch,
  };
}

export const useGetSpaceFactoryUsers = (currentPage: number, itemsPerPage: number) => {
  const { loading, error, data, refetch } = useQuery(GET_SPACEFATORYUSER, {
    variables: { first: itemsPerPage, skip: currentPage * itemsPerPage },
    client: bodhi_ApolloClient,
  });

  const userArray: SpaceFactoryUser[] | undefined = useMemo(() => {
    if (!error && data) {
      return data.spaceFactories;
    } else {
      return undefined;
    }
  }, [data, error]);
  return {
    userArray,
    loading,
    error,
    refetch,
  };
}


export const useGetAssetHolders = (assetId: number, pageCount: number) => {
  const { loading, error, data, refetch } = useQuery(GET_USERASSETS, {
    variables: { assetId:assetId, pageCount:pageCount },
    client: bodhi_ApolloClient,
  });

  const userArray: string[] | undefined = useMemo(() => {
    if (!error && data) {
      return data.userAssets.map((userAsset: { user: { address: string } }) => userAsset.user.address);
    } else {
      return undefined;
    }
  }, [data, error]);

  return {
    userArray,
    loading,
    error,
    refetch,
  };
}
