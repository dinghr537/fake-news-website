import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import EditorStyle from './../style/Editor.module.scss'


// const tempNews = `<num>日美國總統<per0>與英國<en>首相<per1>於<loc0>舉行雙<en2>邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>...`;

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
        padding: "16 16 16 16",
        alignItems: "flex-start",
    },
    heading: {
        fontSize: "20",
        fontWeight: theme.typography.fontWeightRegular,
    },
    accordion: {
        backgroundColor: "black",
        color: "white",
        marginTop: "20",
        marginLeft: "20",
        marginRight: "20",
        "& .Mui-expanded": {
            border: "none",
        }
    },
    accordionSummary: {
        border: "1px solid white",
        borderRadius: "5px",
        // transition: "width 2s, height 4s",
    },
}))

function TagList(props) {
    /**
     * input needed: tagVariables -> States with {tag: tagContent}
     *               classes -> css from makeStyle
     *               value -> tags' value
     *               onChange -> handleTagChange
     */
    const list = [];
    const tagCollection = ['num', 'per', 'en', 'loc', 'org'];
    const orderedTagVariables = Object.keys(props.tagVariables).sort(new Intl.Collator('en', { numeric: true, sensitivity: 'accent' }).compare).reduce(
        (obj, key) => {
            obj[key] = props.tagVariables[key];
            return obj;
        },
        {}
    );
    for (const tag in orderedTagVariables) {
        console.log(tag);
        let tagNameWithoutNum = tag.replace(/[0-9]/g, '')
        if (!tagCollection.includes(tagNameWithoutNum)) {
            continue;
        }
        if (tagNameWithoutNum == "num" && tagNameWithoutNum != tag) {
            continue;
        }
        if (tagNameWithoutNum == "en" && tagNameWithoutNum != tag) {
            continue;
        }
        // let filteredTagName = tagCollection.includes(tagNameWithoutNum) ? tagNameWithoutNum : "others";
        list.push(
            <React.Fragment key={list.length}>
                <div className={EditorStyle['tag-name']}>
                    <span className={EditorStyle[tagNameWithoutNum]}>{tag}:</span>
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

export default function EditorContent() {
    /*
     * news:    fake news content
     * state:   user defined content for each tag
     * syncState:   We can directly use syncState when state hasn't been updated (cuz state is asynchronous)
     * permanentValue:  make sure useEffect will only execute once
     * useEffect:
     *   fetch: get fake news data
     *   then:  transfer to json format
     *   then:  update the news (setNews)
     *          find all the tags in the given fake news -> tags
     *          eliminate redundant tags -> tagSet
     *          split the fake news with tags to get a list of contents -> contentFragment
     *          cut the '<'/'>' of tags
     *          update the state (setState)
     *
     */
    const classes = useStyles();
    const [news, setNews] = useState("");

    const reG = /<[\w-]*>/g;
    const re = /(<[\w-]*>)/;

    const permanentValue = 1;
    useEffect(() => {
        fetch('/_hidden-news-data')
            .then(response => response.json())
            .then(json => {
                setNews(json.news);
                let tags = json.news.match(reG);
                let tagSet = new Set(tags);
                contentFragment = json.news.split(re);
                let tempState = {};
                for (const tag of tagSet) {
                    let innerTag = tag.substring(1, tag.length - 1)
                    tempState[innerTag] = innerTag;
                }
                setState(tempState);
                // done
            })
            .catch(err => console.log('Request Failed', err));
    }, [permanentValue]);

    // same code with useEffect, useful when didn't get anything
    let tags = news.match(reG);
    let tagSet = new Set(tags);
    let contentFragment = news.split(re);
    let tempState = {};
    for (const tag of tagSet) {
        let innerTag = tag.substring(1, tag.length - 1)
        tempState[innerTag] = innerTag;
    }

    const [state, setState] = React.useState({});
    let syncState = state;

    function handleTagChange(event) {
        setState({ ...state, [event.target.id]: [event.target.value] });
    }


    function handleEdit(event) {
        /*
         * update news with new content (setNews)
         * split the fake news and edit tags
         * assign previous state to the new state
         * update state (setState)
         */
        setNews(event.target.value);
        let syncNews = event.target.value;
        tags = syncNews.match(reG);
        tagSet = new Set(tags);
        contentFragment = syncNews.split(re);
        tempState = {};
        for (const tag of tagSet) {
            let innerTag = tag.substring(1, tag.length - 1)
            tempState[innerTag] = innerTag;
        }

        const keys = Object.keys(tempState);
        Object.assign(tempState, state);
        Object.keys(tempState)
            .filter(key => !keys.includes(key))
            .forEach(key => delete tempState[key]);
        setState(tempState);
        syncState = tempState;
    }

    // warp the tags with 'span' tag and their corresponding classes
    const tagCollection = ['num', 'per', 'en', 'loc', 'org']
    for (let i = 0; i < contentFragment.length; ++i) {
        if (tagSet.has(contentFragment[i])) {
            let innerTagName = contentFragment[i].substring(1, contentFragment[i].length - 1);
            let tagNameWithoutNum = innerTagName.replace(/[0-9]/g, '')
            if (tagNameWithoutNum == "num" && tagNameWithoutNum != innerTagName) {
                continue;
            }
            if (tagNameWithoutNum == "en" && tagNameWithoutNum != innerTagName) {
                continue;
            }
            if (tagCollection.includes(tagNameWithoutNum)) {
                // let filteredTagName = tagNameWithoutNum;
                contentFragment[i] = <span className={EditorStyle[tagNameWithoutNum]}>{state[innerTagName]}</span>;
            }
            // let filteredTagName = tagCollection.includes(tagNameWithoutNum) ? tagNameWithoutNum : "others";
            // contentFragment[i] = <span className={EditorStyle[filteredTagName]}>{state[innerTagName]}</span>;
        }
    }

    return (
        <>
            <div className={EditorStyle['whole-page']}>
                <div className={EditorStyle['container']}>
                    <Grid
                        className={EditorStyle['content']}
                        container
                        alignItems="flex-start"
                    >
                        <Grid
                            className={EditorStyle['content-signature']}
                            item xs={12} sm={8} md={5} lg={4} xl={3}
                        >
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
                                <Accordion className={classes.accordion}>
                                    <AccordionSummary
                                        className={classes.accordionSummary}
                                        expandIcon={<ExpandMoreIcon style={{ fill: "white" }} />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography className={classes.heading}>修改新聞內容</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TextField className={classes.editorField}
                                            id="news"
                                            multiline
                                            InputProps={{
                                                className: classes.editorField
                                            }}
                                            value={news}
                                            onChange={handleEdit}
                                            variant="outlined"
                                        />

                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </Grid>
                    </Grid>



                </div>
            </div>
        </>
    )
}