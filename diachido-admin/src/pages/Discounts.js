import { useState } from 'react';
import TableComponent from '../components/Discounts/TableComponent';
import AddDiscount from '../components/Discounts/AddDiscount';
import EditDiscount from '../components/Discounts/EditDiscount';

const Discounts = () => {
    const [type, setType] = useState('view'); // view, edit, add
    const [discount, setDiscount] = useState({});
    return (
        <>
            {type === 'view' && <TableComponent setType={setType} setDiscount={setDiscount} />}
            {type === 'add' && <AddDiscount setType={setType} />}
            {type === 'edit' && <EditDiscount setType={setType} discount={discount} />}
        </>
    );
};

export default Discounts;
