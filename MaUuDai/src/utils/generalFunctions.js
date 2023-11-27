export const TabTitle = (newTitle) => {
    return (document.title = `${newTitle} | ${process.env.REACT_APP_NAME}`);
};
