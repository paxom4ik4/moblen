import {getTutorsForOrg} from '../../services/org/org';
import { useQuery } from 'react-query';
import TutorCard from './tutorCard';
import {TutorOrg} from './tutorCard'

const MainOrg = ()=> {

    const {data: tutorsForOrg} = useQuery(['getTutorsForOrg'], () => getTutorsForOrg());

    return(
        <div style ={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', overflowY: 'scroll'}}>
            {tutorsForOrg?.length ? tutorsForOrg?.map((el: TutorOrg) => {
            return <TutorCard key={tutorsForOrg?.indexOf(el)} tutor={el} />
        }): <div>В Вашей организации пока нет преподавателей</div>}</div>
    )
};

export default MainOrg;