// https://www.adobe.com/reviews-api/dc/dev/convert-pdf.json
// https://adobe.sharepoint.com/:x:/r/sites/dexter/Shared%20Documents/Reviews/dc/dev/convert-pdf.xlsx?csf=1&web=1

const DRIVE_DOMAIN = 'drive.google.com';
const SHAREPOINT_STRING = 'sharepoint.com';

const HTML_EXT = '.html';
const JSON_EXT = '.json';
const WORD_EXT = '.docx';
const XLSX_EXT = '.xlsx';
const SHARE_QUERIES = '?csf=1&web=1';

const getContentType = (project) => {
    if (!project) return;
    const { contentUrl } = project;
    if (!contentUrl) return;
    if (contentUrl.includes(SHAREPOINT_STRING)) return 'sharepoint';
    if (contentUrl.includes(DRIVE_DOMAIN)) return 'gdrive';
    return;
}

const getSharePointUrl = (url) => {
    const fileUrl = url.includes(HTML_EXT)
        ? url.replace(HTML_EXT, WORD_EXT)
        : url.replace(JSON_EXT, XLSX_EXT);
    return `${fileUrl}${SHARE_QUERIES}`;
};

const getDriveUrl = (url) => {
    return url;
};

const getEditUrl = (url, project) => {
    // Replace live URL
    const liveToContent = url.replace(project.liveUrl, project.contentUrl);
    // Replace preview URL
    const contentUrl = liveToContent.replace(project.previewUrl, project.contentUrl);
    const contentType = getContentType(project);
    return contentType === 'sharepoint' ? getSharePointUrl(contentUrl) : getDriveUrl(contentUrl);
}

export default getEditUrl;