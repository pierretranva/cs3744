// Author: Pierre Tran
//Date: 4/17/2023
import React, { useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import "./DataGrid.css"

let Grid = (props) =>
{
    const [selectedRows, setSelectedRows] = useState([])
    let data = props.data



    for(let i =0; i< data.length; i++)
    {
        data[i].id = i
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'Week',
          headerName: 'Week',
          width: 150,
        },
        {
          field: 'java',
          headerName: 'Java',
          width: 150,
        },
        {
            field: 'javascript',
            headerName: 'Javascript',
            width: 150,
          },
          {
            field: 'python',
            headerName: 'Python',
            width: 150,
          },
      ];
    const rows = data;

      const handleOnSelectedRow = (newItems) =>{
        setSelectedRows(newItems)
        props.callback(newItems)

      }


    return(
        <>
        <div id="dataGridContainer">
        <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 14,
            },
          },
        }}
        pageSizeOptions={[14]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={handleOnSelectedRow}
        rowSelectionModel={selectedRows}
      />
        </div>

        </>
    )
}
export default Grid;