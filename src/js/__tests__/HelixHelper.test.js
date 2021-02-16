import React from 'react';
import { cleanup, render, screen, fireEvent, createEvent } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import 'regenerator-runtime/runtime';
import HelixHelper from '../HelixHelper';
import browser from '../__mocks__/mockBrowser';
import { getMockFile, getTextMockFile } from '../__mocks__/mockFile';

window.hlxhlptest = process.env.JEST_WORKER_ID !== undefined;
window.URL.createObjectURL = function() {};
window.URL.revokeObjectURL = function() {};

const PROJECT_NAME = 'Adobe Inc';
const PREVIEW_URL = 'https://helix.page';
const LIVE_URL = 'https://adobe.com';
const CONTENT_URL = 'https://adobe.sharepoint/:f/:u/';

const getProjectList = (doc) => {
    return doc.querySelector('.hlx-List');
}

const getTopButtons = (doc) => {
    return doc.querySelectorAll('[class^="_spectrum-Button_"]');
};

const getUploadInput = (doc) => {
    return doc.querySelector('.hlx-FileUpload');
};

const getTextFields = (parent) => {
    return parent.querySelectorAll('input[class^="_spectrum-Textfield"]');
};

const getDeleteButton = (parent) => {
    return parent.querySelector('[data-key="delete"]');
};

const getEditButton = (parent) => {
    return parent.querySelector('[data-key="edit"]');
};

const getShareButton = (parent) => {
    return parent.querySelector('[data-key="share"]');
};

describe('first run', () => {
    test('The list should have one empty set of fields', () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        expect(list.children).toHaveLength(1);
    });

    test('The first item should be immediately editable', () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const textFields = getTextFields(list.children[0]);
        expect(textFields.length).toBeGreaterThan(1);
    });

    test('There should be two header buttons', () => {
        render(<HelixHelper browser={browser} />);
        const topButtons = getTopButtons(document);
        expect(topButtons).toHaveLength(2);
    });

    test('The user can enter text into all fields', () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const textfields = getTextFields(list.children[0]);
        expect(textfields).toHaveLength(4);

        userEvent.type(textfields[0], PROJECT_NAME);
        expect(textfields[0].value).toBe(PROJECT_NAME);

        userEvent.type(textfields[1], LIVE_URL);
        expect(textfields[1].value).toBe(LIVE_URL);

        userEvent.type(textfields[2], PREVIEW_URL);
        expect(textfields[2].value).toBe(PREVIEW_URL);

        userEvent.type(textfields[3], CONTENT_URL);
        expect(textfields[3].value).toBe(CONTENT_URL);
    });

    test('The user can delete an item in the list', () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const deleteButton = getDeleteButton(list.children[0]);
        userEvent.click(deleteButton);
        const newList = getProjectList(document);
        expect(newList).toBeNull();
    });

    test('We warn of un-saved changes', () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const textfields = getTextFields(list.children[0]);
        userEvent.type(textfields[1], LIVE_URL);
        expect(screen.getByText(/changes/i)).toBeDefined();
    });

    test('An empty row can be added', () => {
        render(<HelixHelper browser={browser} />);
        const topButtons = getTopButtons(document);
        userEvent.click(topButtons[1]);
        const list = getProjectList(document);
        expect(list.children).toHaveLength(2);
    });

    test('The user can save changes', async () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const textfields = getTextFields(list.children[0]);

        userEvent.type(textfields[1], `${LIVE_URL}/save`);
        userEvent.type(textfields[2], `${PREVIEW_URL}/save`);

        expect(screen.getByText(/changes/i)).toBeDefined();

        const topButtons = getTopButtons(document);

        await act(async () => {
            userEvent.click(topButtons[0]);
        });
        expect(screen.queryByText(/changes/i)).toBeNull();

        // Reset URLs
        browser.storage.sync.results.projects = [];
    });

    test('The user can toggle edit', async () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const editButton = getEditButton(list.children[0]);
        await act(async () => {
            userEvent.click(editButton);
        });
        let textFields = getTextFields(list.children[0]);
        expect(textFields).toHaveLength(0);
        await act(async () => {
            userEvent.click(editButton);
        });
        textFields = getTextFields(list.children[0]);
        expect(textFields).toHaveLength(4);
    });

    test('The user can import', async () => {
        const mockProject = { name: PROJECT_NAME, liveUrl: LIVE_URL, previewUrl: PREVIEW_URL, contentUrl: CONTENT_URL };
        const file = getMockFile(mockProject);
        const textFile = getTextMockFile('im just text');

        render(<HelixHelper browser={browser} />);
        const importButton = getTopButtons(document)[0];
        const uploadInput = getUploadInput(document);
        const inputSpy = jest.spyOn(uploadInput, 'click');
        await act(async () => {
            userEvent.click(importButton);
        });
        expect(inputSpy).toHaveBeenCalled();

        let list = getProjectList(document);
        expect(list.children).toHaveLength(1);

        await act(async () => {
            userEvent.upload(uploadInput, file);
        });
        list = getProjectList(document);
        expect(list.children).toHaveLength(2);
    });

    test('The user can\'t import bad files', async () => {
        render(<HelixHelper browser={browser} />);
        const uploadInput = getUploadInput(document);
        const textFile = getTextMockFile('im just text');
        let list = getProjectList(document);
        expect(list.children).toHaveLength(1);
        await act(async () => {
            userEvent.upload(uploadInput, textFile);
        });
        list = getProjectList(document);
        expect(list.children).toHaveLength(1);

        fireEvent.change(uploadInput, { target: { files: [] } });
        list = getProjectList(document);
        expect(list.children).toHaveLength(1);
    });

    test('The user can share', async () => {
        render(<HelixHelper browser={browser} />);
        const list = getProjectList(document);
        const shareButton = getShareButton(list.children[0]);
        await act(async () => {
            userEvent.click(shareButton);
        });
        const link = document.querySelector('.hlx-HiddenShareLink');
        expect(link).toBeDefined();
    });
});

describe('first run', () => {

});

describe('second run', () => {
    test('The list should have two projects', async () => {
        browser.storage.sync.results.projects = [
            { name: 'Adobe', liveUrl: LIVE_URL, previewUrl: PREVIEW_URL }
        ];
        await act(async () => {
            render(<HelixHelper browser={browser} />);
        });
        let list = getProjectList(document);
        expect(list.children).toHaveLength(2);

        list = getProjectList(document);
    });

    test('The second project should not be immediately editable', async () => {
        browser.storage.sync.results.projects = [
            { name: 'Adobe', liveUrl: LIVE_URL, previewUrl: PREVIEW_URL }
        ];
        await act(async () => {
            render(<HelixHelper browser={browser} />);
        });
        const list = getProjectList(document);
        const textFields = getTextFields(list.children[1]);
        expect(textFields).toHaveLength(0);
    });

    test('The second project should be told about a bad URL.', async () => {
        browser.storage.sync.results.projects = [
            { name: 'Adobe', liveUrl: 'yo mama', previewUrl: PREVIEW_URL }
        ];
        await act(async () => {
            render(<HelixHelper browser={browser} />);
        });
        const list = getProjectList(document);
        const textFields = getTextFields(list.children[1]);
        expect(textFields).toHaveLength(0);
    });
});