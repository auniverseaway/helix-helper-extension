const createShareFile = (item) => {
    // Create URL based on blob
    const blob = new Blob([ JSON.stringify(item) ], { type: 'octet/stream' });
    let url = null;
    url = URL.createObjectURL(blob);

    // Create hidden link
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.classList.add('hlx-HiddenShareLink');
    a.style = 'display: none';
    a.href = url;
    a.download = `${item.name.replace(/[^\w]/gi, '')}.hlxhlp`;

    // Check if we are testing, because this will trigger navigate.
    if (!window.hlxhlptest) {
        a.click();
    };

    // Clean things up
    window.URL.revokeObjectURL(url);
};

export default createShareFile;
