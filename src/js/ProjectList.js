import React from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { ActionGroup, Item, Flex, Link, Text, TextField, View } from '@adobe/react-spectrum';
import Edit from '@spectrum-icons/workflow/Edit';
import Share from '@spectrum-icons/workflow/Share';
import Delete from '@spectrum-icons/workflow/Delete';
import Move from '@spectrum-icons/workflow/Move';
import NoEdit from '@spectrum-icons/workflow/NoEdit';
import cleanUrl from './utils/cleanUrl';
import createShareFile from './utils/createShareFile';

const DragHandle = sortableHandle(() => (
    <span className="hlx-List-itemHandle" tabIndex={0}><Move /></span>
));

const SortableItem = sortableElement(({ project, idx, handleDelete, handleChange, handleEdit }) => {
    const handleAction = (idx, value) => {
        switch(value) {
            case 'delete': handleDelete(idx);
                break;
            case 'edit': !project.edit ? handleEdit(idx, true) : handleEdit(idx, false);
                break;
            case 'share': createShareFile(project);
        }
    };

    const justifyFooter = () => {
        return project.imported ? 'space-between' : 'flex-end';
    }

    return (
        <li className="hlx-List-item">
            <View
                borderWidth="thin"
                borderColor="dark"
                width="100%"
                borderRadius="medium"
                padding="size-125"
                marginBottom={12}>
                {!project.edit &&
                    <div className="hlx-List-contentContainer">
                        <h3>{project.name}</h3>
                        <p>Live</p>
                        <Link isQuiet>
                            <a href={project.liveUrl} target="_blank">{cleanUrl(project.liveUrl)}</a>
                        </Link>
                        <p>Preview</p>
                        <Link isQuiet>
                            <a href={project.previewUrl} target="_blank">{cleanUrl(project.previewUrl)}</a>
                        </Link>
                        <p>Content</p>
                        <Link isQuiet>
                            <a href={project.contentUrl} target="_blank">{cleanUrl(project.contentUrl)}</a>
                        </Link>
                    </div>
                }
                {project.edit &&
                    <div className="hlx-List-fieldContainer">
                        <TextField
                            label="Project name"
                            placeholder="Adobe Dot Com"
                            value={project.name}
                            onChange={(value) => handleChange(idx, 'name', value)}
                            width="100%" />
                        <TextField
                            label="Live site"
                            placeholder="www.adobe.com"
                            value={project.liveUrl}
                            onChange={(value) => handleChange(idx, 'liveUrl', value)}
                            width="100%" />
                        <TextField
                            label="Preview site"
                            placeholder="hlx.page"
                            value={project.previewUrl}
                            onChange={(value) => handleChange(idx, 'previewUrl', value)}
                            width="100%" />
                        <TextField
                            label="Content site"
                            placeholder="adobe.sharepoint.com"
                            value={project.contentUrl}
                            onChange={(value) => handleChange(idx, 'contentUrl', value)}
                            width="100%" />
                    </div>
                }
                <Flex justifyContent={justifyFooter()} alignItems="center" UNSAFE_className="hlx-List-itemFooter">
                    {project.imported && 
                        <Text><em>Imported project</em></Text>
                    }
                    <ActionGroup isQuiet onAction={(value) => handleAction(idx, value)}>
                        <Item key="edit" aria-label="Edit">
                            {project.edit ? <NoEdit /> : <Edit />}
                        </Item>
                        <Item key="share" aria-label="Share"><Share /></Item>
                        <Item key="delete" aria-label="Delete"><Delete /></Item>
                    </ActionGroup>
                </Flex>
                <DragHandle />
            </View>
        </li>
    );
});

const SortableContainer = sortableContainer(({ children }) =>
    <ul className="hlx-List">{children}</ul>
);

const getSortableItems = (projects, handleDelete, handleChange, handleEdit) => {
    return projects.map((project, index) =>
        <SortableItem
            project={project}
            index={index}
            idx={index}
            key={`item-${index}`}
            handleDelete={handleDelete}
            handleChange={handleChange}
            handleEdit={handleEdit} />
    );
};

const ProjectList = ({ projects, handleDelete, handleChange, handleEdit, onSortEnd }) => {
    const children = getSortableItems(projects, handleDelete, handleChange, handleEdit);
    return (
        <SortableContainer useDragHandle onSortEnd={onSortEnd} axis="xy">
            {children}
        </SortableContainer>
    );
};

export default ProjectList;