import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  return (
    
    <div className='p-10'
    style={{ marginLeft: '150px' }}
    >
      <h2 className='font-bold text-2xl' style={{ marginTop:'30px', marginBottom: '10px' }}>Dashboard</h2>
      <h3 className='text-gray-500' style={{ fontSize: 'medium'}}>Create and start your AI Mock Interview</h3>
      <div
        className="grid grid-cols-1 md:grid-cols-3 my-5 gap-4"
        style={{ height: '180px', width: '50vh' }}
      >
        <AddNewInterview/>
      </div>
      
      {/* Previous Interview List */}
      <InterviewList />
  
    </div>
  )
}

export default Dashboard