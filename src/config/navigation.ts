export interface NavItem {
    key: string;
    href: string;
}

export const navItems: NavItem[] = [
    { key: "home", href: "" },
    { key: "about", href: "/about" },
    { key: "services", href: "/services" },
    { key: "gallery", href: "/gallery" },
    { key: "packages", href: "/packages" },
    { key: "contact", href: "/contact" },
];
