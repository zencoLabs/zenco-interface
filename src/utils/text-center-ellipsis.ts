import makeBlockie from "ethereum-blockies-base64";
import { APIURL } from "../libs/chains"; 
import { SpaceUserInfo2 } from "../libs/model"; 

export const textCenterEllipsis = (str: string, from: number, to: number) => {
  if (!!str && str !== '')
    return `${str.substr(0, from)}...${str.substr(str.length - to, str.length)}`;
  else
    return "";
};

export const getUserAvatar = (account?: string, spaceUserInfo?: SpaceUserInfo2) => {
  const avatar = spaceUserInfo && spaceUserInfo.avatarArTxId ? `${APIURL.ar_url}${spaceUserInfo?.avatarArTxId}` : account ? makeBlockie(account) : '/icons/img/user.jpg'
  const spacename = spaceUserInfo && spaceUserInfo.spaceName ? spaceUserInfo.spaceName : textCenterEllipsis(account!, 4, 4)
  return {
    avatar,
    spacename
  }
}
 
export const formatTimestamp = (timestamp: number) => {
  const currentTimestamp = Date.now() / 1000;
  const diff = currentTimestamp - timestamp;

  if (diff < 0) {
    // Time in the future
    const futureDiff = Math.abs(diff);
    if (futureDiff < 60) {
      return `${Math.floor(futureDiff)}s from now`;
    } else if (futureDiff < 3600) {
      return `${Math.floor(futureDiff / 60)}m from now`;
    } else if (futureDiff < 86400) {
      return `${Math.floor(futureDiff / 3600)}h from now`;
    } else {
      const date = new Date(timestamp * 1000);
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      return `on ${formatter.format(date)}`;
    }
  } else if (diff < 60) {
    return `${Math.floor(diff)}s ago`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  } else {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  }
}