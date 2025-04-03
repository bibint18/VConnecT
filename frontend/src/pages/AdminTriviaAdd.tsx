
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import AdminTriviaForm from '@/components/admin/Trivia/AdminTriviaForm';

export default function AdminTriviaAddPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <AdminTriviaForm/>
      </div>
    </div>
  );
}



