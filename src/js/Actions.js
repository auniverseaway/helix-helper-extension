import React from 'react';
import { useState, useEffect } from 'react';
import '../less/actions.less';
import 'regenerator-runtime/runtime';

// Components
import {
    Divider,
    Grid,
    Image,
    Provider,
    Heading,
    darkTheme,
    ActionButton,
    Flex,
    Text,
} from '@adobe/react-spectrum';

// Icons
import Copy from '@spectrum-icons/workflow/Copy';
import Edit from '@spectrum-icons/workflow/Edit';
import Preview from '@spectrum-icons/workflow/Preview';
import DocumentRefresh from '@spectrum-icons/workflow/DocumentRefresh';
import Settings from '@spectrum-icons/workflow/Settings';
import HelpOutline from '@spectrum-icons/workflow/HelpOutline';

// Utils
import findProject from './utils/findProject';
import getEditUrl from './utils/getEditUrl';
import getPreviewUrl from './utils/getPreviewUrl';
import getTab from './utils/getTab';
import sendPurge from './utils/sendPurge';
import getUrlType from './utils/getUrlType';

// Constants
const SUCCESS_COLOR = '#3fc89c';
const INFO_COLOR = '#5aa9fa';
const ERROR_COLOR = '#ff7b82';

export default function Actions({ browser }) {
    const [tab, setTab] = useState();
    const [project, setProject] = useState();
    const [message, setMessage] = useState({});

    useEffect(() => {
        if (!tab) getTab(setTab, browser);
    }, []);

    useEffect(() => {
        if (tab && !project) findProject(setProject, tab.url, browser);
    }, [tab]);

    const sendMessage = (text, color, timeout) => {
        setMessage({ text, color });
        if (timeout) setTimeout(() => setMessage({}), 3000);
    };

    const createNewTab = (url) => {
        browser.tabs.create({ url, index: tab.index + 1 });
    };

    const handleEditButton = async () => {
        const url = getEditUrl(tab.url, project);
        if (url) createNewTab(url);
        if (!url) sendMessage('Nothing to edit.', ERROR_COLOR, true);
    };

    const handlePreviewButton = () => {
        const url = getPreviewUrl(tab.url, project);
        if (url) createNewTab(url);
        if (!url) sendMessage('Nothing to preview.', ERROR_COLOR, true);
    };

    const handleRefreshButton = async () => {
        const urlType = getUrlType(tab.url, project.liveUrl, project.previewUrl);
        let resp;
        if (urlType === 'live') {
            sendMessage('Clearing live cache...', INFO_COLOR, false);
            resp = await sendPurge(tab.url);
            if (resp.ok) sendMessage('Cache cleared!', SUCCESS_COLOR, true);
        }
        if (urlType === 'preview' || !resp.ok) {
            sendMessage('Clearing preview cache...', INFO_COLOR, false);
            const previewUrl = tab.url.replace(project.liveUrl, project.previewUrl);
            resp = await sendPurge(previewUrl);
            if (resp.ok) sendMessage('Cache cleared!', SUCCESS_COLOR, true);
        }
    };

    const handleCopyButton = async (e) => {
        const input = e.target.nextElementSibling;
        input.select();
        document.execCommand('copy');
        sendMessage('Copied!', SUCCESS_COLOR, true);
    };

    const handleOpenOptions = () => {
        browser.runtime.openOptionsPage();
    };

    return (
        <Provider theme={darkTheme}>
            <Flex justifyContent="center">
                <div className="hlx-PopoverActions">
                    <Flex justifyContent="space-between" alignItems="flex-end" marginBottom={12}>
                        <Flex alignItems="center">
                            <Image src="images/helix-logo.svg" UNSAFE_className="hlx-Logo" alt="Helix Helper" />
                            <Heading marginTop={0} level={1} UNSAFE_className="hlx-Title">Helix Helper</Heading>
                        </Flex>
                    </Flex>
                    <Divider marginBottom={6} />
                    {project &&
                        <Grid UNSAFE_className="hlx-PopoverButtons" columns={['1fr', '1fr']} wrap>
                            <ActionButton isQuiet onPress={handleEditButton}><Edit /> <Text>Edit</Text></ActionButton>
                            <ActionButton isQuiet onPress={handlePreviewButton}><Preview /> <Text>Preview</Text></ActionButton>
                            <ActionButton isQuiet onPress={handleRefreshButton}><DocumentRefresh /> <Text>Clear cache</Text></ActionButton>
                            <ActionButton isQuiet onPress={handleCopyButton}><Copy /> <Text>Copy link</Text></ActionButton>
                            <input id="hlx-CopyInput" type="text" defaultValue={tab.url} />
                        </Grid>
                    }
                    {!project &&
                        <Text>This page isn't part of a project, yet.</Text>
                    }
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text><em style={{color: message.color}}>{message.text}</em></Text>
                        <Flex justifyContent="end">
                            <ActionButton isQuiet justifySelf="start" onPress={handleOpenOptions} ><Settings /></ActionButton>
                            <ActionButton isQuiet justifySelf="start" ><HelpOutline /></ActionButton>
                        </Flex>
                    </Flex>
                </div>
            </Flex>
        </Provider>
    );
};