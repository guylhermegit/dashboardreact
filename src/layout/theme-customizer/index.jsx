
import React, { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import {
    ADD_LAYOUT,
    ADD_SIDEBAR_TYPES,
    ADD_SIDEBAR_SETTINGS,
    ADD_COLOR,
    ADD_COSTOMIZER,
    ADD_MIX_BACKGROUND_LAYOUT,
    ROUTER_ANIMATION
} from '../../redux/actionTypes'
import { classes } from '../../data/layouts';

let DefaultLayout = {};
const Themecustomizer = () => {
    const default_color = localStorage.getItem('default_color');
    const secondary_color = localStorage.getItem('secondary_color');
    const layout_animation = localStorage.getItem('animation');
    const configDB = useSelector(content => content.Customizer.customizer);
    const dispatch = useDispatch();
    const [layout_type, setLayout_type] = useState(configDB.settings.layout_type);
    const [sidebar_type, setSidebar_type] = useState(configDB.settings.sidebar.type);
    const sidebar_setting = configDB.settings.sidebar_setting;
    const mix_background_layout = configDB.color.mix_background_layout;
    const config_primary = configDB.color.primary_color;
    const config_secondary = configDB.color.secondary_color;
    const width = useWindowSize()
    let history = useHistory();

    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                setSize(window.innerWidth);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
        return size;
    }

    useEffect(() => {
        // fetch object which is default set in sidebar_type, used when user not select any layout
        const defaultLayoutObj = classes.find(item => Object.values(item).pop(1) === sidebar_type);
        // somecases taken static url so need to modified
        const modifyURL = process.env.PUBLIC_URL + "/dashboard/default/" + Object.keys(defaultLayoutObj).pop()
        // fetch id from URL
        const id = window.location.pathname === '/' ? history.push(modifyURL) : window.location.pathname.split('/').pop()

        // fetch object by getting URL
        const layoutobj = classes.find(item => Object.keys(item).pop() === id);
        const layout = id ? layoutobj : defaultLayoutObj
        DefaultLayout = defaultLayoutObj

        handlePageLayputs(layout);
        dispatch({ type: ADD_COSTOMIZER });

        dispatch({
            type: ADD_COLOR,
            payload: {
                default_color,
                secondary_color,
            }
        })

        dispatch({ type: ROUTER_ANIMATION, payload: layout_animation });

        if (default_color == null || secondary_color == null) {
            document.documentElement.style.setProperty('--theme-deafult', config_primary);
            document.documentElement.style.setProperty('--theme-secondary', config_secondary);
            dispatch({
                type: ADD_COLOR,
                payload: {
                    primary_color: config_primary,
                    secondary_color: config_secondary,
                }
            })
        } else {
            document.documentElement.style.setProperty('--theme-deafult', default_color);
            document.documentElement.style.setProperty('--theme-secondary', secondary_color);
            dispatch({
                type: ADD_COLOR,
                payload: {
                    primary_color: default_color,
                    secondary_color: secondary_color,
                }
            })
        }

        //set layout_type
        document.body.className = `${mix_background_layout} ${layout_type}`
        document.documentElement.dir = layout_type;
        console.log("width", configDB.settings.sidebar.type);
        //set sidebar_type
        if (width <= 991 && configDB.settings.sidebar.type.split(' ').includes('horizontal-wrapper')) {
            document.querySelector(".page-wrapper").className = 'page-wrapper compact-wrapper'
            document.querySelector(".page-header").className = 'page-header close_icon';
            document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon"
        } else {
            document.querySelector(".page-wrapper").className = 'page-wrapper ' + configDB.settings.sidebar.type;
            document.querySelector(".page-header").className = 'page-header close_icon';
            document.querySelector(".sidebar-wrapper").className = 'sidebar-wrapper close_icon';
        }


        //set sidebar setting
        document.querySelector(".sidebar-wrapper").setAttribute('sidebar-layout', sidebar_setting);
        // eslint-disable-next-line
    }, [width]);



    const handlePageLayputs = (type) => {
        let key = Object.keys(type).pop();
        let val = Object.values(type).pop();
        document.querySelector(".page-wrapper").className = 'page-wrapper ' + val;
        dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } })
        localStorage.setItem("layout", key)
        history.push(key);
    }







    return (
        <Fragment>
        </Fragment>
    );
}

export default Themecustomizer;
export { DefaultLayout };