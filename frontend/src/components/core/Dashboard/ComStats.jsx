
import React, { useState, useEffect } from 'react'
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
  import { getCommunity } from "../../../services/operation/statisticsAPI";

const ComStats = () => {

  console.log("rendering settings");
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'problemId', //access nested data with dot notation
        header: 'Problem ID',
        size: 150,
      },
      {
        accessorKey: 'problemName',
        header: 'Problem Name',
        size: 150,
        Cell: ({ row }) => {
            const { problemName , problemLink="https://www.leetcode.com" } = row.original;
            const linkStyle = {color: 'blue', textDecoration: 'underline'};
            return (
              <a href={`${problemLink}`}>
                <p style={linkStyle}>{problemName}</p>
              </a>
            );
          },
      },
      {
        accessorKey: 'markForRevisit', //normal accessorKey
        header: 'Users with Revisit Mark',
        size: 200,
  
      },
      {
        accessorKey: 'problemTopic',
        header: 'Problem Topic',
        size: 150,
      }
    ],
    [],
  );

  const func = async () => {
      const temp = await getCommunity(token);
      setData(temp);
      console.log(data);
  };

  useEffect(() => {
    func();
  }, []);

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <>
    <div className="mt-8 mb-8">
      <h1 className="mb-5 text-3xl font-medium text-black-5">Community Statistics</h1>
      

    {/* MORE CODE */}
    <MaterialReactTable table={table} />
    
    </div> 
    </>
  )
}

export default ComStats