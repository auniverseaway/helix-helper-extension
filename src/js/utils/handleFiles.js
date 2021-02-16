const ERROR = { error: 'We couldn\'t import a project.' };

const convertText = async (blob) => {
    try {
        const content = await blob.text();
        return JSON.parse(content);
    } catch(e) {
        return ERROR;
    }
};

const handleFileUpload = async (target) => {
    const { files } = target;
    if (files && files[0]) {
        return await convertText(files[0]);
    }
    return ERROR;
};

export { handleFileUpload, convertText };