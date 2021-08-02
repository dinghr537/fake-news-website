import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";
import FakeNews from './FakeNews.js'
import { useState } from 'react';
import EditorStyle from './../style/Editor.module.scss'

const tempNews = `<num> 日美國<yy>總統<per0>與英國<en>首相<per1>於<loc0>舉行雙邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>...`;

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
}))

function TagList(props) {
    const list = [];
    // console.log(props.tagVariables);
    for (const tag in props.tagVariables) {
        list.push(
            <React.Fragment key={list.length}>
                <div className={EditorStyle['tag-name']}>
                    <span className={EditorStyle[tag.replace(/[0-9]/g, '')]}>{tag}:</span>
                </div>
                <TextField className={props.classes.inputTextField}
                    id={tag}
                    // label={tag}
                    multiline
                    InputProps={{
                        className: props.classes.input
                    }}
                    InputLabelProps={{
                        className: props.classes.label
                    }}
                    // rows={4}
                    // defaultValue="ovh cloud"
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

    const reG = /<\w*>/g;
    const re = /(<\w*>)/;



    let tags = tempNews.match(reG);
    let tagSet = new Set(tags);
    let contentFragment = tempNews.split(re);
    console.log(tagSet);
    // const arrFromSet = Array.from(tagSet);
    const tempState = {};
    for (const tag of tagSet) {
        let innerTag = tag.substring(1, tag.length - 1)
        tempState[innerTag] = innerTag;
    }
    // console.log("===============");
    // console.log(tempState);

    const [state, setState] = React.useState(tempState);


    function handleTagChange(event) {
        // console.log(event);
        setState({ ...state, [event.target.id]: [event.target.value] });
    }
    // let tagVariables = {
    //     num: 155,
    //     per0: "Rex",
    //     org0: "WHO",
    //     per1: "BCP",
    // }

    for (let i = 0; i < contentFragment.length; ++i) {
        if (tagSet.has(contentFragment[i])) {
            let innerTagName = contentFragment[i].substring(1, contentFragment[i].length - 1);
            contentFragment[i] = <span className={EditorStyle[innerTagName.replace(/[0-9]/g, '')]}>{state[innerTagName]}</span>;
            console.log(innerTagName);
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
                            <TagList tagVariables={state} classes={classes} value={state} onChange={handleTagChange} />
                        </Grid>
                        <Grid
                            className={EditorStyle['content-signature']}
                            item xs={12} sm={8} md={7} lg={6} xl={7}>
                            <div className={EditorStyle['news']} contentEditable="true">
                                {contentFragment.map((item, index) => <span key={index}>{item}</span>)}
                            </div>
                        </Grid>
                    </Grid>



                </div>
            </div>
        </>
    )
}