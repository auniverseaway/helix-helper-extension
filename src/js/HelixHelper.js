import React from 'react';
import { useState, useEffect } from 'react';
import { Provider,
         Heading,
         defaultTheme,
         Button,
         Flex,
         Text,
        } from '@adobe/react-spectrum';
import arrayMove from 'array-move';
import URLPairList from './URLPairList';

const BASE_URLS = { publicUrl: '', helixUrl: ''};

export default function HelixHelper({ browser }) {
    const [urls, setUrls] = useState([{...BASE_URLS}]);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        let haveUrls = false;
        const getSyncUrls = async () => {
                const results = await browser.storage.sync.get('urls');
                const storedUrls  = results.urls;
                if (storedUrls && !haveUrls) {
                    setUrls([...urls, ...storedUrls]);
                }
            };
        getSyncUrls();
        return () => haveUrls = true;
    }, []);

    const saveToBrowser = async () => {
        const currentUrls = [...urls];
        const firstUrl = currentUrls[0];
        if (!firstUrl.helixUrl && !firstUrl.publicUrl) {
            currentUrls.shift();
        }
        const setter = await browser.storage.sync.set({ urls: currentUrls });
        setChanged(false);
    }

    const handleDelete = (index) => {
        const currentUrls = [...urls];
        currentUrls.splice(index, 1);
        setUrls(currentUrls);
        setChanged(true);
    }

    const handleChange = (index, fieldName, value) => {
        const currentUrls = [...urls];
        currentUrls[index][fieldName] = value;
        setUrls(currentUrls);
        setChanged(true);
    };

    const onSortEnd = ({oldIndex, newIndex}) => {
        const currentUrls = arrayMove(urls, oldIndex, newIndex);
        setUrls(currentUrls);
    };

    const addNewUrl = () => {
        const currentUrls = [...urls];
        currentUrls.unshift({...BASE_URLS});
        setUrls(currentUrls);
        setChanged(true);
    }

    return (
        <Provider theme={defaultTheme}>
            <Flex justifyContent="center">
                <Flex width="600px" marginTop={12} direction="column" gap="size-100">
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
                            <URLPairList
                                urls={urls}
                                handleDelete={handleDelete}
                                handleChange={handleChange}
                                onSortEnd={onSortEnd} />
                        }
                </Flex>
            </Flex>
        </Provider>
    );
}