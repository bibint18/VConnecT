
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import ListTrivia from '@/components/admin/Trivia/ListTrivia';

export default function AdminTriviaPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <ListTrivia/>
      </div>
    </div>
  );
}



