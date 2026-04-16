"use client";
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <>
      <div className="header-container">
        <div className="logo-container">
          <Image src="/logo1.png" width={210} height={80} alt="logo" />
        </div>
        <ul className="nav-list">
          <li className={`nav-item ${path === '/dashboard' ? 'active' : 'text-primary font-bold'}`}>Dashboard</li>
          <li className={`nav-item ${path === '/dashboard/questions' ? 'active' : 'text-primary font-bold'}`}>Questions</li>
          <li className={`nav-item ${path === '/dashboard/Upgrade' ? 'active' : 'text-primary font-bold'}`}>Upgrade</li>
          <li className={`nav-item ${path === '/dashboard/howitwork' ? 'active' : 'text-primary font-bold'}`}>How it works?</li>
        </ul>
        <div className="user-button">
          <UserButton />
        </div>
      </div>

      {/* ✅ Scoped styles for hover etc. */}
      <style jsx>{`
        .header-container {
          display: flex;
          padding: 0px 10px;
          align-items: center;
          justify-content: space-between;
          background-color: #e7e7e9;
          box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          margin: 10px;
        }

        .logo-container {
          flex-shrink: 0;
          padding: 6px;
        }

        .nav-list {
            display: none; /* hidden by default */
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 24px;
        }

        @media (min-width: 768px) {
            .nav-list {
                display: flex; /* shown on md and up */
            }
        }

        .nav-item {
          cursor: pointer;
          font-weight: 600;
          font-size: 17px;
          color: #333;
          padding: 6px 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .nav-item.active {
          color: #6c63ff;
          font-weight: 700;
        }

        .nav-item:hover {
          color: #6c63ff;
          background-color: #f0f0f5;
        }

        .user-button {
          margin: 6px;
        }
      `}</style>
    </>
  );
}

export default Header;



// "use client";
// import { UserButton } from '@clerk/nextjs';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import React, { useEffect } from 'react';

// function Header() {
//   const path = usePathname();

//   useEffect(() => {
//     console.log(path);
//   }, [path]);

//   return (
//     <div className="flex items-center justify-between bg-[#e7e7e9] shadow-md rounded-xl m-2 px-3 py-0">
//       <div className="flex-shrink-0 p-1.5">
//         <Image src="/logo1.png" width={210} height={80} alt="logo" />
//       </div>
//       <ul className="flex flex-row gap-8 list-none m-2 p-2">
//         <li
//           className={`cursor-pointer font-semibold text-[17px] px-2 py-1 rounded-lg transition-all
//             ${path === '/dashboard' ? 'text-[#6c63ff] font-bold' : 'text-primary font-bold hover:text-[#6c63ff] hover:bg-[#f0f0f5]'}
//           `}
//         >
//           Dashboard
//         </li>
//         <li
//           className={`cursor-pointer font-semibold text-[17px] px-2 py-1 rounded-lg transition-all
//             ${path === '/dashboard/questions' ? 'text-[#6c63ff] font-bold' : 'text-primary font-bold hover:text-[#6c63ff] hover:bg-[#f0f0f5]'}
//           `}
//         >
//           Questions
//         </li>
//         <li
//           className={`cursor-pointer font-semibold text-[17px] px-2 py-1 rounded-lg transition-all
//             ${path === '/dashboard/Upgrade' ? 'text-[#6c63ff] font-bold' : 'text-primary font-bold hover:text-[#6c63ff] hover:bg-[#f0f0f5]'}
//           `}
//         >
//           Upgrade
//         </li>
//         <li
//           className={`cursor-pointer font-semibold text-[17px] px-2 py-1 rounded-lg transition-all
//             ${path === '/dashboard/howitwork' ? 'text-[#6c63ff] font-bold' : 'text-primary font-bold hover:text-[#6c63ff] hover:bg-[#f0f0f5]'}
//           `}
//         >
//           How it works?
//         </li>
//       </ul>
//       <div className="m-1.5">
//         <UserButton />
//       </div>
//     </div>
//   );
// }

// export default Header;
