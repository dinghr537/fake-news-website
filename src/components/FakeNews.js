import React from 'react'
import {useState} from 'react'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import {StylesProvider} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HelpIcon from '@material-ui/icons/Help'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

import DemoStyle from './../style/Demo.module.scss'
import HeaderStyle from './../style/Header.module.scss'

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}


export default function FakeNews() {
    /*
     *
     * title:       title content (input)
     * content:     part of the content (input)
     * topK:        topK (input)
     * maxSeqLen:   max sequence length (input)
     * output:      output fake news for display (output)
     * plainNews:   output fake news -> Plain Text (output)
     * xxxEl:       popover content's position
     * xxxOpen:     indicate popover's state
     *
     * fallBackNews:    If there's no fake news, fallBackNews will be displayed.
     * tags:            find all the tags in the given fake news
     * tagSet:          eliminate redundant tags
     * contentFragment: split the fake news with tags to get a list of contents
     * * * for example: '<per0>xxx<loc0>yyy' -> [ '', '<per0>', 'xxx', '<loc0>', 'yyy' ]
     *
     */
    const [title, setTitle] = useState('<num> 日美國總統<per0>與英國首相<per1>舉行雙邊會談，')
    const [content, setContent] = useState('兩人會後發布聯合聲明，<per0>表示支持<org0>...')
    const [topK, setTopK] = useState(5)
    const [maxSeqLen, setMaxSeqLen] = useState(300)
    const [output, setOutput] = useState(['尚無輸出。'])
    const [plainNews, setPlainNews] = useState('')
    const [buttonClickable, setButtonClickable] = useState(true)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [generateFinishSnackbarOpen, setGenerateFinishSnackbarOpen] = useState(false)

    // xEl means x's position
    const [topKEl, setTopKEl] = useState(null)
    const [maxSeqLenEl, setMaxSeqLenEl] = useState(null)
    const [xxxEl, setXxxEl] = useState(null)
    const [tntEl, setTntEl] = useState(null)
    const openTopK = Boolean(topKEl)
    const openMaxSeqLen = Boolean(maxSeqLenEl)
    const openXXX = Boolean(xxxEl)
    const openTNT = Boolean(tntEl)

    const placeHolderNews = output[0]
    const targetFinderG = /<[\w-]*>/g
    const targetFinder = /(<[\w-]*>)/
    let tags = placeHolderNews.match(targetFinderG)
    let tagSet = new Set(tags)
    let contentFragment = placeHolderNews.split(targetFinder)

    const handleTopKOn = (event) => {
        setTopKEl(event.currentTarget)
    }

    const handleMaxSeqLenOn = (event) => {
        setMaxSeqLenEl(event.currentTarget)
    }

    const handleTntOn = (event) => {
        setTntEl(event.currentTarget)
    }

    const handleXxxOn = (event) => {
        setXxxEl(event.currentTarget)
    }

    const handleClose = () => {
        setTopKEl(null)
        setMaxSeqLenEl(null)
        setTntEl(null)
        setXxxEl(null)
    }

    function handleTitleChange(event) {
        setTitle(event.target.value)
    }

    function handleContentChange(event) {
        setContent(event.target.value)
    }

    function handleTopKChange(event) {
        setTopK(event.target.value)
    }

    function handleMaxSeqLenChange(event) {
        setMaxSeqLen(event.target.value)
    }

    const handleSnackbarClose = (reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnackbarOpen(false)
    }

    const handleGenerateFinish = (reason) => {
        if (reason === 'clickaway') {
            return
        }
        setGenerateFinishSnackbarOpen(false)
    }

    function numberBackup(number, defaultNum) {
        number = Number(number)
        if (isNaN(number)) {
            return defaultNum
        } else {
            return Math.round(number) >= 1 ? Math.round(number) : defaultNum
        }
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
        setButtonClickable(false)
        setGenerateFinishSnackbarOpen(false)
        setSnackbarOpen(true)
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
                maxSeqLen: numberBackup(maxSeqLen, 300),
            }),
        })
            .then((response) => response.json())
            .then((myJson) => {
                setPlainNews(myJson.content)
                tags = myJson.content.match(targetFinderG)
                tagSet = new Set(tags)
                contentFragment = myJson.content.split(targetFinder)

                const tagCollection = ['num', 'per', 'en', 'loc', 'org']
                for (let i = 0; i < contentFragment.length; ++i) {
                    if (tagSet.has(contentFragment[i])) {
                        const innerTagName = contentFragment[i].substring(1, contentFragment[i].length - 1)
                        const tagNameWithoutNum = innerTagName.replace(/[0-9]/g, '')
                        const filteredTagName = tagCollection.includes(tagNameWithoutNum) ? tagNameWithoutNum : 'others'
                        contentFragment[i] = <span className={DemoStyle[filteredTagName]}>{innerTagName}</span>
                    }
                }
                setOutput(contentFragment)
                setButtonClickable(true)
                setSnackbarOpen(false)
                setGenerateFinishSnackbarOpen(true)
            })
    }

    function editInAnotherPage() {
        /*
         * Post the fake news to the server.
         * Then jump to the editor page.
         */
        alert('going')
        fetch('/post/_news-data', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                news: plainNews,
            }),
        })
        window.location.href = '/newsEditor.html'
    }


    return (
        <StylesProvider injectFirst>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity='info'>
                    假新聞生成中
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={generateFinishSnackbarOpen}
                autoHideDuration={6000}
                onClose={handleGenerateFinish}
            >
                <Alert onClose={handleGenerateFinish} severity='success'>
                    假新聞生成成功
                </Alert>
            </Snackbar>
            <div className={DemoStyle['io-container']}>
                <div className={DemoStyle['input-title']}>
                    <h3 className={DemoStyle['input-title-h3']}>新聞標題:</h3>
                    <div>

                        <TextField className={DemoStyle['input-text-field']}
                            id='title-of-news'
                            multiline
                            InputProps={{
                                className: DemoStyle['input-text-field'],
                            }}
                            inputProps={{
                                className: DemoStyle['inner-input-text'],
                            }}
                            value={title}
                            onChange={handleTitleChange}
                            variant='outlined'
                        />

                    </div>

                    <h3 className={DemoStyle['input-title-h3']}>部份內文:</h3>
                    <div className={DemoStyle['input-title-div']}>
                        <TextField className={DemoStyle['input-text-field']}
                            id='content-of-news'
                            multiline
                            InputProps={{
                                className: DemoStyle['input-text-field'],
                            }}
                            inputProps={{
                                className: DemoStyle['inner-input-text'],
                            }}
                            value={content}
                            onChange={handleContentChange}
                            variant='outlined'
                        />
                    </div>
                    <div className={DemoStyle['input-number-container']} noValidate>
                        <div className={DemoStyle['input-number-inner-container']}>
                            <TextField
                                id='top-k'
                                label='生成隨機性'
                                type='number'
                                value={topK}
                                onChange={handleTopKChange}
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,
                                        backgroundColor: 'black',
                                    },
                                }}

                                inputProps={{
                                    type: 'number',
                                    min: 1,
                                    className: DemoStyle['inner-input-number'],
                                }}
                                variant='outlined'
                            />
                            <IconButton aria-label='more' onClick={handleTopKOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                open={openTopK}
                                anchorEl={topKEl}
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
                                <Typography className={DemoStyle['popover']}>生成隨機性的解釋</Typography>
                            </Popover>
                        </div>
                        <div className={DemoStyle['input-number-inner-container']}>
                            <TextField
                                id='length'
                                label='生成長度'
                                type='number'
                                value={maxSeqLen}
                                onChange={handleMaxSeqLenChange}
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,
                                        backgroundColor: 'black',
                                    },
                                }}

                                inputProps={{
                                    type: 'number',
                                    min: 1,
                                    className: DemoStyle['inner-input-number'],
                                }}
                                variant='outlined'
                            /><IconButton aria-label='more' onClick={handleMaxSeqLenOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                open={openMaxSeqLen}
                                anchorEl={maxSeqLenEl}
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
                                <Typography className={DemoStyle['popover']}>生成長度的解釋</Typography>
                            </Popover>
                        </div>
                        <div className={DemoStyle['input-number-inner-container']}>
                            <TextField
                                label='XXX'
                                type='number'
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,
                                        backgroundColor: 'black',
                                    },
                                }}

                                inputProps={{
                                    type: 'number',
                                    min: 1,
                                    className: DemoStyle['inner-input-number'],
                                }}
                                variant='outlined'
                            />
                            <IconButton aria-label='more' onClick={handleXxxOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                // id={id}
                                open={openXXX}
                                anchorEl={xxxEl}
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
                                <Typography className={DemoStyle['popover']}>XXX 的解釋</Typography>
                            </Popover>
                        </div>
                        <div className={DemoStyle['input-number-inner-container']}>
                            <TextField
                                id='TNT'
                                label='TNT'
                                type='number'
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                        fontSize: 24,
                                        backgroundColor: 'black',
                                    },
                                }}

                                inputProps={{
                                    type: 'number',
                                    min: 1,
                                    className: DemoStyle['inner-input-number'],
                                }}
                                variant='outlined'
                            />
                            <IconButton aria-label='more' onClick={handleTntOn}>
                                <HelpIcon className={HeaderStyle['list-item-icon']} />
                            </IconButton>
                            <Popover
                                // id={id}
                                open={openTNT}
                                anchorEl={tntEl}
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
                                <Typography className={DemoStyle['popover']}>TNT 的解釋</Typography>
                            </Popover>
                        </div>
                    </div>
                    <div>

                    </div>
                    <div className={DemoStyle['btn-container']}>
                        <Button className={DemoStyle['button']}
                            color='secondary'
                            onClick={handleClickGenerate}
                            disabled={!buttonClickable}
                        >
                            生成新聞
                        </Button>
                    </div>
                </div>
            </div>

            <div className={DemoStyle['io-container']}>
                <div className={DemoStyle['output-title']}>
                    <h3 className={DemoStyle['output-title-h3']}>
                        News Output:
                    </h3>
                    <div className={DemoStyle['news']}>
                        {output.map((item, index) => <span key={index}>{item}</span>)}
                    </div>
                    <div className={DemoStyle['btn-container']}>
                        <Button className={DemoStyle['button']}
                            color='secondary'
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
