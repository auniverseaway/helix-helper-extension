const reduceItems = (item) => {
    return item.reduce((items, item) => {
        if (item.name || item.liveUrl || item.previewUrl) {
            item.edit = false;
            item.imported = false;
            items.push(item);
        }
        return items;
    }, []);
};

export default reduceItems;