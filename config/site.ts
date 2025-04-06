interface NavLink {
  title: string;
  href: string;
  icon: string;
}

const SiteNavLinks: Record<string, NavLink> = {
  Overview: { title: 'Overview', href: '/overview', icon: 'Home' },
  Published: { title: 'Published', href: '/overview/published', icon: 'Book' },
} as const;

export const siteConfig = [SiteNavLinks.Overview, SiteNavLinks.Published];

export const userConfig = {
  profile: { title: 'Profile', href: '/profile', icon: 'User' },
  settings: { title: 'Settings', href: '/settings', icon: 'Settings' },
  logout: { title: 'Logout', href: '/logout', icon: 'LogOut' },
} as const;
