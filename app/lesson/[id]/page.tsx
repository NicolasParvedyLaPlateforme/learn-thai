import { getLessonData } from '../../actions/course';
import LessonClientPage from './components/LessonClientPage';

export const dynamic = 'force-dynamic';

export default async function LessonPage({ params }: any) {
  const lesson = await getLessonData(params.id);
  return <LessonClientPage lesson={lesson} />;
}
