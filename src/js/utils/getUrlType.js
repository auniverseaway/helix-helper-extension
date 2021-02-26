const getUrlType = (url, liveUrl, previewUrl) => {
    return url.includes(liveUrl) ? 'live'
         : url.includes(previewUrl) ? 'preview'
         : null;
};

export default getUrlType;