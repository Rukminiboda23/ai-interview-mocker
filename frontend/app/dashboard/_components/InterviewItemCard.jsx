import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {

    const router=useRouter();

    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }

    const onFeedback=()=>{
        router.push('/dashboard/interview/'+interview.mockId+"/feedback")
    }

  return (
    <div 
    style={{
        background: 'white',
        borderRadius: '18px',
        boxShadow: '0 2px 12px rgba(44, 62, 80, 0.07)',
        border: '1px solid #e5e7eb',
        padding: '22px',
        marginBottom: '22px',
        minWidth: '320px',
        maxWidth: '340px',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
      }}
        onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(44, 62, 80, 0.13)'}
        onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(44, 62, 80, 0.07)'}
        >
        <h2  style={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: '#2a0acc',
          marginBottom: '6px'
        }}
        >{interview?.jobPosition}</h2>
        <h3
        style={{
          color: '#444',
          fontSize: '1rem',
          marginBottom: '4px'
        }}
        >{interview?.jobExperience} Years of Experience</h3>
        <h4>Created At :{interview.createdAt}</h4>
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px'}}>
            <button
            onClick={onFeedback}
            style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: '1px solid #3926B1',
                background: '#fff',
                color: '#3926B1',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 1px 3px rgba(44, 62, 80, 0.07)',
                transition: 'background 0.2s, color 0.2s'
            }}
            >
                Feedback
            </button>
            <button
            onClick={onStart}
            style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#2a0acc',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(44, 62, 80, 0.07)',
                transition: 'background 0.2s'
            }}
            >
                Start
            </button>
        </div>
    </div>
  )
}

export default InterviewItemCard



