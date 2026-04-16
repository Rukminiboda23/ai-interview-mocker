"use client"
import { button } from "@/components/ui/button";
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";
import { useParams, useRouter } from 'next/navigation';


function Interview() {
    const params = useParams();
    const interviewId = params.interviewId;
    const router = useRouter();

    const [interviewData,setInterviewData]=useState();
    const [webCamEnabled,setWebCamEnabled]=useState(false);

    useEffect(()=>{
        console.log(interviewId)
        GetInterviewDetails();
    },[]);

    /**
     * used to Get Interview Details by Mock/Interview Id
     */
    const GetInterviewDetails=async()=>{
        const result=await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId))

        setInterviewData(result[0]);
        
    }
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 w-full">
  <h2 className="font-bold text-2xl text-center gap-40" style={{marginBottom:'50px'}}>Let's Get Started</h2>

  {/* 2 Column Layout */}
  <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-2 gap-10" style={{ justifyItems:'center'}}>
    
    {/* LEFT: Job Info */}
    <div className="bg-white p-6 text-left" style={{width: '600px', fontSize:'large'}}>
        <div className=" rounded-lg border shadow" style={{ height: '200px', borderColor:'blue', fontWeight:'20px'}}>
            <p className="text-sm " style={{marginTop:'30px', marginLeft:'30px'}}>Job Role/Job Position: {interviewData?.jobPosition}</p>
            <p className="text-sm" style={{ marginTop:'10px', marginLeft:'30px'}}>Job Description/Tech Stack: {interviewData?.jobDesc}</p>
            <p className="text-sm" style={{  marginTop:'10px', marginLeft:'30px'}}>Years of Experience: {interviewData?.jobExperience}</p>
        </div>
        <div className="p-5 border rounded-lg  " style={{ width: '600px', backgroundColor:'#ffffb7', marginTop:'20px', borderColor:'yellow'}}>
            <p className=" flex gap-2 items-center" style={{ fontSize:'18px', marginLeft:'10px', color: '#e6ac00'}}><Lightbulb/><strong>Information</strong></p>
            <p style={{ margin:'15px', fontSize:'16px' }}>{process.env.NEXT_PUBLIC_INFORMATION}</p>
        </div>
    </div>

    {/* RIGHT: Webcam Section */}
     <div style={{justifyItems:'center'}}>
             {webCamEnabled? <Webcam
             onUserMedia={()=>setWebCamEnabled(true)}
             onUserMediaError={()=>setWebCamEnabled(false)}
             mirrored={true}
             style={{
                 height:300,
                 width:400
             }}
             />
             :
             < >
               <WebcamIcon className='p-20 bg-secondary rounded-lg border text-gray-700' style={{ padding: '72px 72px', width: '400px', height:'140px'}}/>
               <div>
               <button onClick={()=>setWebCamEnabled(true)}  className=' bg-secondary rounded-sm border text-gray-700 hover:scale-105 hover:shadow-md cursor-pointer' style={{ marginTop:'10px', padding: '5px 5px', width: '210px', height:'30px'}}>Enable WebCam & Microphone</button>
               </div>
             </>
            }
            <div style={{ marginTop:'80px', marginLeft:'300px'}}>
                <button
                    onClick={() => router.push(`/dashboard/interview/${interviewId}/start`)}
                    className="rounded-sm border"
                    style={{ color: 'white', backgroundColor: 'blue', marginTop: '10px', padding: '5px 5px', width: '122px', height: '33px' }}
                >
                    Start Interview
                </button>
            </div>
     </div>
     
  </div>
</div>

  )
}

export default Interview