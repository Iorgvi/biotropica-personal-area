import { Modals } from '../modals/Modals';
import { SidebarNotifications } from '../shared/Global/SidebarNotifications/SidebarNotifications';
import { Header } from '../shared/Global/Header/Header';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { selectIsAuth, selectUserData } from '../store/ducks/user/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../store/ducks/user/contracts/state';
import { useMobile } from '../hooks/useMobile';
import { SidebarSvgSelector } from '../assets/icons/sidebar/SIdebarSvgSelector';
import { useLocation } from 'react-router';
import { fetchSignout, setUserData } from '../store/ducks/user/actionCreators';
import { SidebarDesktop } from '../shared/Global/Sidebar/SidebarDesktop';
import { SidebarMobile } from '../shared/Global/Sidebar/SidebarMobile';
import NotificationService from '../services/NotificationService';
import {SidebarWrapper} from "../shared/Global/SidebarWrapper/SidebarWrapper";
import {Chat} from "../shared/Modules/Chat";
import {eventBus, EventTypes} from "../services/EventBus";

interface Props {
  children: React.ReactNode;
}

export interface Pages {
  page: string;
  link: string;
  redirect?: string;
}
export interface Nav extends Pages {
  svg: ReactElement;
}

export function PrivateLayout(props: Props) {
  const isAuth = useSelector(selectIsAuth);
  const currentUser = useSelector(selectUserData);

  const dispatch = useDispatch();
  const location = useLocation();

  const isMobile = useMobile();
  const [page, setPage] = useState<string>('Главная');
  const [isUnread, setIsUnread] = useState(false);
  const [isNotificationsUnread, setIsNotificationsUnread] = useState(false);
  const [openedDialog, setOpenedDialog] = useState<number|undefined>(undefined);

  const [sidebarNotificationsOpen, setSidebarNotificationsOpen] =
    useState<boolean>(false);
  const [chatNotificationsOpen, setSidebarChatOpen] = useState<boolean>(false);

  eventBus.on(EventTypes.chatOpen, (id: number) => {
    setSidebarChatOpen(true);
    setOpenedDialog(id);
  })

  // useEffect(() => {
  //   NotificationService
  //       .getAll()
  //       .then(res =>{
  //         if(res.filter(it => it.))
  //       })
  // }, [])

  const pages = [
    { page: 'Профиль', link: '/profile' },
    { page: 'Специалист', link: '/specialists' },
    { page: 'Главная', link: '/' },
    { page: 'Цели', link: '/goals' },
    { page: 'Тарифы', link: '/tariffs' },
    { page: 'Видео', link: '/video' },
    { page: 'Блог', link: '', redirect: 'https://biotropika.ru/blog/' },
    {
      page: 'Дополнительные услуги',
      link: '',
      redirect: 'https://biotropika.ru/shop/',
    },
    { page: 'Анкета', link: '/questionnaire' },
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
    function setPageName() {
      // TODO: refactoring
      for (const value of pages) {
        const currentPath = location.pathname.split('/');
        if ('/' + currentPath[1] === value.link) {
          setPage(value.page);
          break;
        } else {
          setPage('Страница 404');
        }
      }
    }
    setPageName();
  }, [location.pathname]);

  const openChat = useCallback(() => {
    setSidebarNotificationsOpen(false);
    setSidebarChatOpen(!chatNotificationsOpen);
  }, [chatNotificationsOpen]);

  const logout = useCallback(() => {
    dispatch(fetchSignout());
    dispatch(setUserData(undefined));
  }, []);

  const onNavClick = useCallback(
    (nav: Partial<Nav>) => {
      if (nav.link) {
        setPage(nav?.page || '');
      }
      if (nav.redirect) {
        return window.open(nav.redirect);
      }
    },
    [window]
  );

  return (
    <div className="global__container">
      <Modals />

      {!isMobile ? (
        <SidebarDesktop
          onNavClick={onNavClick}
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
          onNavClick={onNavClick}
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

      {currentUser ? (


        // <Chat
        //   isOpened={chatNotificationsOpen}
        //   isAuth={isAuth}
        //   token={localStorage.getItem('token') as string}
        //   currentUser={currentUser}
        //   isUnread={isUnread}
        //   onChangeReading={setIsUnread}
        //   onClose={() => setSidebarChatOpen(false)}
        // />
          <SidebarWrapper
              isOpened={chatNotificationsOpen}
              onClose={() => setSidebarChatOpen(false)}
          >
            <Chat
                token={localStorage.getItem('token') as string}
                activeDialogId={openedDialog}
                onClose={() => setSidebarChatOpen(false)}
            />
          </SidebarWrapper>
      ) : (
        <div />
      )}
      <SidebarNotifications
        open={sidebarNotificationsOpen}
        setOpen={setSidebarNotificationsOpen}
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
