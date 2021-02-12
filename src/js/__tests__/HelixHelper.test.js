import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import 'regenerator-runtime/runtime';
import HelixHelper from '../HelixHelper';
import browser from '../__mocks__/mockBrowser';

const HLX_URL = 'https://helix.page';
const PUBLIC_URL = 'https://adobe.com';

const getUrlList = (doc) => {
    return doc.querySelector('.hlx-List');
}

const getTopButtons = (doc) => {
    return doc.querySelectorAll('[class^="_spectrum-Button_7a745"]');
};

const getTextFields = (parent) => {
    return parent.querySelectorAll('input[class^="_spectrum-Textfield"]');
}

const getDeleteButton = (parent) => {
    return parent.querySelector('[class^="_spectrum-ActionButton"]');
}

describe('first run', () => {
    test('The list should have one empty set of fields', () => {
        render(<HelixHelper browser={browser} />);
        const list = getUrlList(document);
        expect(list.children).toHaveLength(1);
    });

    test('There should be two header buttons', () => {
        render(<HelixHelper browser={browser} />);
        const topButtons = getTopButtons(document);
        expect(topButtons).toHaveLength(2);
    });

    test('The user can enter text into both fields', () => {
        render(<HelixHelper browser={browser} />);
        const list = getUrlList(document);
        const textfields = getTextFields(list.children[0]);
        expect(textfields).toHaveLength(2);

        userEvent.type(textfields[0], PUBLIC_URL);
        expect(textfields[0].value).toBe(PUBLIC_URL);

        userEvent.type(textfields[1], HLX_URL);
        expect(textfields[1].value).toBe(HLX_URL);
    });

    test('We warn of un-saved changes', () => {
        render(<HelixHelper browser={browser} />);
        const list = getUrlList(document);
        const textfields = getTextFields(list.children[0]);
        userEvent.type(textfields[0], PUBLIC_URL);
        expect(screen.getByText(/changes/i)).toBeDefined();
    });

    test('The user can delete a row in the list', () => {
        render(<HelixHelper browser={browser} />);
        const list = getUrlList(document);
        const deleteButton = getDeleteButton(list.children[0]);
        userEvent.click(deleteButton);
        const newList = getUrlList(document);
        expect(newList).toBeNull();
    });

    test('An empty row can be added', () => {
        render(<HelixHelper browser={browser} />);
        const topButtons = getTopButtons(document);
        userEvent.click(topButtons[0]);
        const list = getUrlList(document);
        expect(list.children).toHaveLength(2);
    });

    test('The user can save changes', async () => {
        render(<HelixHelper browser={browser} />);
        const list = getUrlList(document);
        const textfields = getTextFields(list.children[0]);

        userEvent.type(textfields[0], `${PUBLIC_URL}/save`);
        userEvent.type(textfields[1], `${HLX_URL}/save`);

        expect(screen.getByText(/changes/i)).toBeDefined();

        const topButtons = getTopButtons(document);

        await act(async () => {
            userEvent.click(topButtons[1]);
        });
        expect(screen.queryByText(/changes/i)).toBeNull();
    });

    test('We remove an the first empty on save', async () => {
        render(<HelixHelper browser={browser} />);
        const list = getUrlList(document);
        const textfields = getTextFields(list.children[0]);

        const topButtons = getTopButtons(document);

        // Click to add an empty row
        userEvent.click(topButtons[0]);

        await act(async () => {
            userEvent.click(topButtons[1]);
        });
        expect(browser.storage.sync.results.urls).toHaveLength(1);
    });
});

describe('second run', () => {
    test('The list should have two sets of fields', async () => {
        browser.storage.sync.results.urls = [
            { publicUrl: PUBLIC_URL, helixUrl: HLX_URL}
        ];
        await act(async () => {
            render(<HelixHelper browser={browser} />);
        });
        const list = getUrlList(document);
        expect(list.children).toHaveLength(2);
    });
});