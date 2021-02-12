import React from 'react';
import { TextField, ActionButton } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import MoveUpDown from '@spectrum-icons/workflow/MoveUpDown';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => (
    <span className="hlx-List-SortableHandle" tabIndex={0}><MoveUpDown/></span>
));

const SortableItem = sortableElement(({ url, idx, handleDelete, handleChange }) =>
    <li className="hlx-List-item">
        <TextField
            label="Public URL"
            placeholder="https://adobe.com"
            value={url.publicUrl}
            onChange={(value) => handleChange(idx, 'publicUrl', value)} />
        <TextField
            label="Helix URL"
            placeholder="https://hlx.page"
            value={url.helixUrl}
            onChange={(value) => handleChange(idx, 'helixUrl', value)} />
        <ActionButton onPress={() => handleDelete(idx)}>
            <Delete />
        </ActionButton>
        <DragHandle />
    </li>
);

const SortableContainer = sortableContainer(({ children }) =>
    <ul className="hlx-List">{children}</ul>
);

const getSortableItems = (urls, handleDelete, handleChange) => {
    return urls.map((url, index) =>
        <SortableItem
            url={url}
            index={index}
            idx={index}
            key={`item-${index}`}
            handleDelete={handleDelete}
            handleChange={handleChange} />
    );
};

const URLPairList = ({ urls, handleDelete, handleChange, onSortEnd }) => {
    const children = getSortableItems(urls, handleDelete, handleChange);
    return (
        <SortableContainer useDragHandle onSortEnd={onSortEnd}>
            {children}
        </SortableContainer>
    );
};

export default URLPairList;