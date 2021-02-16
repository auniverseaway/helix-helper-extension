const getMockFile = (mockProject) => {
    const blob = new Blob([ JSON.stringify(mockProject) ], { type: 'octet/stream' });
    const file = new File([ blob ], 'adobe.hlxhlp', { type: 'application/json' });
    file.text = () => {
        return JSON.stringify(mockProject);
    };
    return file;
}

const getTextMockFile = (text) => {
    return new File([ text ], 'adobe.hlxhlp', { type: 'application/json' });
};

export { getMockFile, getTextMockFile };

