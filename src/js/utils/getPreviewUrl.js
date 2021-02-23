const getPreviewUrl = (url, project) => {
    return url.replace(project.liveUrl, project.previewUrl);
};

export default getPreviewUrl;