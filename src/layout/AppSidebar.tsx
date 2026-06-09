"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDown } from "lucide-react";
import {
  Home,
  Database,
  FileText,
  Layers,
  ShoppingCart,
  Box,
  Users,
  DollarSign,
  BookOpen,
  BarChart2,
  Settings,
} from "lucide-react";
import { HorizontaLDots } from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, name: "Dashboard", path: "/" },

  {
    name: "Data Master",
    icon: <Database className="w-5 h-5" />,
    subItems: [
      { name: "Perusahaan", path: "/companies" },
      { name: "Departemen", path: "/departments" },
      { name: "Pelanggan", path: "/customers" },
      { name: "Pemasok", path: "/suppliers" },
      { name: "Produk & Jasa", path: "/products" },
      { name: "Gudang", path: "/warehouses" },
    ],
  },

  {
    name: "Tender",
    icon: <FileText className="w-5 h-5" />,
    subItems: [
      { name: "Penawaran", path: "/quotations" },
      { name: "RAB", path: "/rab" },
      { name: "BOQ", path: "/boq" },
      { name: "Kontrak", path: "/contracts" },
    ],
  },

  {
    name: "Proyek",
    icon: <Layers className="w-5 h-5" />,
    subItems: [
      { name: "Daftar Proyek", path: "/project" },
      { name: "Anggaran", path: "/budgets" },
      { name: "Progress", path: "/progress" },
      { name: "Biaya Proyek", path: "/costs" },
      { name: "Termin", path: "/billing-milestones" },
    ],
  },

  {
    name: "Pengadaan",
    icon: <ShoppingCart className="w-5 h-5" />,
    subItems: [
      { name: "Permintaan Pembelian", path: "/pr" },
      { name: "Pesanan Pembelian", path: "/po" },
      { name: "Penerimaan Barang", path: "/gr" },
      { name: "Retur", path: "/return" },
    ],
  },

  {
    name: "Persediaan",
    icon: <Box className="w-5 h-5" />,
    subItems: [
      { name: "Stok Barang", path: "/stocks" },
      { name: "Barang Masuk", path: "/goods-in" },
      { name: "Barang Keluar", path: "/goods-out" },
      { name: "Mutasi Stok", path: "/mutations" },
      { name: "Stok Opname", path: "/opname" },
    ],
  },

  {
    name: "SDM",
    icon: <Users className="w-5 h-5" />,
    subItems: [
      { name: "Karyawan", path: "/employees" },
      { name: "Absensi", path: "/attendance" },
      { name: "Cuti", path: "/leaves" },
      { name: "Lembur", path: "/overtimes" },
      { name: "Penggajian", path: "/payrolls" },
    ],
  },

  {
    name: "Keuangan",
    icon: <DollarSign className="w-5 h-5" />,
    subItems: [
      { name: "Kas & Bank", path: "/cash-bank" },
      { name: "Piutang", path: "/receivables" },
      { name: "Hutang", path: "/debt" },
      { name: "Pengeluaran", path: "/expenditures" },
      { name: "Penerimaan", path: "/receptions" },
    ],
  },

  {
    name: "Akuntansi",
    icon: <BookOpen className="w-5 h-5" />,
    subItems: [
      { name: "Jurnal Umum", path: "/journals" },
      { name: "Buku Besar", path: "/general-ledger" },
      { name: "Neraca Saldo", path: "/balance-sheet" },
      { name: "Laba Rugi", path: "/profit-loss" },
      { name: "Neraca", path: "/balance" },
    ],
  },

  
];

const othersItems: NavItem[] = [
  {
    name: "Laporan",
    icon: <BarChart2 className="w-5 h-5" />,
    subItems: [
      { name: "Proyek", path: "/reports/projects" },
      { name: "Pengadaan", path: "/reports/procurement" },
      { name: "Persediaan", path: "/reports/inventory" },
      { name: "SDM", path: "/reports/hr" },
      { name: "Keuangan", path: "/reports/finance" },
    ],
  },
  {
    name: "Pengaturan",
    icon: <Settings className="w-5 h-5" />,
    subItems: [
      { name: "Pengguna", path: "/settings/users" },
      { name: "Hak Akses", path: "/settings/roles" },
      { name: "Persetujuan", path: "/settings/approvals" },
      { name: "Pengaturan Sistem", path: "/settings/system" },
    ],
  },
];

// Simple in-file company selector for multi-company support


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {/* <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
            <h2 className="text-xl font-semibold">ERP CSS</h2>
            </>
          ) : (
            <h2 className="text-xl font-semibold">ERP</h2>
            // <Image
            //   src="/images/logo/logo-icon.svg"
            //   alt="Logo"
            //   width={32}
            //   height={32}
            // />
          )}
        </Link>
      </div>
      {/* Company switcher (multi-company support) */}
      <div className={`px-2 mb-4 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        {(isExpanded || isHovered || isMobileOpen) ? (
          ''
        ) : (
          <div className="flex items-center justify-center"> 
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full" />
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Lainnya"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
