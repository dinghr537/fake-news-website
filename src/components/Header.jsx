import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline'
import { StylesProvider } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu'
import HomeIcon from '@material-ui/icons/Home';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import StorageIcon from '@material-ui/icons/Storage';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'

import logoImage from './../res/image/logo.png'
import HeaderStyle from './../style/Header.module.scss'

function RouteList() {
  const [state, setState] = React.useState({
    left: false,
    Demo: false,
    Method: false,
  });

  const handleListClick = (clickItem) => {
    return () => {
      setState({ ...state, ...clickItem })
    }
  }

  return (
    /**
     * list of entries in the navigation bar: home, demo, data, method, editor
     *
     * 
     */
    <div role="presentation">
      <List className={HeaderStyle['list']}>

        <Link
          className={HeaderStyle['list-item-text']}
          href={`home.html`}
        >
          <ListItem button>
            <ListItemIcon>
              <HomeIcon className={HeaderStyle['list-item-icon']} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>

        <ListItem
          button
          className={HeaderStyle['list-item-text']}
          onClick={handleListClick({ Demo: !state.Demo })}
        >
          <ListItemIcon>
            <TouchAppIcon className={HeaderStyle['list-item-icon']} />
          </ListItemIcon>
          <ListItemText primary={"Demo"} />
          {state.Demo
            ? <ExpandLess className={HeaderStyle['list-item-icon']} />
            : <ExpandMore className={HeaderStyle['list-item-icon']} />
          }
        </ListItem>
        <Collapse in={state.Demo} timeout='auto' unmountOnExit>
          <List className={HeaderStyle['list']}>

            <Link
              className={HeaderStyle['list-item-text']}
              href={"demo1.html"}
            >
              <ListItem className={HeaderStyle['list-item-sub']}>
                <ListItemIcon>
                  <TouchAppIcon className={HeaderStyle['list-item-icon']} />
                </ListItemIcon>
                {/* //TODO: replace with the real url later */}
                <ListItemText primary="Demo 1" />
              </ListItem>
            </Link>

            <Link
              className={HeaderStyle['list-item-text']}
              href={"target.html"}
            >
              <ListItem className={HeaderStyle['list-item-sub']}>
                <ListItemIcon>
                  <TouchAppIcon className={HeaderStyle['list-item-icon']} />
                </ListItemIcon>
                {/* //TODO: replace with the real url later */}
                <ListItemText primary="Demo 2" />
              </ListItem>
            </Link>

          </List>
        </Collapse>

        <Link
          className={HeaderStyle['list-item-text']}
          href={`data.html`}
        >
          <ListItem button>
            <ListItemIcon>
              <StorageIcon className={HeaderStyle['list-item-icon']} />
            </ListItemIcon>
            Data
          </ListItem>
        </Link>

        <Link
          className={HeaderStyle['list-item-text']}
          href={`method.html`}
        >
          <ListItem button>
            <ListItemIcon>
              <LibraryBooksIcon className={HeaderStyle['list-item-icon']} />
            </ListItemIcon>
            Method
          </ListItem>
        </Link>

        <Link
          className={HeaderStyle['list-item-text']}
          href={`newsEditor.html`}
        >
          <ListItem button>
            <ListItemIcon>
              <EditIcon className={HeaderStyle['list-item-icon']} />
            </ListItemIcon>
            Editor
          </ListItem>
        </Link>
      </List>
    </div>
  )
}



export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({ left: false });

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, left: open });
  };

  return (
    /**
     * Structure:
     * StylesProvider
     * | Toolbar
     * | | IconButton (menu bar)
     * | | Link (LAB's logo)
     * | | SwipeableDrawer
     *
     */
    <div>
      <CssBaseline />
      <StylesProvider injectFirst>
        <Toolbar
          className={HeaderStyle['toolbar']}
          variant='regular'
        >
          <IconButton
            aria-label='button'
            className={HeaderStyle['menu-icon']}
            color='inherit'
            edge='start'
            onClick={toggleDrawer(true)}
          >
            <MenuIcon className={HeaderStyle['list-item-icon']} />
          </IconButton>

          <Link
            className={HeaderStyle['logo-link']}
            href={"https://ikmlab.csie.ncku.edu.tw/"}>
            <img
              alt='IKMLab logo'
              className={HeaderStyle['logo']}
              role='img'
              src={logoImage} />
          </Link>

          <SwipeableDrawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            PaperProps={{
              className: HeaderStyle['paper-root']
            }}
          >
            <RouteList />
          </SwipeableDrawer>
        </Toolbar>
      </StylesProvider>
    </div>
  );
}
