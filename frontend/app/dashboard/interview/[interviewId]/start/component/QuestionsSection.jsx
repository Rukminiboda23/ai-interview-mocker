import React from 'react'
import { Lightbulb, Volume2} from 'lucide-react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex}) {

    const textToSpeach=(text)=>{
        if ('speechSynthesis' in window) {
            const speech=new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        }
        else{
            alert('Sorry, your browser does not support')
        }
    }

  return mockInterviewQuestion&&(
    <div className='p-5 rounded-b-lg'>
        <div className='grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-5' style={{marginLeft:'15px'}}>
    
        {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
          <h3
            key={index}
            // className={
            //   `  rounded-full cursor-pointer text-center  ` +
            //   (activeQuestionIndex === index
            //     ? 'bg-primary text-white'
            //     : 'bg-secondary text-black')
            // }
            // style={{ width: '120px', padding: '5px', fontSize:'15px'}}

            onClick={() => setActiveQuestionIndex(index)} // if needed
            style={{
                width: '120px',
                padding: '5px',
                fontSize: '14px',
                borderRadius: '9999px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: activeQuestionIndex === index ? '#2563EB' : '#E5E7EB', // blue-600 or gray-200
                color: activeQuestionIndex === index ? '#FFFFFF' : '#000000', // white or black
                transition: 'all 0.2s ease-in-out'
            }}
          >
            Question #{index + 1}
          </h3>
        ))}

        </div>
        <h2 className='my-5 text-sm md-text-sm' style={{ margin:'20px 35px ', fontSize:'17px'}}>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <Volume2 onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)} style={{marginLeft:'35px', width:'20px'}}/>

        <div className="p-5 border rounded-lg  " style={{ width: '550px', backgroundColor:'#c3d9f1', marginTop:'80px', marginLeft:'25px'}}>
            <p className=" flex gap-2 items-center" style={{ fontSize:'16px', marginLeft:'10px', color: '#2a27a3'}}><Lightbulb/><strong>Note :</strong></p>
            <p style={{ marginLeft:'15px', fontSize:'16px', color: '#2f2cb8' }}>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</p>
        </div>

    </div>
  )
}

export default QuestionsSection
