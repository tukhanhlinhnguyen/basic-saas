// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  dashboard: getIcon('ic_dashboard'),
  chat: getIcon('ic_chat')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'sidebar.general.title',
    items: [
      { title: 'sidebar.one.title', path: PATH_DASHBOARD.general.pageOne, icon: ICONS.dashboard },
      { title: 'sidebar.two.title', path: PATH_DASHBOARD.general.pageTwo, icon: ICONS.ecommerce },
      { title: 'sidebar.three.title', path: PATH_DASHBOARD.general.pageThree, icon: ICONS.chat }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'sidebar.management.title',
    items: [
      {
        title: 'user',
        path: PATH_DASHBOARD.app.root,
        icon: ICONS.user,
        children: [
          { title: 'sidebar.five.title', path: PATH_DASHBOARD.app.pageFive },
          { title: 'sidebar.six.title', path: PATH_DASHBOARD.app.pageSix }
        ]
      }
    ]
  }
];

export default sidebarConfig;
