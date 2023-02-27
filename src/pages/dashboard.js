import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { filter, get, map, round, sum, toNumber } from "lodash";
import { Col, Container, Row, Tab } from "react-bootstrap";
import { PieChart } from "react-minimal-pie-chart";
import { TabHeader } from "../components";
import {
  DashboardLendingCards,
  DashboardTradingCards,
  StatsCard,
} from "../components/cards";
import { AddAssetModal, LockModal, SwapModal } from "../components/modals";
import {
  DashboardLendingTable,
  DashboardTradingTable,
} from "../components/tables";
import { T } from "../components/translation";
import { SiteConfigs } from "../consts";
import AssetsList from "../consts/AssetsList.json";
import useDashboardBusinessLogic from "../hooks/useDashboardBusinessLogic";

const Dashboard = ({ setIsConnectModalVisible }) => {
  const {
    isLoggedIn,
    totalHealthFactor,
    totalValueInUSDC,
    totalClaimableBalanceInUSDC,
    lendingTableData,
    tradingTableData,
    selectedRow,
    isLockModalVisible,
    isSwapModalVisible,
    tabKey,
    isAddAssetModalVisible,
    setIsAddAssetModalVisible,
    setTabKey,
    getValueInUSDC,
    getClaimableBalanceInUSDC,
    setSelectedRow,
    setIsLockModalVisible,
    setIsSwapModalVisible,
  } = useDashboardBusinessLogic({});
  return (
    <Container className="px-md-5">
      <main className="py-3">
        <Row>
          <Col
            xs="12"
            md="7"
            lg="8"
            className="d-flex flex-column justify-content-center"
          >
            <Row>
              <Col xs="6">
                <StatsCard
                  className={classnames("bg-health")}
                  label={<T>homePage.diversification_factor</T>}
                  value={isLoggedIn ? round(totalHealthFactor, 2) : "-"}
                />
              </Col>
              <Col xs="6">
                <StatsCard
                  className={classnames("bg-value")}
                  label={<T>homePage.total_value_in_USDC</T>}
                  value={
                    isLoggedIn
                      ? `$${round(
                          totalValueInUSDC + totalClaimableBalanceInUSDC,
                          2
                        )}`
                      : "-"
                  }
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs="6">
                <StatsCard
                  className={classnames("bg-lent")}
                  label={<T>homePage.total_locked_in_USDC</T>}
                  value={
                    isLoggedIn
                      ? `$${round(totalClaimableBalanceInUSDC, 2)}`
                      : "-"
                  }
                />
              </Col>
              <Col xs="6">
                <StatsCard
                  className={classnames("bg-TBD")}
                  label={<T>homePage.total_value_in_USDC_of_unlocked_amount</T>}
                  value={isLoggedIn ? `$${round(totalValueInUSDC, 2)}` : "-"}
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs="10"
            md="5"
            lg="4"
            className="mt-4 mt-md-0 d-flex align-items-center"
          >
            <PieChart
              viewBoxSize={[120, 100]}
              data={
                isLoggedIn
                  ? filter(
                      map(AssetsList, (asset) => ({
                        title: asset.code,
                        value:
                          toNumber(getValueInUSDC(asset.code)) +
                          toNumber(getClaimableBalanceInUSDC(asset.code)),
                        color: asset.color,
                      })),
                      "value"
                    )
                  : [{ title: "", value: 100, color: "gray" }]
              }
            />
            <div>
              {map(AssetsList, (asset, key) => {
                const dividedValue =
                  sum([
                    toNumber(getValueInUSDC(asset.code)),
                    toNumber(getClaimableBalanceInUSDC(asset.code)),
                  ]) / sum([totalClaimableBalanceInUSDC, totalValueInUSDC]);
                const percentage = round(dividedValue * 100, 2);
                return (
                  <div
                    key={key}
                    className={classnames("d-flex align-items-center mb-2", {
                      "d-none": !percentage,
                    })}
                  >
                    <FontAwesomeIcon
                      className=" me-2 icon-sm "
                      color={asset.color}
                      icon={faCircle}
                    />
                    <p className="mb-0">{asset.code}</p>
                    <p className="mb-0 ms-2">{isLoggedIn ? percentage : 0}%</p>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>

        <Row className="px-3 mt-2">
          <Tab.Container
            defaultActiveKey="trade"
            id="uncontrolled-tab-example"
            className="mb-1"
            onSelect={(key) => setTabKey(key)}
          >
            <TabHeader
              activeTab={tabKey}
              tabs={[
                { eventKey: "trade", text: "Trading" },
                { eventKey: "staking", text: "Staking" },
              ]}
              setIsAddAssetModalVisible={setIsAddAssetModalVisible}
            />
            <Tab.Content>
              <Tab.Pane eventKey="trade">
                {/* For large Screens */}
                <div className="d-none d-md-block">
                  <DashboardTradingTable
                    data={tradingTableData}
                    setIsLockModalVisible={setIsLockModalVisible}
                    setIsConnectModalVisible={setIsConnectModalVisible}
                    setIsSwapModalVisible={setIsSwapModalVisible}
                    setSelectedRow={setSelectedRow}
                  />
                </div>
                {/* For smaller Screens */}
                <div className="d-md-none">
                  <DashboardTradingCards
                    data={tradingTableData}
                    setSelectedRow={setSelectedRow}
                    setIsLockModalVisible={setIsLockModalVisible}
                    setIsConnectModalVisible={setIsConnectModalVisible}
                    setIsSwapModalVisible={setIsSwapModalVisible}
                  />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="staking">
                {/* For large Screens */}
                <div className="d-none d-md-block">
                  <DashboardLendingTable
                    data={lendingTableData}
                    setIsLockModalVisible={setIsLockModalVisible}
                    setIsConnectModalVisible={setIsConnectModalVisible}
                    setIsSwapModalVisible={setIsSwapModalVisible}
                    setSelectedRow={setSelectedRow}
                  />
                </div>
                {/* For smaller Screens */}
                <div className="d-md-none">
                  <DashboardLendingCards
                    data={lendingTableData}
                    setSelectedRow={setSelectedRow}
                    setIsLockModalVisible={setIsLockModalVisible}
                    setIsConnectModalVisible={setIsConnectModalVisible}
                    setIsSwapModalVisible={setIsSwapModalVisible}
                  />
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Row>

        <LockModal
          data={selectedRow}
          isLockModalVisible={isLockModalVisible}
          toggleModal={() => setIsLockModalVisible(!isLockModalVisible)}
        />
        <SwapModal
          data={selectedRow}
          isSwapModalVisible={isSwapModalVisible}
          toggleModal={() => setIsSwapModalVisible(!isSwapModalVisible)}
        />
        <AddAssetModal
          isModalVisible={isAddAssetModalVisible}
          displayBalance={false}
          onHide={() => setIsAddAssetModalVisible(!isAddAssetModalVisible)}
        />
      </main>
    </Container>
  );
};

export const getServerSideProps = ({}) => {
  return {
    props: {
      title: `${get(SiteConfigs, "siteName")} - Dashboard`,
    },
  };
};

export default Dashboard;
