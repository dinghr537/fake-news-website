import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import FakeNews from './FakeNews.js'
import { useState } from 'react';
import EditorStyle from './../style/Editor.module.scss'

const tempNews = `<num>日美國總統<per0>與英國<en>首相<per1>於<loc0>舉行雙<en2>邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>...`;

const useStyles = makeStyles((theme) => ({
    inputTextField: {
        width: "76%",
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(200, 200, 200)",
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(235, 250, 173)"
        },
        "& .MuiInputBase-root.Mui-disabled": {
            color: "white",
        },
        justifyContent: 'center',
        minHeight: "80",
        paddingLeft: '10',
    },
    input: {
        fontSize: "20",
        ['@media (min-width:600px)']: {
            fontSize: "24",
        },
        color: 'white',
    },
    label: {
        color: 'white',
        fontSize: 20,
    },
    button: {
        backgroundColor: '#3c52b2',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#3c52b2',
        },
        width: '100%',
    },
    editorField: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(200, 200, 200)",
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(235, 250, 173)"
        },
        "& .MuiInputBase-root.Mui-disabled": {
            color: "white",
        },
        minHeight: "200",
        boxSizing: "border-box",
        color: 'white',
        fontSize: "22",
        width: "100%",
        maxWidth: "100%",
        padding: "20 20 20 20",
        alignItems: "flex-start",
    },
}))

function TagList(props) {
    const list = [];
    const tagCollection = ['num', 'per', 'en', 'loc', 'org'];
    for (const tag in props.tagVariables) {
        let tagNameWithoutNum = tag.replace(/[0-9]/g, '')
        let filteredTagName = tagCollection.includes(tagNameWithoutNum) ? tagNameWithoutNum : "others";
        list.push(
            <React.Fragment key={list.length}>
                <div className={EditorStyle['tag-name']}>
                    <span className={EditorStyle[filteredTagName]}>{tag}:</span>
                </div>
                <TextField className={props.classes.inputTextField}
                    id={tag}
                    multiline
                    InputProps={{
                        className: props.classes.input
                    }}
                    InputLabelProps={{
                        className: props.classes.label
                    }}
                    value={props.value[tag]}
                    onChange={props.onChange}
                    variant="outlined"
                />
            </React.Fragment>
        )
    }

    return (
        <div className={EditorStyle['input-text-field-container']}>
            {list}
        </div>
    )
}

export default function Demo1Content() {
    const classes = useStyles();
    const [news, setNews] = useState(tempNews);

    const reG = /<[\w-]*>/g;
    const re = /(<[\w-]*>)/;



    let tags = news.match(reG);
    let tagSet = new Set(tags);
    let contentFragment = news.split(re);
    console.log(tagSet);
    // const arrFromSet = Array.from(tagSet);
    let tempState = {};
    for (const tag of tagSet) {
        let innerTag = tag.substring(1, tag.length - 1)
        tempState[innerTag] = innerTag;
    }
    // console.log("===============");
    // console.log(tempState);

    const [state, setState] = React.useState(tempState);
    let syncState = state;

    function handleTagChange(event) {
        // console.log(event);
        setState({ ...state, [event.target.id]: [event.target.value] });
    }


    function handleClick(event) {
        console.log(news);
        setNews(event.target.value);
        let syncNews = event.target.value;
        tags = syncNews.match(reG);
        tagSet = new Set(tags);
        console.log(syncNews);
        contentFragment = syncNews.split(re);
        tempState = {};
        for (const tag of tagSet) {
            let innerTag = tag.substring(1, tag.length - 1)
            tempState[innerTag] = innerTag;
        }
        console.log(tempState);
        const keys = Object.keys(tempState);
        Object.assign(tempState, state);
        console.log(tempState);
        Object.keys(tempState)
            .filter(key => !keys.includes(key))
            .forEach(key => delete tempState[key]);
        setState(tempState);
        syncState = tempState;
    }
    // let tagVariables = {
    //     num: 155,
    //     per0: "Rex",
    //     org0: "WHO",
    //     per1: "BCP",
    // }

    // contentFragment[2] = "<org0>";
    const tagCollection = ['num', 'per', 'en', 'loc', 'org']
    for (let i = 0; i < contentFragment.length; ++i) {
        console.log(contentFragment[i]);
        if (tagSet.has(contentFragment[i])) {
            let innerTagName = contentFragment[i].substring(1, contentFragment[i].length - 1);
            let tagNameWithoutNum = innerTagName.replace(/[0-9]/g, '')
            let filteredTagName = tagCollection.includes(tagNameWithoutNum) ? tagNameWithoutNum : "others";
            contentFragment[i] = <span className={EditorStyle[filteredTagName]}>{state[innerTagName]}</span>;
        }
    }

    return (
        <>
            <div className={EditorStyle['whole-page']}>
                <div className={EditorStyle['container']}>
                    <Grid
                        className={EditorStyle['content']}
                        container
                    >
                        <Grid
                            className={EditorStyle['content-signature']}
                            item xs={12} sm={8} md={5} lg={4} xl={3}>
                            <TagList tagVariables={syncState} classes={classes} value={state} onChange={handleTagChange} />
                        </Grid>
                        <Grid
                            className={EditorStyle['content-signature']}
                            item xs={12} sm={10} md={7} lg={6} xl={7}
                        >
                            <div>
                                <div className={EditorStyle['news']}>
                                    {contentFragment.map((item, index) => <span key={index}>{item}</span>)}
                                </div>
                                <TextField className={classes.editorField}
                                    id="news"
                                    multiline
                                    InputProps={{
                                        className: classes.editorField
                                    }}
                                    value={news}
                                    onChange={handleClick}
                                    variant="outlined"
                                />
                            </div>
                        </Grid>
                    </Grid>



                </div>
            </div>
        </>
    )
}