const getUrlType = (url, liveUrl, previewUrl) => {
    return url.includes(liveUrl) ? 'live'
         : url.includes(previewUrl) ? 'unknown'
         : null;
};

export default getUrlType;