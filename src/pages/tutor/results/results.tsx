import { FC } from 'react';

import './results.scss';
import { Groups } from '../groups/groups.tsx';
import { Tests } from '../../student/tests/tests.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store.ts';

const DEFAULT_CLASSNAME = 'results';

export const Results: FC = () => {
  const { selectedStudent } = useSelector((state: RootState) => state.results);

  return (
    <div className={`${DEFAULT_CLASSNAME} ${!!selectedStudent && 'results-show-results'}`}>
      <div className={`${DEFAULT_CLASSNAME}_groups`}>
        <Groups viewMode />
      </div>
      {!!selectedStudent && (
        <div className={`${DEFAULT_CLASSNAME}_tests`}>
          <Tests resultsView />
        </div>
      )}
    </div>
  );
};
