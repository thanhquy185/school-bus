import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu, Drawer, Button, Grid, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faGraduationCap,
  faMapLocationDot,
  faPowerOff,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const { Header } = Layout;
const { useBreakpoint } = Grid;

interface ClientLayoutProps {
  role?: "driver" | "parent";
}

type CustomItemType = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  link: string;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ role }) => {
  //
  const location = useLocation();
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

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

  //
  const [drawerVisible, setDrawerVisible] = useState(false);

  // menuItems theo role
  const menuItems: CustomItemType[] = useMemo(
    () =>
      role === "parent"
        ? [
            {
              key: "1",
              label: "Hành trình đưa đón",
              link: "/parent/journey",
              icon: <FontAwesomeIcon icon={faMapLocationDot} />,
            },
            {
              key: "2",
              label: "Học sinh",
              link: "/parent/student",
              icon: <FontAwesomeIcon icon={faGraduationCap} />,
            },
            {
              key: "3",
              label: "Thông tin",
              link: "/parent/info",
              icon: <FontAwesomeIcon icon={faUser} />,
            },
          ]
        : [
            {
              key: "1",
              label: "Hành trình đưa đón",
              link: "/driver/journey",
              icon: <FontAwesomeIcon icon={faMapLocationDot} />,
            },
            {
              key: "2",
              label: "Lịch làm việc",
              link: "/driver/schedule",
              icon: <FontAwesomeIcon icon={faCalendarDays} />,
            },
            {
              key: "3",
              label: "Thông tin",
              link: "/driver/info",
              icon: <FontAwesomeIcon icon={faUser} />,
            },
          ],
    [role]
  );

  // state item đã chọn
  const [selectedKey, setSelectedKey] = useState<string>(menuItems[0].key);

  // cập nhật khi đổi route
  useEffect(() => {
    const current = menuItems.find((item) =>
      location.pathname.startsWith(item.link)
    );
    if (current) {
      setSelectedKey(current.key);
    }
  }, [location.pathname, menuItems]);
  // đóng Drawer khi chuyển sang desktop
  useEffect(() => {
    if (isDesktop && drawerVisible) {
      setDrawerVisible(false);
    }
  }, [isDesktop, drawerVisible]);

  // render menu content
  const menuContent = (
    <Menu
      theme="dark"
      mode={drawerVisible ? "inline" : "horizontal"}
      selectedKeys={[selectedKey]}
      onClick={(info) => {
        setSelectedKey(info.key);
      }}
      items={menuItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: <Link to={item.link}>{item.label}</Link>,
      }))}
    />
  );

  return (
    <Layout className="client-layout">
      {/* Header */}
      <Header className="client-layout__header">
        {/* Mobile menu button */}
        {!isDesktop && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="drawer-button"
          />
        )}
        {/* Logo */}
        <div className="client-layout__brand brand">
          <img
            src="/src/assets/images/others/logo-image.png"
            alt="Brand Logo"
            className="brand__logo"
          />
          <span className="brand__text">School Bus</span>
        </div>
        {/* Menu desktop */}
        {isDesktop && menuContent}
        {/* Actions */}
        <div className="client-layout__actions">
          <Dropdown
            overlay={languageMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Button
              type="text"
              // icon={<GlobalOutlined />}
              className="client-layout__language"
            >
              {lang === "vi"
                ? !isDesktop
                  ? "🇻🇳"
                  : "🇻🇳 Tiếng Việt"
                : !isDesktop
                ? "🇺🇸"
                : "🇺🇸 English"}
            </Button>
          </Dropdown>
          <button className="client-layout__logout">
            {!isDesktop ? (
              <FontAwesomeIcon icon={faPowerOff} />
            ) : (
              <span>Đăng xuất</span>
            )}
          </button>
        </div>
      </Header>
      {/* Drawer cho mobile */}
      {!isDesktop && (
        <Drawer
          placement="left"
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          className="client-layout__drawer drawer"
          bodyStyle={{ padding: 0 }}
        >
          <div className="drawer__info">
            <img
              src="https://i.pravatar.cc/100"
              alt="avatar"
              className="avatar"
            />
            <div className="text">
              <span className="greeting">
                Xin chào, {role === "parent" ? "phụ huynh" : "tài xế"}
              </span>
              <span className="name">Nguyễn Văn A</span>
            </div>
          </div>

          {menuContent}

          <div className="drawer__footer">
            <Button
              danger
              type="primary"
              className="close-btn"
              onClick={() => setDrawerVisible(false)}
              icon={<FontAwesomeIcon icon={faXmark} />}
            >
              Đóng
            </Button>
          </div>
        </Drawer>
      )}
      {/* Content */}
      <Outlet />
    </Layout>
  );
};

export default ClientLayout;
