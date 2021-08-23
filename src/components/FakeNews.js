import React from 'react';
import { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import { StylesProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import DemoStyle from './../style/Demo.module.scss'
import HeaderStyle from './../style/Header.module.scss'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    input: {
        width: 650,
        maxWidth: "100%",
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
        minHeight: "150",
        alignItems: "start",
        color: 'white',
        fontSize: "20",
        ['@media (min-width:600px)']: {
            fontSize: "24",
        },
    },
    inputNumberContainer: {
        width: 650,
        maxWidth: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        ['@media (max-width:643px)']: {
            justifyContent: "space-around",
        },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(200, 200, 200)"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(235, 250, 173)"
        },
        '& .MuiTextField-root': {
            margin: theme.spacing(2, 0),
            width: 150,
        },
        color: 'white',
        fontSize: "24",
        paddingTop: 40,
    },
    KVInput: {
        color: 'white',
        fontSize: "24",
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
    typography: {
        padding: theme.spacing(2),
    },
}));



export default function FakeNews() {
    /*
     *
     * title:       title content (input)
     * content:     part of the content (input)
     * topK:        topK (input)
     * targetLength: targetLength (input)
     * output:      output fake news for display (output)
     * plainNews:   output fake news -> Plain Text (output)
     * anchorEl:    object needed for material design's popover
     * open:        indicate popover's state
     * id:          object needed for material design's popover
     *
     * fallBackNews:    If there's no fake news, fallBackNews will be displayed.
     * tags:            find all the tags in the given fake news
     * tagSet:          eliminate redundant tags
     * contentFragment: split the fake news with tags to get a list of contents
     * * * for example: "<per0>xxx<loc0>yyy" -> [ '', '<per0>', 'xxx', '<loc0>', 'yyy' ]
     *
     */
    const classes = useStyles();
    const [title, setTitle] = useState('<num> 日美國總統<per0>與英國首相<per1>舉行雙邊會談，');
    const [content, setContent] = useState('兩人會後發布聯合聲明，<per0>表示支持<org0>...');
    const [topK, setTopK] = useState(5);
    const [targetLength, setTargetLength] = useState(300);
    const [output, setOutput] = useState(["尚無輸出。。。"]);
    const [plainNews, setPlainNews] = useState("");
    const [buttonClickable, setButtonClickable] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [generateFinishSnackbarOpen, setGenerateFinishSnackbarOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let fallBackNews = "尚無輸出";
    const reG = /<[\w-]*>/g;
    const re = /(<[\w-]*>)/;
    let tags = fallBackNews.match(reG);
    let tagSet = new Set(tags);
    let contentFragment = fallBackNews.split(re);

    const handleAnchorOn = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleTitle(event) {
        setTitle(event.target.value);
    };

    function handleContent(event) {
        setContent(event.target.value);
    }

    function handleTopK(event) {
        setTopK(event.target.value);
    }

    function handleTargetLength(event) {
        setTargetLength(event.target.value);
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleGenerateFinishSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setGenerateFinishSnackbarOpen(false);
    };

    function numberBackup(number, defaultNum) {
        if (isNaN(number) || number === "")
            return defaultNum;
        else
            return Math.round(number) >= 1 ? Math.round(number) : defaultNum;
    }


    function handleClickGenerate() {
        /*
         * fetch:   First start a post request with proper parameters in the request body.
         * then:    After getting the response, transfer it to the json format.
         * then:    update the plainNews (setPlainNews)
         *          find all the tags in the given fake news -> tags
         *          eliminate redundant tags -> tagSet
         *          split the fake news with tags to get a list of contents -> contentFragment
         *          warp the tags with 'span' tag and their corresponding classes
         *          update the output (setOutput)
         */
        setButtonClickable(false);
        setGenerateFinishSnackbarOpen(false);
        setSnackbarOpen(true);
        // alert("start to generate fake news");
        console.log(buttonClickable);
        fetch('/post/_generate-fake-news', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content,
                topK: numberBackup(topK, 5),
                targetLength: numberBackup(targetLength, 300),
            })
        })
            .then(response => response.json())
            .then(myJson => {
                setPlainNews(myJson.content);
                tags = myJson.content.match(reG);
                tagSet = new Set(tags);
                contentFragment = myJson.content.split(re);

                const tagCollection = ['num', 'per', 'en', 'loc', 'org']
                for (let i = 0; i < contentFragment.length; ++i) {
                    if (tagSet.has(contentFragment[i])) {
                        let innerTagName = contentFragment[i].substring(1, contentFragment[i].length - 1);
                        let tagNameWithoutNum = innerTagName.replace(/[0-9]/g, '')
                        let filteredTagName = tagCollection.includes(tagNameWithoutNum) ? tagNameWithoutNum : "others";
                        contentFragment[i] = <span className={DemoStyle[filteredTagName]}>{innerTagName}</span>;
                    }
                }
                setOutput(contentFragment);
                setButtonClickable(true);
                setSnackbarOpen(false);
                setGenerateFinishSnackbarOpen(true);
            })

    }

    function editInAnotherPage() {
        /*
         * Post the fake news to the server.
         * Then jump to the editor page.
         */
        alert("going");
        fetch('/post/_news-data', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                news: plainNews
            })
        })
        window.location.href = '/newsEditor.html';
    }


    return (
        <StylesProvider injectFirst>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="info">
                    假新聞生成中
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                open={generateFinishSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleGenerateFinishSnackbarClose}
            >
                <Alert onClose={handleGenerateFinishSnackbarClose} severity="success">
                    假新聞生成成功
                </Alert>
            </Snackbar>
            <div className={DemoStyle['IO-container']}>
                <div className={DemoStyle['input-title']}>
                    <h3 className={DemoStyle['input-title-h3']}>新聞標題:</h3>
                    <div>

                        <TextField className={classes.input}
                            id="title-of-news"
                            multiline
                            InputProps={{
                                className: classes.input
                            }}
                            value={title}
                            onChange={handleTitle}
                            variant="outlined"
                        />

                    </div>

                    <h3 className={DemoStyle['input-title-h3']}>部份內文:</h3>
                    <div className={DemoStyle['input-title-div']}>
                        <TextField className={classes.input}
                            id="content-of-news"
                            multiline
                            InputProps={{
                                className: classes.input
                            }}
                            value={content}
                            onChange={handleContent}
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.inputNumberContainer} noValidate>
                        <div>
                            <TextField
                                id="top-k"
                                label="生成隨機性"
                                type="number"
                                value={topK}
                                onChange={handleTopK}
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,
                                    },
                                }}
                                InputProps={{
                                    inputProps: {
                                        type: 'number',
                                        min: 1,
                                    },
                                    className: classes.KVInput
                                }}
                                variant="outlined"
                            />
                            <IconButton aria-label="more" onClick={handleAnchorOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography className={classes.typography}>The content of the Popover.</Typography>
                            </Popover>
                        </div>
                        <div>
                            <TextField
                                id="length"
                                label="生成長度"
                                type="number"
                                value={targetLength}
                                onChange={handleTargetLength}
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,

                                    },
                                }}
                                InputProps={{
                                    inputProps: {
                                        type: 'number',
                                        min: 1,
                                    },
                                    className: classes.KVInput
                                }}
                                variant="outlined"
                            /><IconButton aria-label="more" onClick={handleAnchorOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography className={classes.typography}>The content of the Popover.</Typography>
                            </Popover>
                        </div>
                        <div>
                            <TextField
                                id="XXX"
                                label="XXX(anyway)"
                                type="number"
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,

                                    },
                                }}
                                InputProps={{
                                    inputProps: {
                                        type: 'number',
                                        min: 1,
                                        defaultValue: 20,
                                    },
                                    className: classes.KVInput
                                }}
                                variant="outlined"
                            />
                            <IconButton aria-label="more" onClick={handleAnchorOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography className={classes.typography}>The content of the Popover.</Typography>
                            </Popover>
                        </div>
                        <div>
                            <TextField
                                id="TNT"
                                label="TNT"
                                type="number"
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,

                                    },
                                }}
                                InputProps={{
                                    inputProps: {
                                        type: 'number',
                                        min: 1,
                                        defaultValue: 300,
                                    },
                                    className: classes.KVInput
                                }}
                                variant="outlined"
                            />
                            <IconButton aria-label="more" onClick={handleAnchorOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography className={classes.typography}>The content of the Popover.</Typography>
                            </Popover>
                        </div>
                    </div>
                    <div>

                    </div>
                    <div className={DemoStyle['btn-container']}>
                        <Button className={classes.button}
                            color="secondary"
                            onClick={handleClickGenerate}
                            disabled={!buttonClickable}
                        >
                            生成新聞
                        </Button>
                    </div>
                </div>
            </div>

            {/* output part */}

            <div className={DemoStyle['IO-container']}>
                <div className={DemoStyle['output-title']}>
                    {/* <h3 className={DemoStyle['output-title-h3']}>
                        Type of Tags:
                    </h3>
                    <div className={DemoStyle['output-title-desc']}>
                        <p className={DemoStyle['org']}>org ➜ O &nbsp;</p>
                        <p className={DemoStyle['per']}>per ➜ P &nbsp;</p>
                        <p className={DemoStyle['loc']}>loc ➜ L &nbsp;</p>
                        <p className={DemoStyle['num']}>num ➜ N &nbsp;</p>
                        <p className={DemoStyle['en']}>en ➜ E &nbsp;</p>
                    </div> */}

                    <h3 className={DemoStyle['output-title-h3']}>
                        News Output:
                    </h3>
                    <div className={DemoStyle['news']}>
                        {output.map((item, index) => <span key={index}>{item}</span>)}
                    </div>
                    <div className={DemoStyle['btn-container']}>
                        <Button className={classes.button}
                            // variant="outlined"
                            color="secondary"
                            onClick={editInAnotherPage}
                        >
                            編輯新聞
                        </Button>
                    </div>
                </div>



            </div>
        </StylesProvider>

    )
}