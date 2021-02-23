import DistributeLeftEdge from "@spectrum-icons/workflow/DistributeLeftEdge";

const DRIVE_DOMAIN = 'drive.google.com';
const SHAREPOINT_STRING = 'sharepoint.com';

const getContentType = (project) => {
    if (!project) return;
    const { contentUrl } = project;
    if (!contentUrl) return;
    if (contentUrl.includes(SHAREPOINT_STRING)) return 'sharepoint';
    if (contentUrl.includes(DRIVE_DOMAIN)) return 'gdrive';
    return;
}

export default getContentType;