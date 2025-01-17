import { Modals } from '../modals/Modals';
import { SidebarNotifications } from '../shared/Global/SidebarNotifications/SidebarNotifications';
import { Header } from '../shared/Global/Header/Header';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMobile } from '../hooks/useMobile';
import { SidebarSvgSelector } from '../assets/icons/sidebar/SIdebarSvgSelector';
import { useLocation } from 'react-router';
import { SidebarDesktop } from '../shared/Global/Sidebar/SidebarDesktop';
import { SidebarMobile } from '../shared/Global/Sidebar/SidebarMobile';
import { SidebarWrapper } from '../shared/Global/SidebarWrapper/SidebarWrapper';
import { Chat } from '../shared/Modules/Chat';
import { eventBus, EventTypes } from '../services/EventBus';
import {
  selectAccessToken,
  selectIsAdmin,
  selectIsDoctor,
} from '../store/slices/authSlice';
import { getCurrentPage } from '../utils/getCurrentPage';
import { useCurrentUserQuery } from '../api/user';
import { useGetAllDialogsQuery } from '../api/chat';
import { useSignOutMutation } from '../api/auth';
import { useAppSelector } from '../store/storeHooks';
import { useGetCurrentTariffQuery } from '../api/tariffs';
import { selectChatAccesses } from '../store/slices/tariff';

interface Props {
  children: React.ReactNode;
}

export interface Page {
  page: string;
  link: string;
  redirect?: string;
}
export interface Nav extends Page {
  svg?: ReactElement;
}

const pages = [
  { page: 'Профиль', link: 'profile' },
  { page: 'Дневник спортсмена BUTMANA', link: '/' },
  { page: 'Цели', link: 'goals' },
  { page: 'Тарифы', link: 'tariffs' },
  { page: 'Видеоконсультации', link: 'consultations' },
  { page: 'Блог', link: '', redirect: 'https://biotropika.ru/blog/' },
  {
    page: 'Интернет-магазин',
    link: '',
    redirect: 'https://biotropika.ru/shop/',
  },
  { page: 'Анкета', link: 'questionnaire' },
  { page: 'Пользователи', link: 'users' },
  { page: 'Пользователи', link: '/' },
  { page: 'Специалист', link: 'specialists' },
  { page: 'Рекомендации', link: 'recommendations' },
  { page: 'Логи', link: 'logs' },
];

const clientNav: Nav[] = [
  {
    ...pages[1],
    svg: <SidebarSvgSelector id="home" />,
  },
  {
    ...pages[2],
    svg: <SidebarSvgSelector id="goals" />,
  },
  {
    ...pages[5],
    svg: <SidebarSvgSelector id="edit-square" />,
  },
  {
    ...pages[6],
    svg: <SidebarSvgSelector id="services" />,
  },
];

const specialistNav: Nav[] = [
  {
    ...pages[1],
    page: 'Пользователи',
    svg: <SidebarSvgSelector id="users" />,
  },
  {
    ...pages[4],
    svg: <SidebarSvgSelector id="video" />,
  },
  {
    ...pages[5],
    svg: <SidebarSvgSelector id="edit-square" />,
  },
  {
    ...pages[6],
    svg: <SidebarSvgSelector id="services" />,
  },
];

const adminNav: Nav[] = [
  {
    ...pages[9],
    svg: <SidebarSvgSelector id="users" />,
  },
  {
    ...pages[12],
    svg: <SidebarSvgSelector id="logs" />,
  },
];

export function PrivateLayout(props: Props) {
  const { refetch, data: currentUser } = useCurrentUserQuery();
  const { data: dialogs = [] } = useGetAllDialogsQuery();
  const [fetchLogout] = useSignOutMutation();

  async function sendMessage() {
    const dialog = dialogs.find(it => it.title === 'Техподдержка');
    if (dialog) {
      eventBus.emit(EventTypes.chatOpen, dialog.id);
    }
  }

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isAdmin = useSelector(selectIsAdmin);
  const isSpecialist = useSelector(selectIsDoctor);
  const { data: currentTariff } = useGetCurrentTariffQuery();

  const currentPage = useMemo(() => getCurrentPage(pathname), [pathname]);

  let nav: Nav[] = [];
  if (isAdmin) {
    nav = adminNav;
  } else if (isSpecialist) {
    nav = specialistNav;
  } else {
    nav = clientNav;
  }

  const currentPageName = nav
    .concat(pages)
    .find(p => p.link === currentPage)?.page;

  const [page, setPage] = useState<string>(currentPageName || 'Страница 404');

  useEffect(() => {
    setPage(currentPageName || 'Страница 404');
  }, [currentPageName]);

  const isMobile = useMobile();

  const [isUnread, setUnread] = useState(false);
  const [isNotificationsUnread, setNotificationsUnread] = useState(false);
  const [openedDialog, setOpenedDialog] = useState<number | undefined>(
    undefined,
  );

  const [sidebarNotificationsOpen, setSidebarNotificationsOpen] =
    useState<boolean>(false);
  const [chatNotificationsOpen, setSidebarChatOpen] = useState<boolean>(false);

  const token = useAppSelector(selectAccessToken);
  const chatAccesses = useAppSelector(selectChatAccesses);

  eventBus.on(EventTypes.chatOpen, (id: number) => {
    setSidebarChatOpen(true);
    setOpenedDialog(id);
  });

  const openChat = useCallback(() => {
    sendMessage().then(() => {
      setSidebarNotificationsOpen(false);
      setSidebarChatOpen(true);
    });
  }, [chatNotificationsOpen]);

  const logout = useCallback(async () => {
    await fetchLogout().unwrap();
    refetch();
    document.location.reload();
    localStorage.setItem('token', '');
  }, [dispatch]);

  const onNavClick = useCallback(
    (nav: Partial<Nav>) => {
      if (nav.link && nav.page) setPage(nav.page);
      if (nav.redirect) return window.open(nav.redirect);
    },
    [window],
  );

  return (
    <div className="global__container">
      <Modals />

      {!isMobile ? (
        <SidebarDesktop
          onNavClick={onNavClick}
          defaultSelected={currentPage}
          chatNotificationsOpen={chatNotificationsOpen}
          openChat={openChat}
          logout={logout}
          nav={nav}
          isPaid={currentTariff?.isPaid || false}
          user={currentUser}
        />
      ) : (
        <SidebarMobile
          onNavClick={onNavClick}
          setSidebarChatOpen={setSidebarChatOpen}
          setSidebarNotificationsOpen={setSidebarNotificationsOpen}
          chatNotificationsOpen={chatNotificationsOpen}
          openChat={openChat}
          isChatUnread={isUnread}
          logout={logout}
          pages={pages}
          nav={nav}
          user={currentUser}
        />
      )}

      {currentUser && (
        <SidebarWrapper
          isOpened={chatNotificationsOpen}
          onClose={() => setSidebarChatOpen(false)}
        >
          <Chat
            accesses={chatAccesses}
            token={token || ''}
            activeDialogId={openedDialog}
            currentUser={currentUser}
            onClose={() => setSidebarChatOpen(false)}
            onChangeReading={setUnread}
          />
        </SidebarWrapper>
      )}
      <SidebarNotifications
        open={sidebarNotificationsOpen}
        setOpen={setSidebarNotificationsOpen}
        onChangeNotification={setNotificationsUnread}
      />
      <div className="container">
        <Header
          isChatUnread={isUnread}
          isNotificationsUnread={isNotificationsUnread}
          setSidebarChatOpen={setSidebarChatOpen}
          setSidebarNotificationsOpen={setSidebarNotificationsOpen}
          page={page}
        />
        {props.children}
      </div>
    </div>
  );
}
