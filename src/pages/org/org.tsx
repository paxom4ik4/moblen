import {getTutorsForOrg} from '../../services/org/org';
import { useQuery } from 'react-query';
import TutorCard from './tutorCard';
import {TutorOrg} from './tutorCard'

const MainOrg = ()=> {

    const {data: tutorsForOrg} = useQuery(['getTutorsForOrg'], () => getTutorsForOrg());
    // console.log(tutorsForOrg)
    return(
        <div style ={{display: 'flex'}}>{tutorsForOrg?.map((el: TutorOrg) => {
            return <TutorCard key={tutorsForOrg?.indexOf(el)} tutor={el} />
        })}</div>
    )
};

export default MainOrg;