import React from 'react';
import { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import { StylesProvider } from '@material-ui/core/styles';
import DemoStyle from './../style/Demo.module.scss'
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import { keys } from '@material-ui/core/styles/createBreakpoints';

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
            width: 200,
        },
        color: 'white',
        fontSize: "24",
        paddingTop: 40,
        // paddingBottom: 50,
        // paddingLeft: 30,
    },
    KVInput: {
        color: 'white',
        fontSize: "24",
        // width: 150,
    },
    button: {
        backgroundColor: '#3c52b2',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#3c52b2',
        },
        width: '100%',
    }
}));



export default function FakeNews() {
    const classes = useStyles();
    const [title, setTitle] = useState('<num> 日美國總統<per0>與英國首相<per1>舉行雙邊會談，');
    const [content, setContent] = useState('兩人會後發布聯合聲明，<per0>表示支持<org0>...');
    const [topK, setTopK] = useState(5);
    const [output, setOutput] = useState("");
    const [targetLength, setTargetLength] = useState(300);
    const [row, setRow] = useState(6);

    function handleTitle(event) {
        setTitle(event.target.value);
    };

    function handleContent(event) {
        setContent(event.target.value);
    }

    function handleOutput(event) {
        setOutput(event.target.value);
    }

    function handleTopK(event) {
        setTopK(event.target.value);
    }

    function handleTargetLength(event) {
        setTargetLength(event.target.value);
    }

    function handleRow(event) {
        setRow(event.target.value);
    }

    function numberBackup(number, defaultNum) {
        if (isNaN(number) || number === "")
            return defaultNum;
        else
            return Math.round(number) >= 1 ? Math.round(number) : defaultNum;
    }


    function handleClick() {
        alert("click");
        console.log(title);
        console.log(content);
        console.log(numberBackup(topK, 5));
        console.log(numberBackup(targetLength, 300));
        fetch('/post/some-data', {
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
        }).then(response => response.json())
            .then(myJson => {
                setOutput(myJson.content);
                // setRow("");
                // console.log(myJson.content.length);
            })

    }



    return (
        <StylesProvider injectFirst>
            <div className={DemoStyle['IO-container']}>
                <div className={DemoStyle['input-title']}>
                    <h3 className={DemoStyle['input-title-h3']}>新聞標題:</h3>
                    <div>

                        <TextField className={classes.input}
                            id="title-of-news"
                            // label="title"
                            multiline
                            InputProps={{
                                className: classes.input
                            }}
                            // rows={4}
                            // defaultValue="<num> 日美國總統<per0>與英國首相<per1>舉行雙邊會談，"
                            value={title}
                            onChange={handleTitle}
                            variant="outlined"
                        />

                    </div>

                    <h3 className={DemoStyle['input-title-h3']}>部份內文:</h3>
                    <div className={DemoStyle['input-title-div']}>
                        <TextField className={classes.input}
                            id="content-of-news"
                            // label="some contents"
                            multiline
                            InputProps={{
                                className: classes.input
                            }}
                            // rows={4}
                            // defaultValue="兩人會後發布聯合聲明，<per0>表示支持<org0>..."
                            value={content}
                            onChange={handleContent}
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.inputNumberContainer} noValidate>
                        {/* <p> Top K </p> */}
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
                        />
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

                    </div>
                    <div>


                    </div>
                    <div className={DemoStyle['btn-container']}>
                        <Button className={classes.button}
                            // variant="outlined"
                            color="secondary"
                            onClick={handleClick}
                        >
                            生成新聞
                        </Button>
                    </div>
                </div>
            </div>

            {/* output part */}

            <div className={DemoStyle['IO-container']}>
                <div className={DemoStyle['output-title']}>
                    <h3 className={DemoStyle['output-title-h3']}>
                        Type of Tags:
                    </h3>
                    <div className={DemoStyle['output-title-desc']}>
                        <p className={DemoStyle['org']}>org ➜ O &nbsp;</p>
                        <p className={DemoStyle['per']}>per ➜ P &nbsp;</p>
                        <p className={DemoStyle['loc']}>loc ➜ L &nbsp;</p>
                        <p className={DemoStyle['num']}>num ➜ N &nbsp;</p>
                        <p className={DemoStyle['en']}>en ➜ E &nbsp;</p>
                    </div>
                    <h3 className={DemoStyle['output-title-h3']}>
                        News Output:
                    </h3>
                    <TextField className={classes.input}
                        id="content-of-output"
                        // label="some contents"
                        disabled
                        multiline
                        InputProps={{
                            className: classes.input,
                            rowsMin: 4
                        }}
                        // rows={row}
                        placeholder={"尚無輸出"}
                        // defaultValue="兩人會後發布聯合聲明，<per0>表示支持<org0>..."
                        value={output}
                        onChange={handleOutput}
                        variant="outlined"
                    />
                    {/* <div className={DemoStyle['output-content']} id={"output-content"}>

                </div> */}
                </div>



            </div>
        </StylesProvider>

    )
}