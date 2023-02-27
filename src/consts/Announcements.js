/* eslint import/no-anonymous-default-export: 0 */

export const AnnouncementsList = [
  {
    link: "https://lightecho.io/",
    imgSm: require("/public/img/ads/lightEcho-small.png"), // For Mobile Screen
    imgMd: require("/public/img/ads/lightEcho-medium.png"), // For Ipad Screen
    imgLg: require("/public/img/ads/lightEcho-large.png"), // For Large Screen
    openLinkInPopUp: true, // Boolean to open link in popup or not
  },
  {
    link: "https://www2.kbtrading.org/btcln",
    imgSm: require("/public/img/ads/BTCLN Banner 468PX-60PX Small.png"),
    imgMd: require("/public/img/ads/BTCLN Banner 728PX-90PX Medium.png"),
    imgLg: require("/public/img/ads/BTCLN Banner 970PX-90PX Large.png"),
    openLinkInPopUp: true,
  },
];

export default {
  AnnouncementsList,
};
