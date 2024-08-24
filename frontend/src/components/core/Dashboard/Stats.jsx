import React, { useState, useEffect } from 'react'
import CButton from '../homepage/CButton'
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {FcDocument} from 'react-icons/fc';
import { getMyStats, getMyStatsTopic } from "../../../services/operation/statisticsAPI";
import { useSelector } from 'react-redux';

const topics = [
    { topic: "ALL", index: 1 },
    { topic: "Arrays", index: 2 },
    { topic: "Backtracking and Recursion", index: 3 },
    { topic: "Binary Search", index: 4 },
    { topic: "Bit Manipulation", index: 5 },
    { topic: "Divide and Conquer", index: 6 },
    { topic: "Dynamic Programming", index: 7 },
    { topic: "Graphs", index: 8 },
    { topic: "Greedy", index: 9 },
    { topic: "Hashing", index: 10 },
    { topic: "Linked List", index: 11 },
    { topic: "Logic Building and Optimizations", index: 12 },
    { topic: "Map", index: 13 },
    { topic: "Monotonic Structures", index: 14 },
    { topic: "Prefix Sums", index: 15 },
    { topic: "Priority Queues", index: 16 },
    { topic: "Queues", index: 17 },
    { topic: "Range Query", index: 18 },
    { topic: "Sliding Window", index: 19 },
    { topic: "Sorting", index: 20 },
    { topic: "Special Algorithms", index: 21 },
    { topic: "Stack", index: 22 },
    { topic: "Strings", index: 23 },
    { topic: "Trees", index: 24 }
]

const Stats = ({ setConfirmationModel }) => {
  console.log("rendering settings");
  const [topic, setTopic] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  console.log("Topic", topic);

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
            const { problemName, problemLink="https://www.leetcode.com" } = row.original;
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
        header: 'Revisit',
        size: 200,
        Cell: ({ cell }) => {
            const value = cell.getValue();
            // Apply conditional styles to cell based on value
            const col = value === 0 ? "lightgreen" : (value === 1 ? "red" : "orange"); 
            const rowStyle = {
              backgroundColor: col
            };
            return (
              <div style={rowStyle}>
                {value}
              </div>
            );
          },
  
      },
      {
        accessorKey: 'problemTopic',
        header: 'Problem Topic',
        size: 150,
      },
      {
        // 5th column - custom button
        accessorKey: 'learning', 
        header: 'Learning',
        size: 100,
        Cell: ({ row }) => (
          <button 
            variant="contained"
            color="primary"
            onClick={() =>
                setConfirmationModel({
                    text1: "Learning",
                    text2: row.getValue('learning'),
                    btn1Text: "Ok",
                    btn1Handler: () => setConfirmationModel(null)
                })}
          >
            <FcDocument/>
          </button>
        ),
      },
      {
        // 6th column - custom button
        accessorKey: 'code',
        header: 'Code',
        size: 100,
        Cell: ({ row }) => (
          <button
            variant="contained"
            color="secondary"
            onClick={() => {
                console.log(row);
                setConfirmationModel({
                    text1: "Code",
                    text2: row.getValue('code'),
                    btn1Text: "Ok",
                    btn1Handler: () => setConfirmationModel(null)
                })}}
          >
            <FcDocument/>
          </button>
        ),
      },
    ],
    [],
  );

  const func = async () => {
    if(topic === "ALL")
    {
      const temp = await getMyStats(token);
      setData(temp);
      console.log(data);
    }
    else
    {
      const temp = await getMyStatsTopic(token, topic);
      setData(temp);
      console.log(data);
    }
    setLoading(false);
  };

  let table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  useEffect(() => {
    func();
  }, [topic]);

  // if(loading)
  // {
  //   return <div>LOADING!</div>
  // }




  return (
    <>
    <div className="mt-8 mb-8">
      <h1 className="mb-5 text-3xl font-medium text-black-5">Your Submissions</h1>
      <p><strong>Select a Topic</strong></p>
      <div className="w-maxContent justify-center rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 sm:px-12">
        <div className="flex items-center gap-y-3 gap-x-5 flex-wrap">
            {
                topics.map(({topic, index}) => (<CButton key={index} id={topic} setter={setTopic} active="true">{topic}</CButton>)) 
            }
        </div>
    </div>

    {/* MORE CODE */}
    <MaterialReactTable table={table} />
    
    </div>
       
    </>
  )
}


export default Stats