import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  GlobalOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Drawer, Grid, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faXmark,
  faPeopleRoof,
  faUserGraduate,
  faChalkboardUser,
  faPowerOff,
  faRoad,
  faMapLocationDot,
  faLocationDot,
  faMessage,
  faCalendarDays,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

//
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

//
type CustomItemType = {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
};
const CustomItemValue = {
  // history: {
  //   key: "1",
  //   value: "history",
  //   link: "/admin/histories",
  //   icon: <FontAwesomeIcon icon={faClipboardList} />,
  // },
  map: {
    key: "1",
    value: "map",
    link: "/admin/map",
    icon: <FontAwesomeIcon icon={faMapLocationDot} />,
  },
  inform: {
    key: "2",
    value: "inform",
    link: "/admin/informs",
    icon: <FontAwesomeIcon icon={faMessage} />,
  },
  schedule: {
    key: "3",
    value: "schedule",
    link: "/admin/schedules",
    icon: <FontAwesomeIcon icon={faCalendarDays} />,
  },
  route: {
    key: "4",
    value: "route",
    link: "/admin/routes",
    icon: <FontAwesomeIcon icon={faRoad} />,
  },
  pickup: {
    key: "5",
    value: "pickup",
    link: "/admin/pickups",
    icon: <FontAwesomeIcon icon={faLocationDot} />,
  },
  bus: {
    key: "6",
    value: "bus",
    link: "/admin/buses",
    icon: <FontAwesomeIcon icon={faBus} />,
  },
  driver: {
    key: "7",
    value: "driver",
    link: "/admin/drivers",
    icon: <FontAwesomeIcon icon={faChalkboardUser} />,
  },
  parent: {
    key: "8",
    value: "parent",
    link: "/admin/parents",
    icon: <FontAwesomeIcon icon={faPeopleRoof} />,
  },
  student: {
    key: "9",
    value: "student",
    link: "/admin/students",
    icon: <FontAwesomeIcon icon={faUserGraduate} />,
  },
};

const AdminLayout: React.FC = () => {
  // Location
  const location = useLocation();

  // Language
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(
    localStorage.getItem("lang") || "vi"
  );
  const changeLanguage = (key: string) => {
    setLang(key);
  };
  const languageMenu = (
    <Menu
      onClick={({ key }) => changeLanguage(key)}
      items={[
        {
          key: "vi",
          label: (
            <p>
              <span className="language">🇻🇳</span>&nbsp;Tiếng Việt
            </p>
          ),
        },
        {
          key: "en",
          label: (
            <p>
              <span className="language">🇬🇧</span>&nbsp;English
            </p>
          ),
        },
      ]}
    />
  );
  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }, [lang, i18n]);

  // Các states
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();

  // Menu items
  const menuItems: MenuProps["items"] = [
    // {
    //   key: CustomItemValue.history.key,
    //   icon: CustomItemValue.history.icon,
    //   label: (
    //     <Link to={CustomItemValue.history.link}>
    //       {t(CustomItemValue.history.value)}
    //     </Link>
    //   ),
    // },
    {
      key: CustomItemValue.map.key,
      icon: CustomItemValue.map.icon,
      label: (
        <Link to={CustomItemValue.map.link}>
          {t(CustomItemValue.map.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.inform.key,
      icon: CustomItemValue.inform.icon,
      label: (
        <Link to={CustomItemValue.inform.link}>
          {t(CustomItemValue.inform.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.schedule.key,
      icon: CustomItemValue.schedule.icon,
      label: (
        <Link to={CustomItemValue.schedule.link}>
          {t(CustomItemValue.schedule.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.route.key,
      icon: CustomItemValue.route.icon,
      label: (
        <Link to={CustomItemValue.route.link}>
          {t(CustomItemValue.route.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.pickup.key,
      icon: CustomItemValue.pickup.icon,
      label: (
        <Link to={CustomItemValue.pickup.link}>
          {t(CustomItemValue.pickup.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.bus.key,
      icon: CustomItemValue.bus.icon,
      label: (
        <Link to={CustomItemValue.bus.link}>
          {t(CustomItemValue.bus.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.driver.key,
      icon: CustomItemValue.driver.icon,
      label: (
        <Link to={CustomItemValue.driver.link}>
          {t(CustomItemValue.driver.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.parent.key,
      icon: CustomItemValue.parent.icon,
      label: (
        <Link to={CustomItemValue.parent.link}>
          {t(CustomItemValue.parent.value)}
        </Link>
      ),
    },
    {
      key: CustomItemValue.student.key,
      icon: CustomItemValue.student.icon,
      label: (
        <Link to={CustomItemValue.student.link}>
          {t(CustomItemValue.student.value)}
        </Link>
      ),
    },
  ];
  const [selectedItem, setSelectedItem] = useState<CustomItemType>(
    menuItems[0] as CustomItemType
  );
  useEffect(() => {
    const pathname = location.pathname;
    // if (pathname === "/admin/histories") {
    //   setSelectedItem(
    //     menuItems[Number(CustomItemValue.history.key) - 1] as CustomItemType
    //   );
    if (pathname === "/admin/map") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.map.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/informs") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.inform.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/schedules") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.schedule.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/routes") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.route.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/buses") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.bus.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/drivers") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.driver.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/parents") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.parent.key) - 1] as CustomItemType
      );
    } else if (pathname === "/admin/students") {
      setSelectedItem(
        menuItems[Number(CustomItemValue.student.key) - 1] as CustomItemType
      );
    }
  }, [location.pathname]);
  useEffect(() => {
    setSelectedItem(menuItems[Number(selectedItem.key) - 1] as CustomItemType);
  }, [localStorage.getItem("lang")]);

  // Brand
  const brand = (
    <div className="admin-layout__sider-brand brand">
      <img
        src="/src/assets/images/others/logo-image.png"
        alt="Brand Logo"
        className="brand__logo"
      />
      {(!collapsed || !screens.lg) && (
        <span className="brand__text">School Bus</span>
      )}
    </div>
  );
  // Menu Content
  const menuContent = (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={[selectedItem?.key as string]}
      items={menuItems}
      className="admin-layout__sider-menu"
      onSelect={(item) => {
        setSelectedItem(menuItems[Number(item.key) - 1] as CustomItemType);
      }}
    />
  );

  return (
    <Layout className="admin-layout">
      {/* Sidebar cho màn hình lớn */}
      {screens.lg && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="admin-layout__sider"
        >
          {brand}
          {menuContent}
        </Sider>
      )}
      {/* Drawer cho mobile */}
      {!screens.lg && (
        <Drawer
          placement="left"
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          className="admin-layout__drawer drawer"
        >
          {brand}
          {menuContent}
          <div className="drawer__footer">
            <Button
              color="danger"
              variant="solid"
              className="close-btn"
              onClick={() => setDrawerVisible(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
              <span>Đóng</span>
            </Button>
          </div>
        </Drawer>
      )}
      {/* Main */}
      <Layout className="admin-layout__main">
        {/* Main Header */}
        <Header className="admin-layout__main-header">
          {/* Toggle hoặc mở Drawer */}
          {screens.lg ? (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-button"
            />
          ) : (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              className="collapse-button"
            />
          )}
          {/* Tiêu đề trang */}
          <h2 className="title">
            {(selectedItem.label as any).props.children}
          </h2>
          <div className="right">
            <Dropdown
              overlay={languageMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<GlobalOutlined />}
                className="language"
              >
                {lang === "vi" ? "🇻🇳" : "🇬🇧"}
              </Button>
            </Dropdown>
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faPowerOff} />}
              onClick={() => {
                console.log("Xử lý đăng xuất");
              }}
            >
              {t("logout")}
            </Button>
          </div>
        </Header>
        {/* Main Content */}
        {/* <Content
          style={{
            margin: "24px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
        </Content> */}
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
