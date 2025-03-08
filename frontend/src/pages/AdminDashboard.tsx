
// import Header from '../components/admin/header/Header';
// import Sidebar from '../components/admin/sidebar/Sidebar';
// import DashboardContent from '../components/admin/dashboard/Dashboard-content';

// export default function AdminDashboard() {
//   return (
//     <div className="flex flex-col h-screen">
//       <Header />
//       {/* <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <main className="flex-1 overflow-auto">
//           <DashboardContent />
//         </main>
//       </div> */}
//     </div>
//   );
// }




// import Header from '../components/admin/header/Header';
// import Sidebar from '../components/admin/sidebar/Sidebar';
// // import DashboardContent from '../components/admin/dashboard/Dashboard-content';

// export default function AdminDashboard() {
//   return (
//     <>
//     <div className="">
//       {/* Header */}
//       <Header />
//     </div>
//     <div>
//     <Sidebar/>
//     </div>
//     </>
//   );
// }



// import Header from '../components/admin/header/Header';
// import Sidebar from '../components/admin/sidebar/Sidebar';

// export default function AdminDashboard() {
//   return (
//     <div className="flex flex-col h-screen ">
//       {/* Header */}
//       <Header />

//       {/* Main Content Area */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar (Sticky to the left and full height) */}
//         <Sidebar />

//         {/* Main Content (Takes Remaining Space) */}
//         <div className="flex-1 bg-gray-100 p-4 overflow-auto">
//           <h1 className="text-2xl font-semibold text-black">Admin Dashboard Content</h1>
//         </div>
//       </div>
//     </div>
//   );
// }

import CustomerDashboard from '../components/admin/dashboard/CustomerDashboard';
// import CustomerDashboard from '../components/admin/dashboard/CustomerDashboard';
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 bg-yellow-900">
        {/* Sidebar (Positioned Below Header & Stuck to the Left) */}
        <Sidebar />
        {/* <MainContent/> */}
        <CustomerDashboard/>
        
      </div>
    </div>
  );
}

