import { useState } from 'react';
import TableComponent from '../components/Stores/tableComponent';
import AddStore from './AddStore';
import EditStore from './EditStore';

const Stores = () => {
    const [type, setType] = useState('view'); // view, edit, add
    const [store, setStore] = useState({});
    return (
        <>
            {type === 'view' && <TableComponent setType={setType} setStore={setStore} />}
            {type === 'edit' && <EditStore setType={setType} store={store} />}
            {type === 'add' && <AddStore setType={setType} />}
        </>
    );
};

export default Stores;
