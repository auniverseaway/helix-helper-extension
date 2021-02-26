const getToolbarContent = async () => {
    try {
        const res = await fetch('{{TEMP_SITE_TOOLBAR}}');
        return await res.text();
    } catch (e) {
        return '';
    }
};

const getToolbar = () => {
    const buildToolbar = () => {
        const body = document.querySelector('body');
        const toolbar = document.createElement('aside');
        toolbar.classList.add('hlx-Toolbar');
        const { actions } = window.hlxhlp.toolbar;
        if (actions && actions.length > 0) {
            actions.forEach(action => {
                const button = document.createElement('button');
                button.innerHTML = action.label;
                button.addEventListener('click', () => { action.func() });
                toolbar.insertAdjacentElement('beforeend', button);
            });
        }
        body.insertAdjacentElement('afterbegin', toolbar);
    };
    return `const buildToolbar = ${buildToolbar.toString()}; buildToolbar();`;
};

const injectScripts = async () => {
    const toolbar = document.querySelector('.hlx-Toolbar');
    if (!toolbar) {
        // Get script parts
        const helixHelp = 'window.hlxhlp = {};';
        const toolbarContent = await getToolbarContent();
        const toolbar = getToolbar();

        // Add the script tag
        const script = document.createElement('script');
        script.text = helixHelp + toolbarContent + toolbar;
        document.head.appendChild(script);
    };
};

injectScripts();