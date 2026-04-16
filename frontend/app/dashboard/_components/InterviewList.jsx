// "use client"
// import { db } from '@/utils/db';
// import { MockInterview } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs'
// import { desc, eq } from 'drizzle-orm';
// import React, { useEffect, useState } from 'react'
// import interview from '../interview/[interviewId]/page';
// import { index } from 'drizzle-orm/gel-core';
// import InterviewItemCard from './InterviewItemCard';

// function InterviewList() {

//     const {user}=useUser();
//     const[interviewList,setInterviewList]=useState([]);

//     useEffect(()=>{
//         user&&GetInterviewList();
//     },[user])
    
//     const GetInterviewList=async()=>{
//         const result = await db.select()
//         .from(MockInterview)
//         .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
//         .orderBy(desc(MockInterview.id));

//         console.log(result);
//         setInterviewList(result);
//     }

//   return (
//     <div>
//         <h2>Previous Mock Interview</h2>

//         <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3' style={{ justifyItems:'center'}}>
//           {interviewList&&interviewList.map((interview, index)=>{
//              return <InterviewItemCard key={index} interview={interview} />
//           })}
//         </div>
//     </div>
//   )
// }

// export default InterviewList


"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.id));

        console.log(result);
        
        setInterviewList(result);
    }

    
    return (
        <div>
            <h2>Previous Mock Interview</h2>
            <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3' style={{ justifyItems: 'center' }}>
                {interviewList && interviewList.map((interview, index) => {
                   return(
                     <InterviewItemCard
                        key={index}
                        interview={interview}
                        onFeedback={() => router.push(`/dashboard/feedback/${interview.mockId}`)}
                        onStart={() => router.push(`/dashboard/interview/${interview.mockId}`)}
                    />
                   );
                })}
            </div>
        </div>
    )
}

export default InterviewList
