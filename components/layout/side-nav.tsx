"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import { Flex, Box, Text, Heading } from "@radix-ui/themes";
import {
  MessageCircle, // 채팅
  VectorSquare, // 지식 광장
  Swords, // 모험
  TrendingUp, // 크라우디언 랭크
  Settings, // 설정
  PanelLeft, // 사이드바 토글 아이콘
  LogIn,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useModal } from "../../context/LoginModalContext";
import { useTranslations } from "next-intl";
import styles from "./side-nav.module.scss";
import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";
import { useUserStore } from "../../store/useUserStore";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string; color?: string }>;
  labelKey: string;
}

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname(); // 현재 경로 가져오기
  const { openLoginModal } = useModal();
  const { user, logout } = useUserStore();

  const t = useTranslations("SideNav");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navClass = `${styles.nav} ${isCollapsed ? styles.collapsed : styles.expanded}`;

  const menuItems: MenuItem[] = [
    {
      href: "/chat",
      icon: MessageCircle,
      labelKey: "chat",
    },
    {
      href: "/academy",
      icon: GraduationCap,
      labelKey: "academy",
    },
    {
      href: "/adventure",
      icon: Swords,
      labelKey: "adventure",
    },
    {
      href: "/rank",
      icon: TrendingUp,
      labelKey: "rank",
    },
    {
      href: "/settings",
      icon: Settings,
      labelKey: "settings",
    },
  ];

  const isMenuActive = (href: string) => {
    // 🔴 수정 1: (?=\/) 대신 (?=(\/|$)) 사용
    // 뜻: "뒤에 슬래시가 있거나, 아니면 문장이 끝나는 경우"를 찾음
    const localeRegex = /^\/[a-zA-Z]{2}(?=(\/|$))/;
    const locale = pathname.match(localeRegex)?.[0];

    if (locale) {
      let normalizedPathname = pathname.replace(localeRegex, "");

      // 🔴 수정 2: 로케일을 지웠는데 빈 문자열('')이 되었다면 루트('/')로 간주
      if (!normalizedPathname) normalizedPathname = "/";

      return normalizedPathname === href;
    } else {
      return pathname === href;
    }
  };

  return (
    <div className={navClass}>
      <header className={styles.header}>
        <Button
          variant="ghost"
          size="3"
          onClick={toggleSidebar}
          className={styles.toggleSidebar}
        >
          <PanelLeft style={{ color: "var(--text-main)" }} />
        </Button>
        {!isCollapsed && (
          <div className={styles.headerRight}>
            <ThemeToggle />
          </div>
        )}
      </header>

      <Flex direction="column" flexGrow="1">
        <Box className={user ? styles.profileSection : styles.loginSection}>
          {user ? (
            !isCollapsed ? (
              <>
                <div className={styles.profileTop}>
                  <div className={styles.avatar}>
                    <img
                      src={user.photoURL || "/default-avatar.png"} // fallback image needed
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://api.dicebear.com/7.x/pixel-art/svg?seed=" +
                          user.uid;
                      }}
                    />
                  </div>
                  <div className={styles.profileInfo}>
                    <span className={styles.nickname}>{user.nickname}</span>
                    <span className={styles.level}>Lv.{user.stats.level}</span>
                  </div>
                </div>

                <div className={styles.expContainer}>
                  <div className={styles.expLabel}>
                    <span>누적 경험치</span>
                    <span>
                      {user.stats.exp} / {user.stats.maxExp} EXP
                    </span>
                  </div>
                  <div className={styles.expBarBg}>
                    <div
                      className={styles.expBarFill}
                      style={{
                        width: `${Math.min((user.stats.exp / user.stats.maxExp) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.points}>
                    <span>{user.stats.points.toLocaleString()} G</span>
                  </div>
                  <Link
                    href={`/user/${user.uid}`}
                    className={styles.mypageLink}
                  >
                    마이페이지 &gt;
                  </Link>
                </div>

                <button className={styles.logoutBtn} onClick={logout}>
                  <LogOut size={14} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <Box className={styles.collapsedPlaceholder}>
                <div
                  className={styles.avatar}
                  style={{ width: 32, height: 32 }}
                >
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://api.dicebear.com/7.x/pixel-art/svg?seed=" +
                        user.uid;
                    }}
                  />
                </div>
                <button
                  className={styles.logoutBtnCollapsed}
                  onClick={logout}
                  title="로그아웃"
                >
                  <LogOut size={16} color="var(--text-sub)" />
                </button>
              </Box>
            )
          ) : !isCollapsed ? (
            <>
              <Text as="p" size="2" className={styles.loginPrompt}>
                {t("loginPrompt")}
              </Text>
              <Button
                size="2"
                className={styles.loginBtn}
                onClick={openLoginModal}
              >
                {t("login")}
              </Button>
            </>
          ) : (
            <Box className={styles.collapsedPlaceholder}>
              <LogIn color="var(--text-main)" />
            </Box>
          )}
        </Box>

        <nav className={styles.menu}>
          {menuItems.map((item) => {
            const active = isMenuActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.menuLink} ${active ? styles.active : ""}`}
              >
                <Icon
                  className={styles.icon}
                  color={active ? "var(--text-blue)" : "var(--text-sub)"}
                />
                <span className={styles.label}>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </Flex>
    </div>
  );
}
