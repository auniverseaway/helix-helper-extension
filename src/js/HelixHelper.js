import React from 'react';
import { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import { Divider,
         Image,
         Provider,
         Heading,
         darkTheme,
         Button,
         Flex,
         Text,
        } from '@adobe/react-spectrum';
import arrayMove from 'array-move';
import URLPairList from './ProjectList';
import getSyncProjects from './utils/getSyncProjects';
import reduceItems from './utils/reduceItems';
import { handleFileUpload } from './utils/handleFiles';

const PROJECT_TEMPLATE = {
    name: '',
    liveUrl: '',
    previewUrl: '',
    contentUrl: '',
    toolbarUrl:'',
    edit: true,
};

export default function HelixHelper({ browser }) {
    const [projects, setProjects] = useState([{...PROJECT_TEMPLATE}]);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        let haveProjects = false;
        getSyncProjects(projects, setProjects, haveProjects, browser);
        return () => haveProjects = true;
    }, []);

    const saveToBrowser = async () => {
        const curProjects = reduceItems(projects);
        await browser.storage.sync.set({ projects: curProjects });
        setProjects(curProjects);
        setChanged(false);
    }

    const handleDelete = (index) => {
        const curProjects = [...projects];
        curProjects.splice(index, 1);
        setProjects(curProjects);
        setChanged(true);
    }

    const handleChange = (index, fieldName, value) => {
        const curProjects = [...projects];
        curProjects[index][fieldName] = value;
        setProjects(curProjects);
        setChanged(true);
    };

    const handleEdit = (index, isEdit) => {
        const curProjects = [...projects];
        curProjects[index].edit = isEdit;
        setProjects(curProjects);
    };

    const onSortEnd = ({oldIndex, newIndex}) => {
        setProjects(arrayMove(projects, oldIndex, newIndex));
        setChanged(true);
    };

    const addNewProject = (e, project) => {
        const curProjects = [...projects];
        const newProject = project ? {...project} : {...PROJECT_TEMPLATE};
        curProjects.unshift(newProject);
        setProjects(curProjects);
    };

    const handleUploadChange = async (e) => {
        const projectJson = await handleFileUpload(e.target);
        if (projectJson.error) {
            return;
        }
        projectJson.edit = false;
        projectJson.imported = true;
        addNewProject(null, projectJson);
        setChanged(true);
    };

    const addImport = (e) => {
        e.target.nextElementSibling.click();
    };

    return (
        <Provider theme={darkTheme}>
            <Flex justifyContent="center">
                <Flex width="736px" marginTop={12} direction="column" gap="size-100">
                    <Flex justifyContent="space-between" alignItems="flex-end" marginBottom={6}>
                        <Flex alignItems="center">
                            <Image src="images/helix-logo.svg" UNSAFE_className="hlx-Logo" alt="Helix Helper" />
                            <Heading marginTop={0} level={1} UNSAFE_className="hlx-Title">Helix Helper</Heading>
                        </Flex>
                        {changed && 
                        <Flex alignItems="center">
                            <Text marginEnd={12}><em>You have unsaved changes.</em></Text>
                            <Button variant="cta" onPress={saveToBrowser}>Save</Button>
                        </Flex>
                        }
                    </Flex>
                    <Divider />
                    <Flex marginTop={6} gap="size-125" justifyContent="end" alignItems="center" marginBottom={6}>
                        <Button variant="secondary" isQuiet onPress={addImport}>Import</Button>
                        <input className="hlx-FileUpload" type="file" onChange={handleUploadChange} />
                        <Button variant="primary" onPress={addNewProject}>Add new</Button>
                    </Flex>
                    {projects[0] &&
                        <URLPairList
                            projects={projects}
                            handleDelete={handleDelete}
                            handleChange={handleChange}
                            handleEdit={handleEdit}
                            onSortEnd={onSortEnd} />
                    }
                </Flex>
            </Flex>
        </Provider>
    );
}