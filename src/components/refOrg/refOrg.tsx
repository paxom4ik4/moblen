import { useQuery } from 'react-query';
import { useState } from 'react';
import { getOrgLink, refreshOrgLink } from '../../services/org/org';
import LinkIcon from 'assets/icons/link-icon.svg';
import RefreshIcon from 'assets/icons/refresh-icon.svg';
import { useMutation, useQueryClient } from 'react-query';
import { Notification } from 'common/notification/notification.tsx';
import './refOrg.scss';
const DEFAULT_CLASSNAME = 'ref_org';


const RefOrg = () => {
    const queryClient = useQueryClient();
    const refreshGroupLinkMutation = useMutation(() => refreshOrgLink(), {
        onSuccess: () => queryClient.invalidateQueries('refreshOrgLink'),
      });
    const handlerRefreshRefLink = async () => await refreshGroupLinkMutation.mutate();
    const [copiedToClipboard, setCopiedTopClipboard] = useState(false);

    const {data: refLink} = useQuery(['getOrgLink'], () => getOrgLink());
    return (
        <div className={`${DEFAULT_CLASSNAME}`}>
          <div 
            className={`${DEFAULT_CLASSNAME}_buttons-referral`}
            onClick={() => {
                setCopiedTopClipboard(true);
                navigator.clipboard.writeText(refLink?.url);
            }} 
          >
            <Notification
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                message={'Реферальная ссылка скопирована'}
                open={copiedToClipboard}
                onClose={() => setCopiedTopClipboard(!copiedToClipboard)}
            />
            <LinkIcon />
            <div className={`${DEFAULT_CLASSNAME}_buttons-referral-link`}>{refLink?.url}</div>
          </div>
          <button onClick={handlerRefreshRefLink} style={{marginLeft: '11px', width: '55px', height: '55px', borderRadius: '45%', background: 'white', border: '1px solid grey', cursor: 'pointer'}}>
            <RefreshIcon />
          </button>
        </div>
    )
};

export default RefOrg;