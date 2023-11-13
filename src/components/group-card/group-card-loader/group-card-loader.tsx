import Skeleton from '@mui/material/Skeleton';

import '../group-card.scss';

const DEFAULT_CLASSNAME = 'group-card';

export default function GroupCardLoader() {
  return (
    <div className={DEFAULT_CLASSNAME} style={{ display: 'flex', width: '320px' }}>
      <Skeleton className={`${DEFAULT_CLASSNAME}_icon`} variant="circular" width={90} height={90} />
      <div className={`${DEFAULT_CLASSNAME}_text`}>
        <Skeleton variant="text" sx={{ width: 176, height: 24, fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ width: 176, fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ width: 176, height: 36, fontSize: '1rem' }} />
      </div>
    </div>
  );
}
