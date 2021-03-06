import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {StylesProvider} from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'

import EditorStyle from './../style/Editor.module.scss'

TagList.propTypes = {
    tagVariables: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
}

function TagList(props) {
    /**
     * input needed: tagVariables -> States with {tag: tagContent}
     *               classes -> css from makeStyle
     *               value -> tags' value
     *               onChange -> handleTagChange
     */
    const list = []
    const tagCollection = ['num', 'per', 'en', 'loc', 'org']
    const orderedTagVariables = Object.keys(props.tagVariables).sort(new Intl.Collator('en', {numeric: true, sensitivity: 'accent'}).compare).reduce(
        (obj, key) => {
            obj[key] = props.tagVariables[key]
            return obj
        },
        {},
    )
    for (const tag in orderedTagVariables) {
        if (typeof (tag) == 'string') {
            const tagNameWithoutNum = tag.replace(/[0-9]/g, '')
            if (!tagCollection.includes(tagNameWithoutNum)) {
                continue
            }
            if (tagNameWithoutNum == 'num' && tagNameWithoutNum != tag) {
                continue
            }
            if (tagNameWithoutNum == 'en' && tagNameWithoutNum != tag) {
                continue
            }
            list.push(
                <React.Fragment key={list.length}>
                    <div className={EditorStyle['tag-name']}>
                        <span className={EditorStyle[tagNameWithoutNum]}>{tag}:</span>
                    </div>
                    <TextField className={EditorStyle['input-text-field']}
                        id={tag}
                        multiline
                        InputProps={{
                            className: EditorStyle['input'],
                        }}
                        inputProps={{
                            className: EditorStyle['inner-input'],
                        }}
                        value={props.value[tag]}
                        onChange={props.onChange}
                        variant='outlined'
                    />
                </React.Fragment>,
            )
        }
    }

    const noTag = (
        <div className={EditorStyle['no-tag']}>
            <p>
                ????????????
            </p>
        </div>
    )
    const Tags = (
        <div className={EditorStyle['input-text-field-container']}>
            {list}
        </div>
    )
    if (list.length == 0) {
        return noTag
    } else {
        return Tags
    }
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
    const [news, setNews] = useState('')
    const [accordionState, setAccordionState] = useState(EditorStyle['accordion-summary'])

    const reG = /<[\w-]*>/g
    const re = /(<[\w-]*>)/

    const permanentValue = 1
    useEffect(() => {
        fetch('/_hidden-news-data')
            .then((response) => response.json())
            .then((json) => {
                setNews(json.news)
                const tags = json.news.match(reG)
                const tagSet = new Set(tags)
                contentFragment = json.news.split(re)
                const tempState = {}
                for (const tag of tagSet) {
                    const innerTag = tag.substring(1, tag.length - 1)
                    tempState[innerTag] = innerTag
                }
                setState(tempState)
                // done
            })
            .catch((err) => console.log('Request Failed', err))
    }, [permanentValue])

    // same code with useEffect, useful when didn't get anything
    let tags = news.match(reG)
    let tagSet = new Set(tags)
    let contentFragment = news.split(re)
    let tempState = {}
    for (const tag of tagSet) {
        const innerTag = tag.substring(1, tag.length - 1)
        tempState[innerTag] = innerTag
    }

    const [state, setState] = React.useState({})
    let syncState = state

    function handleTagChange(event) {
        setState({...state, [event.target.id]: [event.target.value]})
    }

    function handleAccordionChange(event, expanded) {
        if (expanded) {
            setAccordionState(EditorStyle['accordion-summary-expanded'])
        } else {
            setAccordionState(EditorStyle['accordion-summary'])
        }
    }

    function handleEdit(event) {
        /*
         * update news with new content (setNews)
         * split the fake news and edit tags
         * assign previous state to the new state
         * update state (setState)
         */
        setNews(event.target.value)
        const syncNews = event.target.value
        tags = syncNews.match(reG)
        tagSet = new Set(tags)
        contentFragment = syncNews.split(re)
        tempState = {}
        for (const tag of tagSet) {
            const innerTag = tag.substring(1, tag.length - 1)
            tempState[innerTag] = innerTag
        }

        const keys = Object.keys(tempState)
        Object.assign(tempState, state)
        Object.keys(tempState)
            .filter((key) => !keys.includes(key))
            .forEach((key) => delete tempState[key])
        setState(tempState)
        syncState = tempState
    }

    // warp the tags with 'span' tag and their corresponding classes
    const tagCollection = ['num', 'per', 'en', 'loc', 'org']
    for (let i = 0; i < contentFragment.length; ++i) {
        if (tagSet.has(contentFragment[i])) {
            const innerTagName = contentFragment[i].substring(1, contentFragment[i].length - 1)
            const tagNameWithoutNum = innerTagName.replace(/[0-9]/g, '')
            if (tagNameWithoutNum == 'num' && tagNameWithoutNum != innerTagName) {
                continue
            }
            if (tagNameWithoutNum == 'en' && tagNameWithoutNum != innerTagName) {
                continue
            }
            if (tagCollection.includes(tagNameWithoutNum)) {
                contentFragment[i] = <span className={EditorStyle[tagNameWithoutNum]}>{state[innerTagName]}</span>
            }
        }
    }

    return (
        <StylesProvider injectFirst>
            <div className={EditorStyle['whole-page']}>
                <div className={EditorStyle['container']}>
                    <Grid
                        className={EditorStyle['content']}
                        container
                    >
                        <Grid
                            className={EditorStyle['content-signature']}
                            item xs={12} sm={8} md={5} lg={4} xl={3}
                        >
                            <TagList tagVariables={syncState} value={state} onChange={handleTagChange} />
                        </Grid>
                        <Grid
                            className={EditorStyle['content-signature']}
                            item xs={12} sm={10} md={7} lg={6} xl={7}
                        >
                            <div>
                                <div className={EditorStyle['news']}>
                                    {contentFragment.map((item, index) => <span key={index}>{item}</span>)}
                                </div>
                                <Accordion className={EditorStyle['accordion']}
                                    onChange={handleAccordionChange}>
                                    <AccordionSummary
                                        className={accordionState}
                                        expandIcon={<ExpandMoreIcon style={{fill: 'white'}} />}
                                        aria-controls='panel1a-content'
                                        id='panel1a-header'
                                    >
                                        <Typography className={EditorStyle['heading']}>??????????????????</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TextField className={EditorStyle['editor-field']}
                                            id='news'
                                            multiline
                                            InputProps={{
                                                className: EditorStyle['editor-field'],
                                            }}
                                            inputProps={{
                                                className: EditorStyle['inner-input-edit-field'],
                                            }}
                                            value={news}
                                            onChange={handleEdit}
                                            variant='outlined'
                                        />

                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </StylesProvider>
    )
}
