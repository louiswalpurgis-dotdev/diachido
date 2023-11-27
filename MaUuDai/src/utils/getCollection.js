function getCollection(collectionId, collections) {
    const matchedCollection = collections.find((collection) => collection.id === collectionId);
    return matchedCollection ? matchedCollection : { name: 'Unknown Collection' };
}

export default getCollection;
