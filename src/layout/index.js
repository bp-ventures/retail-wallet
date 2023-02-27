import { AnnouncementFrame } from "../components";
import Toaster from "../components/toaster";
import Header from "./header";
import { SiteConfigs } from "../consts";

const Layout = ({ children, setIsConnectModalVisible, hideAnnouncement }) => {
  const { showBanners } = SiteConfigs;

  return (
    <>
      <Header setIsConnectModalVisible={setIsConnectModalVisible} />
      <Toaster />
      {showBanners && <AnnouncementFrame hideAnnouncement={hideAnnouncement} />}
      {children}
    </>
  );
};

export default Layout;
