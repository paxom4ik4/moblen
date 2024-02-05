export type TutorOrg = {
    email: string;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    org_name: string;
    photo: null | string;
    role: string;
    students_number: number;
    user_uuid: string;
}

import OrgIcon from 'assets/icons/org-icon.svg'


const TutorCard = ({tutor}: any) => {


    const numbers: any = {
        '0': 'учеников',
        '1': 'ученик',
        '2': 'ученика',
        '3': 'ученика',
        '4': 'ученика',
        '5': 'учеников',
    };

return (
    <div style={{width: '360px', height: '170px', display: 'flex', border: '1px solid grey', borderRadius: '20px', marginRight: '30px', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '110px', height: '110px', borderRadius: '100%', background: '#E1E2EC', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px'}}>{tutor?.photo ? <img src={tutor.photo} alt={'profile'} /> : <OrgIcon />}</div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div>{tutor.first_name}</div>
          <div>{tutor.last_name}</div>
          <div style={{color: 'grey'}}>{tutor.students_number} {tutor.students_number < 5 ? numbers[String(tutor.students_number)] : 'учеников'}</div>
          {/* <div>{balanceTutor}</div> */}
        </div>
        
    </div>
)
}

export default TutorCard;
