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
  GraduationCap,
} from "lucide-react";
import { useModal } from "../../context/LoginModalContext";
import { useTranslations } from "next-intl";
import styles from "./side-nav.module.scss";
import { ThemeToggle } from "../theme-toggle";
import { usePathname } from "next/navigation";

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

  const t = useTranslations("SideNav");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navClass = `${styles.nav} ${isCollapsed ? styles.collapsed : styles.expanded}`;

  const menuItems: MenuItem[] = [
    {
      href: "/",
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
        <Box className={styles.loginSection}>
          {!isCollapsed ? (
            <>
              <Text as="p" size="2" className={styles.loginPrompt}>
                {t("loginPrompt")}
              </Text>
              <Button
                size="2"
                style={{
                  width: "100%",
                  height: "2rem",
                  // borderRadius: "0.5rem",
                  fontFamily: "DungGeunMo",
                  backgroundColor: "var(--bg-element)",
                  color: "var(--text-main)",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
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
