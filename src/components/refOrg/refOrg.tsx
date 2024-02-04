import { useQuery } from 'react-query';
import { getOrgLink } from '../../services/org/org';

const DEFAULT_CLASSNAME = 'ref_org';


const RefOrg = () => {

    const {data: refLink} = useQuery(['getOrgLink'], () => getOrgLink());
    return (
        <div className={DEFAULT_CLASSNAME} style={{width: '180px', height: '54px', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'
    }}>{refLink?.url}</div>
    )
};

export default RefOrg;