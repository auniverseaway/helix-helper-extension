import browser from 'webextension-polyfill';
import React from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Provider,
         Heading,
         defaultTheme,
         Button,
         Flex,
         TextField,
         ActionButton,
         Text,
         } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import MoveUpDown from '@spectrum-icons/workflow/MoveUpDown';

const BASE_URLS = [{ publicUrl: '', helixUrl: ''}];

function URLPairList({ urls, handleDelete, handleChange }) {
    const listItems = urls.map((url, index) =>
        <Flex direction="row" alignItems="flex-end" gap="size-100" key={index} justifyContent="space-evenly">
            <TextField
                label="Public URL"
                placeholder="https://adobe.com"
                value={url.publicUrl}
                onChange={(value) => handleChange(index, 'publicUrl', value)} />
            <TextField
                label="Helix URL"
                placeholder="https://hlx.page"
                value={url.helixUrl}
                onChange={(value) => handleChange(index, 'helixUrl', value)} />
            <ActionButton onPress={() => handleDelete(index)}>
                <Delete />
            </ActionButton>
            <ActionButton isQuiet={true}>
                <MoveUpDown />
            </ActionButton>
        </Flex>
    );
    return listItems;
};

function App() {
    const [urls, setUrls] = useState(BASE_URLS);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        try {
            const getSyncUrls = async () => {
                const results = await browser.storage.sync.get('urls');
                // Return an empty array if there are no urls
                const storedUrls  = results.urls;
                console.log(results);
                if (storedUrls) {
                    setUrls([...urls, ...storedUrls]);
                }
            };
            getSyncUrls();
        } catch (error) {
            console.log('no can do');
        };
    }, []);

    saveToBrowser = async () => {
        const currentUrls = [...urls];
        const firstUrl = currentUrls[0];
        if (!firstUrl.helixUrl && !firstUrl.publicUrl) {
            currentUrls.shift();
        }
        const setter = await browser.storage.sync.set({ urls: currentUrls });
        setChanged(false);
    }

    handleDelete = (index) => {
        const currentUrls = [...urls];
        currentUrls.splice(index, 1);
        setUrls(currentUrls);
        setChanged(true);
    }

    handleChange = (index, fieldName, value) => {
        const currentUrls = [...urls];
        currentUrls[index][fieldName] = value;
        setUrls(currentUrls);
        setChanged(true);
    };

    addNewUrl = () => {
        const currentUrls = [...urls];
        currentUrls.unshift(BASE_URLS);
        setUrls(currentUrls);
        setChanged(true);
    }

    return (
        <Provider theme={defaultTheme}>
            <Flex justifyContent="center">
                <Flex width="500px" marginTop={12} direction="column" gap="size-100">
                    <Heading marginTop={0} level={1}>Helix Helper</Heading>
                        <Text>
                            This extension helps working with Helix content. 
                            Use the URLs below to map public URLs to Helix URLs for cache clearing.
                        </Text>
                        <Flex marginTop={12} justifyContent="space-between" alignItems="center" marginBottom={12}>
                            <Button variant="primary" onPress={addNewUrl}>Add new</Button>
                            {changed &&
                                <Text>You have unsaved changes.</Text>
                            }
                            <Button variant="cta" onPress={saveToBrowser}>Save</Button>
                        </Flex>
                        {urls[0] &&
                            <URLPairList urls={urls} handleDelete={handleDelete} handleChange={handleChange} />
                        }
                </Flex>
            </Flex>
        </Provider>
    );
}

render(<App/>, document.querySelector('main'));