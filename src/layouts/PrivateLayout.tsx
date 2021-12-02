import { Modals } from '../modals/Modals';
import { SidebarNotifications } from '../shared/Global/SidebarNotifications/SidebarNotifications';
import { Header } from '../shared/Global/Header/Header';
import React, { ReactElement, useEffect, useState } from 'react';
import { selectIsAuth, selectUserData } from '../store/ducks/user/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../store/ducks/user/contracts/state';
import { Chat } from '../shared/Global/Chat/Chat';
import { useMobile } from '../hooks/useMobile';
import { SidebarSvgSelector } from '../assets/icons/sidebar/SIdebarSvgSelector';
import { useLocation } from 'react-router';
import { fetchSignout, setUserData } from '../store/ducks/user/actionCreators';
import { SidebarDesktop } from '../shared/Global/Sidebar/SidebarDesktop';
import { SidebarMobile } from '../shared/Global/Sidebar/SidebarMobile';

interface Props {
  children: React.ReactNode;
}

export interface Pages {
  page: string;
  link: string;
}
export interface Nav extends Pages {
  svg: ReactElement;
}

export function PrivateLayout(props: Props) {
  const isAuth = useSelector(selectIsAuth);
  const currentUser = useSelector(selectUserData) as User;

  const dispatch = useDispatch();
  const location = useLocation();

  const isMobile = useMobile();
  const [page, setPage] = useState<string>('Главная');
  const [isUnread, setIsUnread] = useState(false);

  const [sidebarNotificationsOpen, setSidebarNotificationsOpen] =
    useState<boolean>(false);
  const [chatNotificationsOpen, setSidebarChatOpen] = useState<boolean>(false);

  const pages = [
    { page: 'Профиль', link: '/profile' },
    { page: 'Главная', link: '/' },
    { page: 'Цели', link: '/goals' },
    { page: 'Тарифы', link: '/tariffs' },
    { page: 'Видео', link: '/video' },
    { page: 'Блог', link: '/blog' },
    { page: 'Дополнительные услуги', link: '/services' },
  ];

  const nav: Nav[] = [
    {
      ...pages[1],
      svg: <SidebarSvgSelector id="home" />,
    },
    {
      ...pages[2],
      svg: <SidebarSvgSelector id="goals" />,
    },
    {
      ...pages[3],
      svg: <SidebarSvgSelector id="tariffs" />,
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

  const user = useSelector(selectUserData);

  useEffect(() => {
    for (const value of pages) {
      const currentPath = location.pathname.split('/');
      if ('/' + currentPath[1] === value.link) {
        setPage(value.page);
        break;
      } else {
        setPage('Страница 404');
      }
    }
  }, [location.pathname]);

  function openChat() {
    setSidebarNotificationsOpen(false);
    setSidebarChatOpen(!chatNotificationsOpen);
  }

  async function logout() {
    dispatch(fetchSignout());
    dispatch(setUserData(undefined));
  }

  return (
    <div className="global__container">
      <Modals />

      {!isMobile ? (
        <SidebarDesktop
          setPage={setPage}
          setSidebarChatOpen={setSidebarChatOpen}
          setSidebarNotificationsOpen={setSidebarNotificationsOpen}
          chatNotificationsOpen={chatNotificationsOpen}
          openChat={openChat}
          logout={logout}
          pages={pages}
          nav={nav}
          user={user}
          location={location}
        />
      ) : (
        <SidebarMobile
          setPage={setPage}
          setSidebarChatOpen={setSidebarChatOpen}
          setSidebarNotificationsOpen={setSidebarNotificationsOpen}
          chatNotificationsOpen={chatNotificationsOpen}
          openChat={openChat}
          logout={logout}
          pages={pages}
          nav={nav}
          user={user}
          location={location}
        />
      )}

      <Chat
        isOpened={chatNotificationsOpen}
        isAuth={isAuth}
        token={localStorage.getItem('token') as string}
        currentUser={currentUser}
        isUnread={isUnread}
        onChangeReading={setIsUnread}
        onClose={() => setSidebarChatOpen(false)}
      />
      <SidebarNotifications
        open={sidebarNotificationsOpen}
        setOpen={setSidebarNotificationsOpen}
      />
      <div className="container">
        <Header
            isChatUnread={isUnread}
          setSidebarChatOpen={setSidebarChatOpen}
          setSidebarNotificationsOpen={setSidebarNotificationsOpen}
          page={page}
        />
        {props.children}
      </div>
    </div>
  );
}
